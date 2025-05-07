/**
 * Mobile Bejeweled Interface
 * Provides touch-friendly interface for mobile devices
 */

document.addEventListener('DOMContentLoaded', function() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
        initializeMobileUI();
    }
});

/**
 * Initialize the mobile UI
 */
function initializeMobileUI() {
    const standardTable = document.querySelector('table.standard-board');
    if (standardTable) {
        standardTable.style.display = 'none';
    }

    const mobileContainer = document.getElementById('mobile-game-container') || document.createElement('div');
    if (!mobileContainer.id) {
        mobileContainer.id = 'mobile-game-container';
        const targetContainer = document.querySelector('main');
        const standardBoardContainer = document.querySelector('table.standard-board').parentNode;
        targetContainer.insertBefore(mobileContainer, standardBoardContainer.nextSibling);
    }

    const boardData = getBoardFromDOM();
    const initialScore = document.getElementById('current-score')?.innerText || '0';

    mobileContainer.innerHTML = `
    <div class="mobile-board-container">
      <div class="mobile-score-display">
        <i class="fas fa-trophy" style="color: var(--yellow);"></i>
        Score: <strong id="mobile-score">${initialScore}</strong>
      </div>
      
      <div class="mobile-game-board">
        ${generateMobileBoardHTML(boardData)}
      </div>
      
      <div class="mobile-message" style="display: none">
        <span id="mobile-message-text"></span>
      </div>
    </div>
    `;

    addMobileEventListeners();
}

/**
 * Get the board state from the DOM
 * @returns {Array} - 2D array of gem types
 */
function getBoardFromDOM() {
    const rows = document.querySelectorAll('table.standard-board tbody tr');
    const board = [];

    if (rows.length === 0) {
        return createDefaultBoard();
    }

    rows.forEach(row => {
        const boardRow = [];
        const cells = row.querySelectorAll('td');

        cells.forEach(cell => {
            const img = cell.querySelector('img');
            if (img && img.src) {
                const parts = img.src.split('/');
                const filename = parts[parts.length - 1];
                const gemType = filename.split('.')[0];
                boardRow.push(gemType);
            } else {
                boardRow.push('purple');
            }
        });

        board.push(boardRow);
    });

    return board;
}

/**
 * Generate HTML for mobile board
 * @param {Array} boardData - Board data
 * @returns {string} - HTML for mobile board
 */
function generateMobileBoardHTML(boardData) {
    let html = '';

    for (let y = 0; y < boardData.length; y++) {
        for (let x = 0; x < boardData[y].length; x++) {
            const gemType = boardData[y][x];
            html += `
            <div class="mobile-gem-cell" data-x="${x}" data-y="${y}">
                <img class="mobile-gem-image" src="/css/images/${gemType}.png" alt="Gem">
            </div>`;
        }
    }

    return html;
}

/**
 * Create default board
 * @returns {Array} - Default board
 */
function createDefaultBoard() {
    const gemTypes = ['purple', 'yellow', 'red', 'blue', 'green', 'orange'];
    const board = [];

    for (let y = 0; y < 6; y++) {
        const row = [];
        for (let x = 0; x < 6; x++) {
            const randomIndex = Math.floor(Math.random() * gemTypes.length);
            row.push(gemTypes[randomIndex]);
        }
        board.push(row);
    }

    return board;
}

/**
 * Add event listeners to mobile gems
 */
function addMobileEventListeners() {
    let selectedGem = null;

    document.querySelectorAll('.mobile-gem-cell').forEach(cell => {
        cell.addEventListener('click', function(e) {
            const x = parseInt(this.getAttribute('data-x'));
            const y = parseInt(this.getAttribute('data-y'));

            this.classList.add('gem-pop');
            setTimeout(() => {
                this.classList.remove('gem-pop');
            }, 300);

            if (!selectedGem) {
                selectedGem = { x, y, element: this };
                this.classList.add('mobile-selected');
                return;
            }

            if (selectedGem.x === x && selectedGem.y === y) {
                selectedGem.element.classList.remove('mobile-selected');
                selectedGem = null;
                return;
            }

            const dx = Math.abs(selectedGem.x - x);
            const dy = Math.abs(selectedGem.y - y);

            if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                selectedGem.element.classList.remove('mobile-selected');
                mobileSwapGems(selectedGem.x, selectedGem.y, x, y);
                selectedGem = null;
            } else {
                selectedGem.element.classList.remove('mobile-selected');
                selectedGem = { x, y, element: this };
                this.classList.add('mobile-selected');
                showMobileMessage("Select an adjacent gem");
            }
        });
    });
}

/**
 * Swap gems on mobile
 * @param {number} x1 - First gem X position
 * @param {number} y1 - First gem Y position
 * @param {number} x2 - Second gem X position
 * @param {number} y2 - Second gem Y position
 */
function mobileSwapGems(x1, y1, x2, y2) {
    const cell1 = document.querySelector(`.mobile-gem-cell[data-x="${x1}"][data-y="${y1}"]`);
    const cell2 = document.querySelector(`.mobile-gem-cell[data-x="${x2}"][data-y="${y2}"]`);

    if (!cell1 || !cell2) return;

    const img1 = cell1.querySelector('img');
    const img2 = cell2.querySelector('img');
    const src1 = img1.src;
    const src2 = img2.src;

    mobileAnimateSwap(cell1, cell2, () => {
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
                const mobileScore = document.getElementById('mobile-score');
                const oldScore = parseInt(mobileScore.innerText);
                mobileScore.innerText = data.score;

                const originalScore = document.getElementById('current-score');
                if (originalScore) {
                    originalScore.innerText = data.score;
                }

                if (data.moved) {
                    if (data.score > oldScore) {
                        showMobileScoreIncrease(data.score - oldScore);
                    }

                    if (data.board) {
                        updateMobileBoard(data.board);
                    }

                    if (data.hasPossibleMoves === false) {
                        document.dispatchEvent(new CustomEvent('game-over', {
                            detail: {
                                hasPossibleMoves: false,
                                message: data.message
                            }
                        }));
                    }
                } else {
                    img1.src = src1;
                    img2.src = src2;
                    showMobileMessage("Invalid move");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                img1.src = src1;
                img2.src = src2;
                showMobileMessage("Connection error");
            });
    });
}

/**
 * Animate swap on mobile
 * @param {Element} cell1 - First cell
 * @param {Element} cell2 - Second cell
 * @param {Function} callback - Callback function
 */
function mobileAnimateSwap(cell1, cell2, callback) {
    if (!cell1 || !cell2) return;

    cell1.style.transition = 'transform 0.3s ease-in-out';
    cell2.style.transition = 'transform 0.3s ease-in-out';

    const rect1 = cell1.getBoundingClientRect();
    const rect2 = cell2.getBoundingClientRect();

    const deltaX = rect2.left - rect1.left;
    const deltaY = rect2.top - rect1.top;

    cell1.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    cell2.style.transform = `translate(${-deltaX}px, ${-deltaY}px)`;

    setTimeout(() => {
        cell1.style.transform = '';
        cell2.style.transform = '';
        cell1.style.transition = '';
        cell2.style.transition = '';

        const img1 = cell1.querySelector('img');
        const img2 = cell2.querySelector('img');
        const tempSrc = img1.src;
        img1.src = img2.src;
        img2.src = tempSrc;

        if (callback) callback();
    }, 300);
}

/**
 * Update mobile board after server response
 * @param {Array} newBoard - New board state
 */
function updateMobileBoard(newBoard) {
    for (let y = 0; y < newBoard.length; y++) {
        for (let x = 0; x < newBoard[y].length; x++) {
            const cell = document.querySelector(`.mobile-gem-cell[data-x="${x}"][data-y="${y}"]`);
            if (cell) {
                const img = cell.querySelector('img');
                if (img) {
                    const newGemType = newBoard[y][x].toLowerCase();
                    img.src = `/css/images/${newGemType}.png`;
                }
            }
        }
    }
}

/**
 * Show score increase animation on mobile
 * @param {number} amount - Amount of score increase
 */
function showMobileScoreIncrease(amount) {
    const mobileScore = document.querySelector('.mobile-score-display');
    if (mobileScore) {
        mobileScore.classList.add('score-change');
        setTimeout(() => {
            mobileScore.classList.remove('score-change');
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
            if (document.body.contains(scorePopup)) {
                document.body.removeChild(scorePopup);
            }
        }, 1500);
    }
}

/**
 * Show message on mobile
 * @param {string} text - Message text
 */
function showMobileMessage(text) {
    const messageContainer = document.querySelector('.mobile-message');
    const messageText = document.getElementById('mobile-message-text');

    if (messageContainer && messageText) {
        messageText.textContent = text;
        messageContainer.style.display = 'block';

        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 2000);
    }
}

document.addEventListener('restart-game', function(e) {
    if (e.detail && e.detail.board) {
        updateMobileBoard(e.detail.board);
        const mobileScore = document.getElementById('mobile-score');
        if (mobileScore) {
            mobileScore.textContent = '0';
        }
    }
});