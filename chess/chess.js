document.addEventListener('DOMContentLoaded', () => {
    let board = null;
    const game = new Chess();
    const moveHistory = document.getElementById('move-history');
    const gameOverModal = document.getElementById('game-over-modal');
    const gameWonModal = document.getElementById('game-won-modal');
    const setPositionModal = document.getElementById('set-position-modal');
    const fenInput = document.getElementById('fen-input');
    let moveCount = 1;
    let userColor = 'w';

    const makeRandomMove = () => {
        const possibleMoves = game.moves();

        if (game.in_checkmate()) {
            if (game.turn() === userColor) {
                gameOverModal.classList.remove('hidden');
            } else {
                gameWonModal.classList.remove('hidden');
            }
        } else if (game.in_draw() || game.in_stalemate()) {
            gameOverModal.classList.remove('hidden');
        } else {
            const randomIdx = Math.floor(Math.random() * possibleMoves.length);
            const move = possibleMoves[randomIdx];
            game.move(move);
            board.position(game.fen());
            recordMove(move, moveCount);
            moveCount++;
        }
    };

    const recordMove = (move, count) => {
        const formattedMove = count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`;
        moveHistory.textContent += formattedMove + ' ';
        moveHistory.scrollTop = moveHistory.scrollHeight;
    };

    const onDragStart = (source, piece) => {
        return !game.game_over() && piece.search(userColor) === 0;
    };

    const onDrop = (source, target) => {
        const move = game.move({
            from: source,
            to: target,
            promotion: 'q',
        });

        if (move === null) return 'snapback';

        recordMove(move.san, moveCount);
        moveCount++;
        window.setTimeout(makeRandomMove, 250);
    };

    const onSnapEnd = () => {
        board.position(game.fen());
    };

    const boardConfig = {
        showNotation: true,
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed: 'fast',
        snapBackSpeed: 500,
        snapSpeed: 100,
    };

    board = Chessboard('board', boardConfig);

    window.restartGame = () => {
        game.reset();
        board.start();
        moveHistory.textContent = '';
        moveCount = 1;
        userColor = 'w';
        gameOverModal.classList.add('hidden');
        gameWonModal.classList.add('hidden');
        setPositionModal.classList.add('hidden');
    };

    window.openSetPositionModal = () => {
        setPositionModal.classList.remove('hidden');
        fenInput.value = '';
        fenInput.focus();
    };

    window.closeSetPositionModal = () => {
        setPositionModal.classList.add('hidden');
    };

    window.setPosition = () => {
        const fen = fenInput.value.trim();
        if (fen !== '') {
            if (game.load(fen)) {
                board.position(fen);
                moveHistory.textContent = '';
                moveCount = 1;
                userColor = 'w';
                closeSetPositionModal();
            } else {
                alert("Invalid FEN notation. Please try again.");
            }
        } else {
            alert("Please enter a FEN notation.");
        }
    };

    document.querySelector('.play-again').addEventListener('click', () => {
        window.restartGame();
    });

    document.querySelector('.set-pos').addEventListener('click', () => {
        window.openSetPositionModal();
    });

    document.querySelector('.flip-board').addEventListener('click', () => {
        board.flip();
        userColor = userColor === 'w' ? 'b' : 'w';
        makeRandomMove();
    });
});