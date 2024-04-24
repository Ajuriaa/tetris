let gameBoard = document.getElementById("game-board");
let ctx = gameBoard.getContext("2d");
const blockSize = 30;

// Define the Tetris grid
let grid = [];
for (let i = 0; i < 20; i++) {
  grid[i] = [];
  for (let j = 0; j < 10; j++) {
    grid[i][j] = 0;
  }
}

// Define the Tetris pieces
const tetrisPieces = [
  // I piece
  [[1, 1, 1, 1]],

  // J piece
  [
    [1, 0, 0],
    [1, 1, 1],
  ],

  // L piece
  [
    [0, 0, 1],
    [1, 1, 1],
  ],

  // O piece
  [
    [1, 1],
    [1, 1],
  ],

  // S piece
  [
    [0, 1, 1],
    [1, 1, 0],
  ],

  // T piece
  [
    [0, 1, 0],
    [1, 1, 1],
  ],

  // Z piece
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
];

// Function to get a random Tetris piece
function getRandomPiece() {
  const randomIndex = Math.floor(Math.random() * tetrisPieces.length);
  return tetrisPieces[randomIndex];
}

// Draw the piece
function drawPiece(piece, xOffset, yOffset, color) {
  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
      if (piece[y][x]) {
        ctx.fillStyle = color;
        ctx.fillRect(
          (x + xOffset) * blockSize,
          (y + yOffset) * blockSize,
          blockSize,
          blockSize
        );
      }
    }
  }
}

// Draw the game board
function draw() {
  ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);
  drawPiece(currentPiece, currentX, currentY, "blue");
}

// Initialize the game
function startGame() {
  currentPiece = getRandomPiece();
  currentX = 3;
  currentY = 0;
  draw();
}

startGame();
