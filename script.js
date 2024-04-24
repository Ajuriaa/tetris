let gameBoard = document.getElementById("game-board");
let ctx = gameBoard.getContext("2d");
const blockSize = 30;
let currentPiece, currentX, currentY;
let interval;

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

// Move the piece down
function moveDown() {
  if (checkCollision(currentPiece, currentX, currentY + 1)) {
    // If there is a collision, stop the piece and place it on the grid
    placePiece();
    // Check for complete rows and clear them
    clearLines();
    // Start a new piece
    currentPiece = getRandomPiece();
    currentX = 3;
    currentY = 0;
  } else {
    currentY++;
    draw();
  }
}

// Move the piece left
function moveLeft() {
  if (!checkCollision(currentPiece, currentX - 1, currentY)) {
    currentX--;
    draw();
  }
}

// Move the piece right
function moveRight() {
  if (!checkCollision(currentPiece, currentX + 1, currentY)) {
    currentX++;
    draw();
  }
}

// Rotate the piece
function rotatePiece() {
  const rotatedPiece = rotate(currentPiece);
  if (!checkCollision(rotatedPiece, currentX, currentY)) {
    currentPiece = rotatedPiece;
    draw();
  }
}

// Check for collision
function checkCollision(piece, x, y) {
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      if (piece[i][j] && (grid[y + i] && grid[y + i][x + j]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

// Place the piece on the grid
function placePiece() {
  for (let y = 0; y < currentPiece.length; y++) {
    for (let x = 0; x < currentPiece[y].length; x++) {
      if (currentPiece[y][x]) {
        grid[y + currentY][x + currentX] = 1;
      }
    }
  }
}

// Check for complete rows and clear them
function clearLines() {
  for (let y = 0; y < 20; y++) {
    let isComplete = true;
    for (let x = 0; x < 10; x++) {
      if (grid[y][x] === 0) {
        isComplete = false;
        break;
      }
    }
    if (isComplete) {
      grid.splice(y, 1);
      grid.unshift(Array(10).fill(0));
    }
  }
}

// Rotate the piece
function rotate(piece) {
  const newPiece = [];
  for (let i = 0; i < piece[0].length; i++) {
    let row = [];
    for (let j = piece.length - 1; j >= 0; j--) {
      row.push(piece[j][i]);
    }
    newPiece.push(row);
  }
  return newPiece;
}

// Initialize the game
function startGame() {
  currentPiece = getRandomPiece();
  currentX = 3;
  currentY = 0;
  draw();
  interval = setInterval(moveDown, 1000); // Move down every second

  // Add event listeners for keyboard input
  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      moveLeft();
    } else if (event.key === "ArrowRight") {
      moveRight();
    } else if (event.key === "ArrowDown") {
      moveDown();
    } else if (event.key === " ") {
      rotatePiece();
    }
  });
}

startGame();
