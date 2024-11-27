const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 100;

// Tool options
let currentTool = 'pen';
let color = '#000000';
let size = 5;
let isDrawing = false;

// Event listeners for tools
document.getElementById('pen-tool').addEventListener('click', () => currentTool = 'pen');
document.getElementById('eraser-tool').addEventListener('click', () => currentTool = 'eraser');
document.getElementById('highlighter-tool').addEventListener('click', () => currentTool = 'highlighter');
document.getElementById('color-picker').addEventListener('change', (e) => color = e.target.value);
document.getElementById('size-picker').addEventListener('input', (e) => size = e.target.value);

// Drawing logic
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;

  ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);

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
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
  ctx.closePath();
  ctx.globalAlpha = 1.0;
});
