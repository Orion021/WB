﻿const svg = document.getElementById('whiteboard');

// Tool options
let currentTool = 'pen';
let color = '#000000'; // Default color for the pen
let size = 5;
let isDrawing = false;
let currentPath = null;
let lastX = 0;
let lastY = 0;
const backgroundColor = '#ffffff'; // Background color to match for eraser

// Stacks for Undo/Redo
let undoStack = [];
let redoStack = [];

// Event listeners for tools
document.getElementById('pen-tool-black').addEventListener('click', () => setPenColor('#000000'));
document.getElementById('pen-tool-red').addEventListener('click', () => setPenColor('#FF0000'));
document.getElementById('pen-tool-blue').addEventListener('click', () => setPenColor('#0000FF'));
document.getElementById('eraser-tool').addEventListener('click', () => setTool('eraser'));
document.getElementById('size-picker').addEventListener('input', (e) => size = e.target.value);
document.getElementById('clear-screen').addEventListener('click', clearCanvas);
document.getElementById('undo-button').addEventListener('click', undo);
document.getElementById('redo-button').addEventListener('click', redo);
document.getElementById('new-page-button').addEventListener('click', openNewPage);
document.getElementById('save-button').addEventListener('click', saveAsImage);

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
  undoStack = []; // Clear undo history
  redoStack = []; // Clear redo history
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
  if (!isDrawing) return;

  isDrawing = false;

  // Add the current path to the undo stack
  if (currentPath) {
    undoStack.push(currentPath);
    redoStack = []; // Clear redo stack when a new action is performed
  }

  currentPath = null;
}

// Undo function
function undo() {
  if (undoStack.length > 0) {
    const lastPath = undoStack.pop(); // Remove the last path from the undo stack
    svg.removeChild(lastPath); // Remove it from the SVG
    redoStack.push(lastPath); // Add it to the redo stack
  }
}

// Redo function
function redo() {
  if (redoStack.length > 0) {
    const lastRedoPath = redoStack.pop(); // Remove the last path from the redo stack
    svg.appendChild(lastRedoPath); // Re-add it to the SVG
    undoStack.push(lastRedoPath); // Add it back to the undo stack
  }
}

// Function to open a new tab with a fresh drawing board
function openNewPage() {
  window.open(window.location.href, '_blank'); // Opens the current page in a new tab
}

// Function to save the drawing as an image
function saveAsImage() {
  const svgData = new XMLSerializer().serializeToString(svg); // Convert SVG to string
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = function () {
    const canvas = document.createElement('canvas');
    const canvasWidth = 2000; // High resolution width
    const canvasHeight = 1234; // High resolution height

    // Create canvas with target resolution
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const context = canvas.getContext('2d');
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height); // Fill the background

    // Get the SVG's bounding box to calculate scaling
    const svgElement = img;
    const svgWidth = svgElement.width;
    const svgHeight = svgElement.height;

    // Calculate scale factor
    const scaleX = canvasWidth / svgWidth;
    const scaleY = canvasHeight / svgHeight;
    const scale = Math.min(scaleX, scaleY); // Ensure the image scales proportionally

    // Calculate offset to center the content
    const offsetX = (canvasWidth - svgWidth * scale) / 2;
    const offsetY = (canvasHeight - svgHeight * scale) / 2;

    // Draw the scaled image on the canvas
    context.drawImage(img, offsetX, offsetY, svgWidth * scale, svgHeight * scale);

    // Convert the canvas to PNG and download
    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'drawing.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  img.src = url;
}
