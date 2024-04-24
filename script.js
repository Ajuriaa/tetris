let gameBoard = document.getElementById("game-board");
let ctx = gameBoard.getContext("2d");
let startBtn = document.getElementById("start-button");
const blockSize = 30;
let currentPiece, currentX, currentY;
let interval;
let isGameOver = false;

// Define the Tetris grid
let grid = [];
for (let i = 0; i < 20; i++) {
  grid[i] = [];
  for (let j = 0; j < 10; j++) {
    grid[i][j] = 0;
  }
}

// Define colors for Tetris pieces
const colors = [
  "cyan",
  "blue",
  "orange",
  "yellow",
  "lime",
  "purple",
  "red",
];

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

// Function to get a random color
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
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

// Draw the grid
function drawGrid() {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x]) {
        ctx.fillStyle = grid[y][x];
        ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
      }
    }
  }
}

// Draw the game board
function draw() {
  ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);
  drawPiece(currentPiece.shape, currentX, currentY, currentPiece.color);
  drawGrid();
}

// Move the piece down
function moveDown() {
  if (checkCollision(currentPiece.shape, currentX, currentY + 1)) {
    // If there is a collision, stop the piece and place it on the grid
    if (checkGameOver()) {
      isGameOver = true;
      startBtn.style.display = "block";
      ctx.fillRect(0, gameBoard.height / 2 - 30, gameBoard.width, 60);
      ctx.fillStyle = "black";
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("You Lost!", gameBoard.width / 2, gameBoard.height / 2 + 8);
      ctx.fillStyle = "white";
      clearInterval(interval);
    }
    placePiece();
    // Check for complete rows and clear them
    clearLines();
    // Start a new piece
    currentPiece = {
      shape: getRandomPiece(),
      color: getRandomColor(),
    };
    currentX = 3;
    currentY = 0;

  } else {
    currentY++;
    draw();
  }
}

// Move the piece left
function moveLeft() {
  if (!checkCollision(currentPiece.shape, currentX - 1, currentY)) {
    currentX--;
    draw();
  }
}

// Move the piece right
function moveRight() {
  if (!checkCollision(currentPiece.shape, currentX + 1, currentY)) {
    currentX++;
    draw();
  }
}

// Rotate the piece
function rotatePiece() {
  const rotatedPiece = rotate(currentPiece.shape);
  if (!checkCollision(rotatedPiece, currentX, currentY)) {
    currentPiece.shape = rotatedPiece;
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
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x]) {
        grid[y + currentY][x + currentX] = currentPiece.color;
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

// Check if the game is over
function checkGameOver() {
  const topRow = grid[0];
  return topRow.some((cell) => cell !== 0);
}

// Initialize the game
function startGame() {
  isGameOver = false;
  startBtn.style.display = "none";

  // Clear the grid
  grid = [];
  for (let i = 0; i < 20; i++) {
    grid[i] = [];
    for (let j = 0; j < 10; j++) {
      grid[i][j] = 0;
    }
  }

  currentPiece = {
    shape: getRandomPiece(),
    color: getRandomColor(),
  };
  currentX = 3;
  currentY = 0;
  draw();
  interval = setInterval(moveDown, 1000); // Move down every second
}


startBtn.addEventListener("click", startGame);

// Add event listeners for keyboard input
document.addEventListener("keydown", function (event) {
  if (!isGameOver) {
    if (event.key === "ArrowLeft") {
      moveLeft();
    } else if (event.key === "ArrowRight") {
      moveRight();
    } else if (event.key === "ArrowDown") {
      moveDown();
    } else if (event.key === " ") {
      rotatePiece();
    }
  }
});
