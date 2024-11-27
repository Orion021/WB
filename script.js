const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');

// Set canvas size to fit full window
function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 40; // Adjust height considering the toolbar height
}
setCanvasSize();

// Tool options
let currentTool = 'pen';
let color = '#000000'; // Default color for the pen
let size = 5;
let isDrawing = false;

// Event listeners for tools
document.getElementById('pen-tool-black').addEventListener('click', () => setPenColor('#000000'));
document.getElementById('pen-tool-red').addEventListener('click', () => setPenColor('#FF0000'));
document.getElementById('pen-tool-blue').addEventListener('click', () => setPenColor('#0000FF'));
document.getElementById('eraser-tool').addEventListener('click', () => setTool('eraser'));
document.getElementById('size-picker').addEventListener('input', (e) => size = e.target.value);
document.getElementById('clear-screen').addEventListener('click', clearCanvas);

// Set the pen color
function setPenColor(newColor) {
  currentTool = 'pen'; // Switch to pen tool
  color = newColor;
  ctx.globalAlpha = 1.00; // Full opacity for pen tool
  ctx.globalCompositeOperation = 'source-over'; // Ensure normal drawing mode
}

// Set the current tool
function setTool(tool) {
  currentTool = tool;
  if (tool === 'eraser') {
    color = '#ffffff'; // Eraser color is white
    ctx.globalAlpha = 1.0; // Full opacity for eraser
    ctx.globalCompositeOperation = 'destination-out'; // Eraser operation to remove lines
  }
}

// Clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Helper function to get canvas-relative position
function getCanvasPosition(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return { x, y };
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
  startDrawing(touch);
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault(); // Prevent scrolling
  const touch = e.touches[0];
  draw(touch);
});

canvas.addEventListener('touchend', stopDrawing);

// Shared drawing functions for both mouse and touch
function startDrawing(e) {
  const position = getCanvasPosition(e);
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(position.x, position.y);
}

function draw(e) {
  if (!isDrawing) return;

  const position = getCanvasPosition(e);
  ctx.lineTo(position.x, position.y);

  if (currentTool === 'pen') {
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.globalCompositeOperation = 'source-over'; // Normal drawing for pen tool
  } else if (currentTool === 'eraser') {
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 2;
    ctx.globalCompositeOperation = 'destination-out'; // Eraser operation to remove lines
  }

  ctx.stroke();
}

function stopDrawing() {
  isDrawing = false;
  ctx.closePath();
}

// Resize canvas when the window is resized
window.addEventListener('resize', () => {
  setCanvasSize();
  clearCanvas(); // Optionally clear the canvas after resizing
});
