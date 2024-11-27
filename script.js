const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');

// Set canvas size to fit full window
function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50; // Adjust height considering the toolbar
}
setCanvasSize();

// Tool options
let currentTool = 'pen';
let color = '#000000';
let size = 5;
let isDrawing = false;

// Event listeners for tools
document.getElementById('pen-tool').addEventListener('click', () => setTool('pen'));
document.getElementById('eraser-tool').addEventListener('click', () => setTool('eraser'));
document.getElementById('highlighter-tool').addEventListener('click', () => setTool('highlighter'));
document.getElementById('color-picker').addEventListener('change', (e) => color = e.target.value);
document.getElementById('size-picker').addEventListener('input', (e) => size = e.target.value);
document.getElementById('clear-screen').addEventListener('click', clearCanvas);

// Set the current tool
function setTool(tool) {
  currentTool = tool;
}

// Clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Drawing logic for mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Drawing logic for touch events
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Prevent scrolling
  const touch = e.touches[0];
  startDrawing({ clientX: touch.clientX, clientY: touch.clientY });
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault(); // Prevent scrolling
  const touch = e.touches[0];
  draw({ clientX: touch.clientX, clientY: touch.clientY });
});

canvas.addEventListener('touchend', stopDrawing);

// Shared drawing functions for both mouse and touch
function startDrawing(e) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
}

function draw(e) {
  if (!isDrawing) return;

  ctx.lineTo(e.clientX, e.clientY);

  if (currentTool === 'pen') {
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.globalCompositeOperation = 'source-over';
  } else if (currentTool === 'eraser') {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = size * 2;
    ctx.globalCompositeOperation = 'source-over';
  } else if (currentTool === 'highlighter') {
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 2;
    ctx.globalAlpha = 0.3;
    ctx.globalCompositeOperation = 'source-over';
  }

  ctx.stroke();
}

function stopDrawing() {
  isDrawing = false;
  ctx.closePath();
  ctx.globalAlpha = 1.0; // Reset transparency for highlighter
}

// Resize canvas when the window is resized
window.addEventListener('resize', () => {
  setCanvasSize();
  clearCanvas(); // Optionally clear the canvas after resizing
});
