document.addEventListener('DOMContentLoaded', () => {
  const welcomeScreen = document.querySelector('.welcome-screen');
  const gameContainer = document.querySelector('.game-container');
  const colorSelection = document.querySelector('.color-selection');
  const startButtonOne = document.getElementById('start-button-one');
  const startButtonComputer = document.getElementById('start-button-computer');
  const resetButton = document.getElementById('reset-button');
  const newGameButton = document.getElementById('new-game-button');
  const squares = document.querySelectorAll('.square');
  const player1Score = document.getElementById('player1-score');
  const player2Score = document.getElementById('player2-score');
  const player2Name = document.getElementById('player2-name');
  const player2ColorName = document.getElementById('player2-color-name');
  const colorOptions = document.querySelectorAll('.color-option');
  const customPopup = document.getElementById('customPopup');
  const popupMessage = document.getElementById('popupMessage');
  const closePopup = document.querySelector('.close-popup');
  const backhome=document.getElementById('backhome');
  colorSelection.style.display = 'block';
  let currentPlayer = 'X';
  let gameBoard = ['', '', '', '', '', '', '', '', ''];
  let gameActive = false;
  let againstComputer = false;
  let player1Color = '';
  let player2Color = '';

  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  // Initialize scores from localStorage
  let scores = JSON.parse(localStorage.getItem('ticTacToeScores')) || {
    playerVsPlayer: { player1: 0, player2: 0 },
    playerVsAI: { player: 0, ai: 0 }
  };

  function startGame(vsComputer) {
    if (!player1Color || !player2Color) {
      alert('Please select colors for both players!');
      return;
    }

    againstComputer = vsComputer;
    welcomeScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    colorSelection.style.display = 'none'; // Hide color selection during the game
    gameActive = true;
    resetGame();
    updateScoreboard();

    if (againstComputer) {
      player2Name.textContent = 'AI';
      player2ColorName.textContent = 'AI';
    } else {
      player2Name.textContent = 'Player 2';
      player2ColorName.textContent = 'Player 2';
    }
  }

  function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    
    gameActive = true;
    squares.forEach(square => {
      square.textContent = '';
      square.style.backgroundColor = '';
    });
  }

  function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = parseInt(cell.getAttribute('data-index'));

    if (gameBoard[cellIndex] !== '' || !gameActive) return;

    updateCell(cell, cellIndex);
    checkResult();

    if (gameActive && againstComputer && currentPlayer === 'O') {
      setTimeout(computerMove, 500);
    }
  }

  function updateCell(cell, index) {
    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.style.backgroundColor = currentPlayer === 'X' ? player1Color : player2Color;
  }

  function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }

  function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winPatterns.length; i++) {
      const [a, b, c] = winPatterns[i];
      if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      gameActive = false;
      updateScore(currentPlayer);
      showPopup(`${currentPlayer === 'X' ? 'Player 1' : (againstComputer ? 'AI' : 'Player 2')} wins!`);
      return;
    }

    if (!gameBoard.includes('')) {
      gameActive = false;
      showPopup("It's a draw!");
      return;
    }

    changePlayer();
  }

  function computerMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i] === '') {
        gameBoard[i] = 'O';
        let score = minimax(gameBoard, 0, false);
        gameBoard[i] = '';
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    updateCell(squares[bestMove], bestMove);
    checkResult();
  }

  function minimax(board, depth, isMaximizing) {
    const result = checkWinner(board);
    if (result !== null) {
      return result === 'X' ? -1 : result === 'O' ? 1 : 0;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = 'O';
          let score = minimax(board, depth + 1, false);
          board[i] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = 'X';
          let score = minimax(board, depth + 1, true);
          board[i] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  function checkWinner(board) {
    for (let i = 0; i < winPatterns.length; i++) {
      const [a, b, c] = winPatterns[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    if (board.includes('')) return null;
    return 'tie';
  }

  function updateScore(winner) {
    if (againstComputer) {
      if (winner === 'X') {
        scores.playerVsAI.player++;
      } else {
        scores.playerVsAI.ai++;
      }
    } else {
      if (winner === 'X') {
        scores.playerVsPlayer.player1++;
      } else {
        scores.playerVsPlayer.player2++;
      }
    }
    localStorage.setItem('ticTacToeScores', JSON.stringify(scores));
    updateScoreboard();
  }

  function updateScoreboard() {
    if (againstComputer) {
      player1Score.textContent = scores.playerVsAI.player;
      player2Score.textContent = scores.playerVsAI.ai;
    } else {
      player1Score.textContent = scores.playerVsPlayer.player1;
      player2Score.textContent = scores.playerVsPlayer.player2;
    }
  }

  function handleColorSelection(e) {
    const color = e.target.getAttribute('data-color');
    const player = e.target.closest('.player-color').querySelector('p').textContent;

    if (player === 'Player 1') {
      player1Color = color;
    } else {
      player2Color = color;
    }

    e.target.parentElement.querySelectorAll('.color-option').forEach(option => {
      option.style.border = 'none';
    });
    e.target.style.border = '2px solid black';
  }

  function showPopup(message) {
    popupMessage.textContent = message;
    customPopup.style.display = 'block';
  }

  function hidePopup() {
    customPopup.style.display = 'none';
    resetGame();
  }

  // Event Listeners
  startButtonOne.addEventListener('click', () => startGame(false));
  startButtonComputer.addEventListener('click', () => startGame(true));
  resetButton.addEventListener('click', resetGame);
  newGameButton.addEventListener('click', () => {
    welcomeScreen.style.display = 'block';
    gameContainer.style.display = 'none';
    colorSelection.style.display = 'block';
  });
  squares.forEach(square => square.addEventListener('click', handleCellClick));
  colorOptions.forEach(option => option.addEventListener('click', handleColorSelection));
  closePopup.addEventListener('click', hidePopup);

  // Close popup when clicking outside of it
  window.addEventListener('click', (event) => {
    if (event.target === customPopup) {
      hidePopup();
    }
  });
});

backhome.addEventListener('click',()=>{
  window.location.href = "https://game-site-orpin.vercel.app/";
})
