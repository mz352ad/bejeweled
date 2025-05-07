/**
 * Initialize Bejeweled game when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});

/**
 * Initialize the game board and setup
 */
function initializeGame() {
    const standardBoard = document.querySelector('table.standard-board');

    if (!standardBoard) return;

    const originalBoard = [];
    const rows = standardBoard.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const rowData = [];
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
            const img = cell.querySelector('img');
            if (img && img.src) {
                const parts = img.src.split('/');
                const filename = parts[parts.length - 1];
                const gemType = filename.split('.')[0];
                rowData.push(gemType);
            } else {
                rowData.push('purple');
            }
        });
        originalBoard.push(rowData);
    });

    const gameContainer = document.createElement('div');
    gameContainer.id = 'bejeweled-game';

    let gameHTML = `
    <div class="game-board-container">
      <div class="score-display">
        <i class="fas fa-trophy" style="color: var(--yellow);"></i>
        Score: <strong id="game-score">0</strong>
      </div>
      
      <div class="game-board">`;

    for (let y = 0; y < originalBoard.length; y++) {
        gameHTML += `<div class="board-row">`;
        for (let x = 0; x < originalBoard[y].length; x++) {
            const gemType = originalBoard[y][x];
            gameHTML += `
            <div class="gem-cell" data-x="${x}" data-y="${y}">
                <img class="gem-image" src="/css/images/${gemType}.png" alt="Gem">
            </div>`;
        }
        gameHTML += `</div>`;
    }

    gameHTML += `
      </div>
      
      <div class="game-message" style="display: none">
        <span id="game-message-text"></span>
      </div>
    </div>`;

    gameContainer.innerHTML = gameHTML;

    standardBoard.parentNode.replaceChild(gameContainer, standardBoard);

    const scoreElement = document.getElementById('current-score');
    if (scoreElement) {
        const scoreValue = scoreElement.innerText;
        document.getElementById('game-score').innerText = scoreValue;
    }

    addGemEventListeners();
    addGameStyles();
}

const gameState = {
    selectedGem: null,
    board: []
};

/**
 * Add click event listeners to all gem cells
 */
function addGemEventListeners() {
    document.querySelectorAll('.gem-cell').forEach(cell => {
        cell.addEventListener('click', handleGemClick);
    });
}

/**
 * Handle gem click event
 */
function handleGemClick(event) {
    const cell = event.currentTarget;
    const x = parseInt(cell.getAttribute('data-x'));
    const y = parseInt(cell.getAttribute('data-y'));

    cell.classList.add('gem-pop');
    setTimeout(() => {
        cell.classList.remove('gem-pop');
    }, 300);

    if (!gameState.selectedGem) {
        gameState.selectedGem = { x, y };
        cell.classList.add('gem-selected');
        return;
    }

    if (gameState.selectedGem.x === x && gameState.selectedGem.y === y) {
        gameState.selectedGem = null;
        cell.classList.remove('gem-selected');
        return;
    }

    const dx = Math.abs(gameState.selectedGem.x - x);
    const dy = Math.abs(gameState.selectedGem.y - y);

    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        const firstCell = document.querySelector(`.gem-cell[data-x="${gameState.selectedGem.x}"][data-y="${gameState.selectedGem.y}"]`);
        firstCell.classList.remove('gem-selected');

        swapGems(gameState.selectedGem.x, gameState.selectedGem.y, x, y);

        gameState.selectedGem = null;
    } else {
        const firstCell = document.querySelector(`.gem-cell[data-x="${gameState.selectedGem.x}"][data-y="${gameState.selectedGem.y}"]`);
        firstCell.classList.remove('gem-selected');

        gameState.selectedGem = { x, y };
        cell.classList.add('gem-selected');

        showMessage("Select an adjacent gem");
    }
}

/**
 * Swap two gems on the board
 */
function swapGems(x1, y1, x2, y2) {
    const cell1 = document.querySelector(`.gem-cell[data-x="${x1}"][data-y="${y1}"]`);
    const cell2 = document.querySelector(`.gem-cell[data-x="${x2}"][data-y="${y2}"]`);

    if (!cell1 || !cell2) return;

    const img1 = cell1.querySelector('img');
    const img2 = cell2.querySelector('img');
    const src1 = img1.src;
    const src2 = img2.src;

    animateSwap(cell1, cell2, () => {
        fetch("/bejeweled/swap", {
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `x1=${x1}&y1=${y1}&x2=${x2}&y2=${y2}`
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Request error');
                }
                return response.json();
            })
            .then(data => {
                if (data.moved) {
                    const scoreElement = document.getElementById('game-score');
                    const oldScore = parseInt(scoreElement.innerText);
                    scoreElement.innerText = data.score;

                    const originalScore = document.getElementById('current-score');
                    if (originalScore) {
                        originalScore.innerText = data.score;
                    }

                    if (data.score > oldScore) {
                        showScoreIncrease(data.score - oldScore);
                    }

                    if (data.board) {
                        updateBoard(data.board);
                    }
                } else {
                    img1.src = src1;
                    img2.src = src2;

                    showMessage("Invalid move");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                img1.src = src1;
                img2.src = src2;
                showMessage("Connection error");
            });
    });
}

/**
 * Animate the swapping of two gems
 */
function animateSwap(cell1, cell2, callback) {
    const rect1 = cell1.getBoundingClientRect();
    const rect2 = cell2.getBoundingClientRect();

    const deltaX = rect2.left - rect1.left;
    const deltaY = rect2.top - rect1.top;

    cell1.classList.add('gem-swap');
    cell2.classList.add('gem-swap');

    cell1.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    cell2.style.transform = `translate(${-deltaX}px, ${-deltaY}px)`;

    setTimeout(() => {
        cell1.style.transform = '';
        cell2.style.transform = '';

        cell1.classList.remove('gem-swap');
        cell2.classList.remove('gem-swap');

        const img1 = cell1.querySelector('img');
        const img2 = cell2.querySelector('img');
        const tempSrc = img1.src;
        img1.src = img2.src;
        img2.src = tempSrc;

        if (callback) callback();
    }, 300);
}

/**
 * Update the game board with new data from server
 */
function updateBoard(newBoard) {
    for (let y = 0; y < newBoard.length; y++) {
        for (let x = 0; x < newBoard[y].length; x++) {
            const cell = document.querySelector(`.gem-cell[data-x="${x}"][data-y="${y}"]`);
            if (cell) {
                const img = cell.querySelector('img');
                if (img) {
                    const currentGem = img.src.split('/').pop().split('.')[0];
                    const newGem = newBoard[y][x].toLowerCase();

                    if (currentGem !== newGem) {
                        cell.classList.add('gem-fade');

                        setTimeout(() => {
                            cell.classList.remove('gem-fade');
                            img.src = `/css/images/${newGem}.png`;

                            cell.classList.add('gem-pop');
                            setTimeout(() => {
                                cell.classList.remove('gem-pop');
                            }, 300);
                        }, 300);
                    }
                }
            }
        }
    }
}

/**
 * Show animation for score increase
 */
function showScoreIncrease(amount) {
    const scoreDisplay = document.querySelector('.score-display');

    if (scoreDisplay) {
        scoreDisplay.classList.add('score-change');
        setTimeout(() => {
            scoreDisplay.classList.remove('score-change');
        }, 500);

        const scorePopup = document.createElement('div');
        scorePopup.className = 'score-popup';
        scorePopup.textContent = `+${amount}`;
        scorePopup.style.cssText = `
            position: absolute;
            color: #1ed760;
            font-weight: bold;
            font-size: 24px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            pointer-events: none;
            animation: scoreFloat 1.5s forwards;
        `;

        document.body.appendChild(scorePopup);

        setTimeout(() => {
            document.body.removeChild(scorePopup);
        }, 1500);
    }
}

/**
 * Display game message to user
 */
function showMessage(text) {
    const messageContainer = document.querySelector('.game-message');
    const messageText = document.getElementById('game-message-text');

    if (messageContainer && messageText) {
        messageText.textContent = text;
        messageContainer.style.display = 'block';

        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 2000);
    }
}

/**
 * Add CSS styles for the game interface
 */
function addGameStyles() {
    if (!document.getElementById('bejeweled-game-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'bejeweled-game-styles';
        styleElement.textContent = `
        .game-board-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0 auto;
            max-width: 100%;
            padding: 0 5px;
        }
        
        .game-board {
            background: linear-gradient(135deg, #1e3191 0%, #142066 100%);
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.3);
            padding: 10px;
            margin: 15px 0;
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .board-row {
            display: flex;
            justify-content: center;
            gap: 5px;
        }
        
        .gem-cell {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            cursor: pointer;
            transition: transform 0.2s, background-color 0.2s;
            overflow: hidden;
            position: relative;
        }
        
        .gem-cell:hover {
            background-color: rgba(255, 255, 255, 0.15);
        }
        
        .gem-selected {
            background-color: rgba(255, 255, 255, 0.3) !important;
            transform: scale(1.1);
            z-index: 10;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
        
        .gem-swap {
            z-index: 10;
        }
        
        .gem-image {
            width: 90%;
            height: 90%;
            object-fit: contain;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
            transition: transform 0.2s;
        }
        
        .game-message {
            background-color: #1e3191;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 8px;
            margin: 10px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            position: absolute;
            top: 60px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;
            font-weight: bold;
        }
        
        .score-display {
            background: linear-gradient(135deg, #1e3191 0%, #142066 100%);
            border-radius: 15px;
            padding: 15px 25px;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            border-left: 4px solid #1ed760;
            font-size: 1.2rem;
        }
        
        .score-change {
            animation: scoreChange 0.5s ease-in-out;
        }
        
        @keyframes scoreChange {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); background: linear-gradient(135deg, #25409c 0%, #1e3191 100%); }
            100% { transform: scale(1); }
        }
        
        @keyframes scoreFloat {
            0% { opacity: 0; transform: translate(-50%, 0); }
            10% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; transform: translate(-50%, -100px); }
        }
        
        @keyframes gemPop {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        @keyframes gemFade {
            0% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.1); }
        }
        
        .gem-pop {
            animation: gemPop 0.3s ease-in-out;
        }
        
        .gem-fade {
            animation: gemFade 0.5s forwards;
        }
        
        @media (min-width: 768px) {
            .gem-cell {
                width: 60px;
                height: 60px;
            }
        }
        `;

        document.head.appendChild(styleElement);
    }
}