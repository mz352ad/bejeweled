/**
 * Enhanced version of Bejeweled game logic
 */
document.addEventListener('DOMContentLoaded', function() {
    let selectedGem = null;
    const gemCells = document.querySelectorAll('.gem-cell');

    initGame();

    function initGame() {
        gemCells.forEach(cell => {
            cell.addEventListener('dragstart', handleDragStart);
            cell.addEventListener('dragover', handleDragOver);
            cell.addEventListener('drop', handleDrop);
            cell.addEventListener('click', handleClick);
        });
    }

    /**
     * Handler for drag start event
     * @param {Event} e - Drag start event
     */
    function handleDragStart(e) {
        selectedGem = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
        this.classList.add('gem-selected');
    }

    /**
     * Handler for drag over event
     * @param {Event} e - Drag over event
     * @returns {boolean} False to prevent default behavior
     */
    function handleDragOver(e) {
        e.preventDefault();
        return false;
    }

    /**
     * Handler for drop event
     * @param {Event} e - Drop event
     * @returns {boolean} False to prevent default behavior
     */
    function handleDrop(e) {
        e.preventDefault();

        if (selectedGem && this !== selectedGem) {
            const x1 = parseInt(selectedGem.getAttribute('data-x'));
            const y1 = parseInt(selectedGem.getAttribute('data-y'));
            const x2 = parseInt(this.getAttribute('data-x'));
            const y2 = parseInt(this.getAttribute('data-y'));

            if (isAdjacent(x1, y1, x2, y2)) {
                swapGems(x1, y1, x2, y2);
            }
        }

        if (selectedGem) {
            selectedGem.classList.remove('gem-selected');
        }
        selectedGem = null;
        return false;
    }

    /**
     * Handler for click event (for mobile devices)
     */
    function handleClick() {
        if (!selectedGem) {
            selectedGem = this;
            this.classList.add('gem-selected');
        } else if (this === selectedGem) {
            selectedGem.classList.remove('gem-selected');
            selectedGem = null;
        } else {
            const x1 = parseInt(selectedGem.getAttribute('data-x'));
            const y1 = parseInt(selectedGem.getAttribute('data-y'));
            const x2 = parseInt(this.getAttribute('data-x'));
            const y2 = parseInt(this.getAttribute('data-y'));

            selectedGem.classList.remove('gem-selected');

            if (isAdjacent(x1, y1, x2, y2)) {
                swapGems(x1, y1, x2, y2);
            } else {
                selectedGem = this;
                this.classList.add('gem-selected');
            }
        }
    }

    /**
     * Checks if two cells are adjacent
     * @param {number} x1 - First cell X coordinate
     * @param {number} y1 - First cell Y coordinate
     * @param {number} x2 - Second cell X coordinate
     * @param {number} y2 - Second cell Y coordinate
     * @returns {boolean} True if cells are adjacent
     */
    function isAdjacent(x1, y1, x2, y2) {
        return (
            (Math.abs(x1 - x2) === 1 && y1 === y2) ||
            (Math.abs(y1 - y2) === 1 && x1 === x2)
        );
    }

    /**
     * Swap gems with server interaction
     * @param {number} x1 - First gem X position
     * @param {number} y1 - First gem Y position
     * @param {number} x2 - Second gem X position
     * @param {number} y2 - Second gem Y position
     */
    function swapGems(x1, y1, x2, y2) {
        document.body.classList.add('loading');

        const cell1 = document.querySelector(`.gem-cell[data-x="${x1}"][data-y="${y1}"]`);
        const cell2 = document.querySelector(`.gem-cell[data-x="${x2}"][data-y="${y2}"]`);

        animateSwap(cell1, cell2, () => {
            fetch('/bejeweled/swap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `x1=${x1}&y1=${y1}&x2=${x2}&y2=${y2}`
            })
                .then(response => response.json())
                .then(data => {
                    document.body.classList.remove('loading');

                    document.getElementById('current-score').textContent = data.score;

                    if (data.moved) {
                        updateBoard(data.board);

                        if (data.hasPossibleMoves === false) {
                            document.dispatchEvent(new CustomEvent('game-over', {
                                detail: {
                                    hasPossibleMoves: false,
                                    message: data.message
                                }
                            }));
                        }
                    } else {
                        animateSwap(cell2, cell1);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.body.classList.remove('loading');
                    animateSwap(cell2, cell1);
                });
        });
    }

    /**
     * Animate gem swap
     * @param {Element} cell1 - First cell element
     * @param {Element} cell2 - Second cell element
     * @param {Function} callback - Callback function
     */
    function animateSwap(cell1, cell2, callback) {
        if (!cell1 || !cell2) return;

        const rect1 = cell1.getBoundingClientRect();
        const rect2 = cell2.getBoundingClientRect();

        const deltaX = rect2.left - rect1.left;
        const deltaY = rect2.top - rect1.top;

        cell1.style.transition = 'transform 0.3s ease-in-out';
        cell2.style.transition = 'transform 0.3s ease-in-out';

        cell1.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        cell2.style.transform = `translate(${-deltaX}px, ${-deltaY}px)`;

        setTimeout(() => {
            cell1.style.transition = '';
            cell2.style.transition = '';
            cell1.style.transform = '';
            cell2.style.transform = '';

            const img1 = cell1.querySelector('img');
            const img2 = cell2.querySelector('img');
            if (img1 && img2) {
                const tempSrc = img1.src;
                img1.src = img2.src;
                img2.src = tempSrc;
            }

            if (callback) callback();
        }, 300);
    }

    /**
     * Update board after server response
     * @param {Array} newBoard - New board state
     */
    function updateBoard(newBoard) {
        for (let y = 0; y < newBoard.length; y++) {
            for (let x = 0; x < newBoard[y].length; x++) {
                const cell = document.querySelector(`.gem-cell[data-x="${x}"][data-y="${y}"]`);
                if (cell) {
                    const img = cell.querySelector('img');
                    if (img) {
                        const newGemType = newBoard[y][x];
                        img.src = `/css/images/${newGemType}.png`;
                    }
                }
            }
        }
    }

    document.addEventListener('restart-game', function(e) {
        if (e.detail && e.detail.board) {
            updateBoard(e.detail.board);
            document.getElementById('current-score').textContent = '0';
        }
    });
});