const svg = document.getElementById('whiteboard');

// Tool options
let currentTool = 'pen';
let color = '#000000'; // Default color for the pen
let size = 5;
let isDrawing = false;
let currentPath = null;
let lastX = 0;
let lastY = 0;
const backgroundColor = '#ffffff'; // Background color to match for eraser

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
}

// Set the current tool (pen or eraser)
function setTool(tool) {
  currentTool = tool;
  if (tool === 'eraser') {
    color = backgroundColor; // Set the eraser color to background color (white)
  }
}

// Clear the canvas (SVG)
function clearCanvas() {
  svg.innerHTML = ''; // Remove all drawn paths
}

// Helper function to get SVG-relative position
function getSVGPosition(e) {
  const rect = svg.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return { x, y };
}

// Drawing logic for mouse events
svg.addEventListener('mousedown', startDrawing);
svg.addEventListener('mousemove', draw);
svg.addEventListener('mouseup', stopDrawing);
svg.addEventListener('mouseout', stopDrawing);

// Drawing logic for touch events
svg.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Prevent scrolling
  const touch = e.touches[0];
  startDrawing(touch);
});

svg.addEventListener('touchmove', (e) => {
  e.preventDefault(); // Prevent scrolling
  const touch = e.touches[0];
  draw(touch);
});

svg.addEventListener('touchend', stopDrawing);

// Shared drawing functions for both mouse and touch
function startDrawing(e) {
  const position = getSVGPosition(e);
  isDrawing = true;

  // Create a new path element for each stroke
  currentPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  currentPath.setAttribute('stroke', color);
  currentPath.setAttribute('stroke-width', size);
  currentPath.setAttribute('fill', 'none'); // No fill for the path
  currentPath.setAttribute('stroke-linecap', 'round'); // Smooth ends
  currentPath.setAttribute('stroke-linejoin', 'round'); // Smooth joins
  currentPath.setAttribute('d', `M ${position.x} ${position.y}`); // Move to the initial point
  svg.appendChild(currentPath);

  // Store the last position
  lastX = position.x;
  lastY = position.y;
}

function draw(e) {
  if (!isDrawing) return;

  const position = getSVGPosition(e);

  // Only draw when moving
  if (lastX !== position.x || lastY !== position.y) {
    // Update the path's 'd' attribute with a line (L command)
    const pathData = currentPath.getAttribute('d');
    currentPath.setAttribute('d', `${pathData} L ${position.x} ${position.y}`);

    // Update last position for the next segment
    lastX = position.x;
    lastY = position.y;
  }
}

function stopDrawing() {
  isDrawing = false;
  currentPath = null;
}

// Resize SVG when the window is resized
window.addEventListener('resize', () => {
  setSVGSize();
  clearCanvas(); // Optionally clear the canvas after resizing
});
