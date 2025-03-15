const boardElement = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const gameOverModal = document.getElementById('game-over-modal');
const gameWonModal = document.getElementById('game-won-modal');
const finalScoreElement = document.getElementById('final-score');
const winScoreElement = document.getElementById('win-score');
const modalHighScoreElement = document.getElementById('modal-high-score');
const modalHighScoreWonElement = document.getElementById('modal-high-score-won');

let board = [];
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let gameActive = true;
let hasWon = false;

// Khởi tạo game
function startGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    gameActive = true;
    hasWon = false;
    scoreElement.textContent = `Score: ${score}`;
    highScoreElement.textContent = `High Score: ${highScore}`;
    gameOverModal.classList.add('hidden');
    gameWonModal.classList.add('hidden');
    addNewTile();
    addNewTile();
    renderBoard();
}

// Thêm ô mới (2 hoặc 4)
function addNewTile() {
    let emptyTiles = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) emptyTiles.push({ row: i, col: j });
        }
    }
    if (emptyTiles.length > 0) {
        const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[row][col] = Math.random() > 0.1 ? 2 : 4;
    }
}

// Hiển thị lưới
function renderBoard() {
    boardElement.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.dataset.row = i;
            tile.dataset.col = j;
            tile.dataset.value = board[i][j];
            tile.textContent = board[i][j] === 0 ? '' : board[i][j];
            tile.style.backgroundColor = getTileColor(board[i][j]);
            tile.style.color = board[i][j] > 4 ? '#fff' : '#2c3e50';
            if (board[i][j] !== 0) {
                tile.classList.add('new-tile'); // Hiệu ứng xuất hiện
            }
            boardElement.appendChild(tile);
        }
    }
    scoreElement.textContent = `Score: ${score}`;
    highScoreElement.textContent = `High Score: ${highScore}`;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreElement.textContent = `High Score: ${highScore}`;
    }
}

function getTileColor(value) {
    switch (value) {
        case 0: return '#f1f2f6';
        case 2: return '#ffc0cb';
        case 4: return '#add8e6';
        case 8: return '#98fb98';
        case 16: return '#ffd700';
        case 32: return '#ffa07a';
        case 64: return '#87ceeb';
        case 128: return '#ffff00';
        case 256: return '#40e0d0';
        case 512: return '#ff69b4';
        case 1024: return '#7b68ee';
        case 2048: return '#ff6347';
        default: return '#2c3e50';
    }
}

function move(direction) {
    if (!gameActive || hasWon) return;

    let moved = false;
    let mergedPositions = new Set();
    let newBoard = JSON.parse(JSON.stringify(board));

    if (direction === 'up') {
        for (let j = 0; j < 4; j++) {
            for (let i = 1; i < 4; i++) {
                if (newBoard[i][j] !== 0) {
                    let k = i;
                    while (k > 0 && newBoard[k - 1][j] === 0) {
                        newBoard[k - 1][j] = newBoard[k][j];
                        newBoard[k][j] = 0;
                        k--;
                        moved = true;
                    }
                    if (k > 0 && newBoard[k - 1][j] === newBoard[k][j] && !mergedPositions.has(`${k-1}-${j}`)) {
                        newBoard[k - 1][j] *= 2;
                        score += newBoard[k - 1][j];
                        newBoard[k][j] = 0;
                        mergedPositions.add(`${k-1}-${j}`);
                        moved = true;
                    }
                }
            }
        }
    } else if (direction === 'down') {
        for (let j = 0; j < 4; j++) {
            for (let i = 2; i >= 0; i--) {
                if (newBoard[i][j] !== 0) {
                    let k = i;
                    while (k < 3 && newBoard[k + 1][j] === 0) {
                        newBoard[k + 1][j] = newBoard[k][j];
                        newBoard[k][j] = 0;
                        k++;
                        moved = true;
                    }
                    if (k < 3 && newBoard[k + 1][j] === newBoard[k][j] && !mergedPositions.has(`${k+1}-${j}`)) {
                        newBoard[k + 1][j] *= 2;
                        score += newBoard[k + 1][j];
                        newBoard[k][j] = 0;
                        mergedPositions.add(`${k+1}-${j}`);
                        moved = true;
                    }
                }
            }
        }
    } else if (direction === 'left') {
        for (let i = 0; i < 4; i++) {
            for (let j = 1; j < 4; j++) {
                if (newBoard[i][j] !== 0) {
                    let k = j;
                    while (k > 0 && newBoard[i][k - 1] === 0) {
                        newBoard[i][k - 1] = newBoard[i][k];
                        newBoard[i][k] = 0;
                        k--;
                        moved = true;
                    }
                    if (k > 0 && newBoard[i][k - 1] === newBoard[i][k] && !mergedPositions.has(`${i}-${k-1}`)) {
                        newBoard[i][k - 1] *= 2;
                        score += newBoard[i][k - 1];
                        newBoard[i][k] = 0;
                        mergedPositions.add(`${i}-${k-1}`);
                        moved = true;
                    }
                }
            }
        }
    } else if (direction === 'right') {
        for (let i = 0; i < 4; i++) {
            for (let j = 2; j >= 0; j--) {
                if (newBoard[i][j] !== 0) {
                    let k = j;
                    while (k < 3 && newBoard[i][k + 1] === 0) {
                        newBoard[i][k + 1] = newBoard[i][k];
                        newBoard[i][k] = 0;
                        k++;
                        moved = true;
                    }
                    if (k < 3 && newBoard[i][k + 1] === newBoard[i][k] && !mergedPositions.has(`${i}-${k+1}`)) {
                        newBoard[i][k + 1] *= 2;
                        score += newBoard[i][k + 1];
                        newBoard[i][k] = 0;
                        mergedPositions.add(`${i}-${k+1}`);
                        moved = true;
                    }
                }
            }
        }
    }

    if (moved) {
        board = newBoard;
        addNewTile();
        renderBoard();
        checkGameState();
    }
}

// Kiểm tra trạng thái game
function checkGameState() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 2048 && !hasWon) {
                hasWon = true;
                gameWonModal.classList.remove('hidden');
                winScoreElement.textContent = score;
                modalHighScoreWonElement.textContent = highScore;
                return;
            }
        }
    }

    let canMove = false;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                canMove = true;
                break;
            }
            if (i < 3 && board[i][j] === board[i + 1][j]) canMove = true;
            if (j < 3 && board[i][j] === board[i][j + 1]) canMove = true;
        }
        if (canMove) break;
    }

    if (!canMove) {
        gameActive = false;
        gameOverModal.classList.remove('hidden');
        finalScoreElement.textContent = score;
        modalHighScoreElement.textModalHighScoreElement.textContent = highScore;
        return;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') move('up');
    else if (e.key === 'ArrowDown') move('down');
    else if (e.key === 'ArrowLeft') move('left');
    else if (e.key === 'ArrowRight') move('right');
    else if (e.key === 'w') move('up')
    else if (e.key === 's') move('down')
    else if (e.key === 'a') move('left')
    else if (e.key === 'd') move('right')
});

startGame();