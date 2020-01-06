// basic setup

let originalBoard;
const humanPlayer = 'O';
const aiPlayer = 'X';

const winningCombination = [
    [0,1,2],
    [0,4,8],
    [0,3,6],
    [3,4,5],
    [6,7,8],
    [1,4,7],
    [2,4,6],
    [2,5,8]
];

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
    document.querySelector('.end-game').style.display = 'none';
    originalBoard = Array.from(Array(9).keys());
    cells.forEach(cell => {
        cell.innerText = '';
        cell.style.removeProperty('background-color');
        cell.addEventListener('click', turnClick, false);
    });
}

function turnClick(square) {
    const id = square.target.id;
    if (typeof originalBoard[id] === 'number') {
      turn(id, humanPlayer);
      if(!checkTie()) turn(bestSpot(), aiPlayer);
    }
}


function turn(squareId, player) {
    originalBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    // detrmine winner
    const gameWon = checkWin(originalBoard, player);
    if (gameWon) {
        gameOver(gameWon);
    }
}

function checkWin(board, player) {
    const plays = board.reduce((a, e, i) => e===player ? a.concat(i) : a, []); 
    let gameWon = null;

    for (let [index, win] of winningCombination.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index, player};
            break;
        }
    }
    return gameWon;
}

function gameOver({index, player}) {
    for(let id of winningCombination[index]) {
        document.getElementById(id).style.backgroundColor = player === humanPlayer ? 'blue' : 'red';
    }
    cells.forEach(cell => cell.removeEventListener('click', turnClick, false));
    declareWinner(player === humanPlayer ? 'You win' : 'You lose');
}

// basic AI and winner notification

function checkTie() {
    if (emptySquares().length === 0) {
        cells.forEach(cell => {
            cell.style.backgroundColor = 'green';
            cell.removeEventListener('click', turnClick, false);
            declareWinner('Tie game!');
            return true;
        })
    }
    return false;
}
function bestSpot() {
    return minimax(originalBoard, aiPlayer).index;
}

function emptySquares(){
    return originalBoard.filter(s => typeof s === 'number');
}


function declareWinner(winner) {
    document.querySelector('.end-game').style.display = 'block';
    document.querySelector('.end-game .text').innerText = winner;
}



// Minimax algorithm

function minimax(board, player) {
	var availableSpots = emptySquares();

	if (checkWin(board, humanPlayer)) {
		return {score: -10};
	} else if (checkWin(board, aiPlayer)) {
		return {score: 10};
	} else if (availableSpots.length === 0) {
		return {score: 0};
	}
    const moves = [];
    
    availableSpots.forEach(spot => {
        var move = {};
		move.index = board[spot];
		board[spot] = player;

		if (player == aiPlayer) {
			move.score = minimax(board, humanPlayer).score;
		} else {
			move.score = minimax(board, aiPlayer).score;
		}

		board[spot] = move.index;

		moves.push(move);
    });


	if(player === aiPlayer) {
        return moves.sort((a,b) => b.score - a.score)[0];
	} else {
        return moves.sort((a,b) => a.score - b.score)[0];
	}
}