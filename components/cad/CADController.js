<!-- CAD Controller Component -->
<script type="module">
  import CONFIG from '../../js/config.js';

  // Global variables
  let stage = null;
  let layer = null;
  let currentTool = 'select';
  let isDrawing = false;
  let startPos = null;
  let currentShape = null;
  let scale = 1; // 1px = 1m by default
  
  // Element counters
  let wallCount = 0;
  let doorCount = 0;
  let windowCount = 0;
  let roomCount = 0;

  export async function initializeCAD() {
    // Wait for Konva to be loaded
    await waitForKonva();
    
    // Create the CAD container and append it to the DOM
    const app = document.getElementById('cad-container') || document.body;
    const cadContainer = renderCADCanvas();
    app.appendChild(cadContainer);
    
    // Initialize Konva stage
    stage = new Konva.Stage({
      container: 'cad-stage',
      width: 800,
      height: 600,
      draggable: true
    });
    
    // Create layer
    layer = new Konva.Layer();
    stage.add(layer);
    
    // Setup grid background
    setupGrid();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup toolbar
    setupToolbar();
    
    // Listen for area-calculated event from map
    document.addEventListener('area-calculated', (event) => {
      const { area, geoJson } = event.detail;
      fitToArea(area, geoJson);
    });
    
    return stage;
  }

  function waitForKonva() {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (typeof Konva !== 'undefined') {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  function setupGrid() {
    // Create grid pattern
    const gridSize = 20 * scale;
    const grid = new Konva.Line({
      points: [
        0, 0, 
        stage.width(), 0, 
        stage.width(), stage.height(), 
        0, stage.height(), 
        0, 0
      ],
      stroke: '#e0e0e0',
      strokeWidth: 1,
      dash: [gridSize, gridSize]
    });
    
    layer.add(grid);
    layer.draw();
  }

  function setupEventListeners() {
    // Mouse down event
    stage.on('mousedown touchstart', (e) => {
      if (e.target !== stage) return;
      
      if (currentTool === 'wall' || currentTool === 'room') {
        isDrawing = true;
        startPos = stage.getPointerPosition();
        
        if (currentTool === 'wall') {
          createWall(startPos.x, startPos.y, startPos.x, startPos.y);
        } else if (currentTool === 'room') {
          createRoom(startPos.x, startPos.y, 0, 0);
        }
      }
    });
    
    // Mouse move event
    stage.on('mousemove touchmove', (e) => {
      if (!isDrawing || !startPos) return;
      
      const pos = stage.getPointerPosition();
      
      if (currentTool === 'wall' && currentShape) {
        updateWall(currentShape, startPos.x, startPos.y, pos.x, pos.y);
      } else if (currentTool === 'room' && currentShape) {
        updateRoom(currentShape, startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      }
      
      layer.draw();
    });
    
    // Mouse up event
    stage.on('mouseup touchend', () => {
      if (isDrawing && currentShape) {
        finalizeShape(currentShape);
        isDrawing = false;
        startPos = null;
        currentShape = null;
        
        updateStatusBar();
      }
    });
    
    // Click event for selection
    stage.on('click', (e) => {
      if (currentTool === 'select' && e.target !== stage) {
        selectShape(e.target.getParent());
      }
    });
  }

  function setupToolbar() {
    // Tool selection
    const toolButtons = document.querySelectorAll('.tool-button');
    toolButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        toolButtons.forEach(btn => {
          btn.classList.remove('bg-white/20');
        });
        
        // Add active class to clicked button
        button.classList.add('bg-white/20');
        
        // Update current tool
        currentTool = button.dataset.tool;
        
        // Update cursor
        updateCursor();
      });
    });
    
    // Scale selector
    document.getElementById('scale-selector').addEventListener('change', (e) => {
      const value = e.target.value;
      const ratio = parseInt(value.split(':')[1]);
      scale = 1 / (ratio / 50); // Base scale at 1:50
      
      // Update grid
      layer.destroyChildren();
      setupGrid();
      
      // Redraw all shapes with new scale
      redrawShapes();
    });
    
    // Zoom controls
    document.getElementById('zoom-in').addEventListener('click', () => {
      const zoom = stage.scaleX() * 1.2;
      stage.scale({ x: zoom, y: zoom });
      stage.position({
        x: stage.width() / 2 - (stage.width() / 2 - stage.position().x) * 1.2,
        y: stage.height() / 2 - (stage.height() / 2 - stage.position().y) * 1.2
      });
      stage.batchDraw();
    });
    
    document.getElementById('zoom-out').addEventListener('click', () => {
      const zoom = stage.scaleX() / 1.2;
      stage.scale({ x: zoom, y: zoom });
      stage.position({
        x: stage.width() / 2 - (stage.width() / 2 - stage.position().x) * 0.8,
        y: stage.height() / 2 - (stage.height() / 2 - stage.position().y) * 0.8
      });
      stage.batchDraw();
    });
    
    document.getElementById('reset-view').addEventListener('click', () => {
      stage.scale({ x: 1, y: 1 });
      stage.position({ x: 0, y: 0 });
      stage.batchDraw();
    });
    
    // Action buttons
    document.getElementById('save-design').addEventListener('click', saveDesign);
    document.getElementById('export-design').addEventListener('click', exportDesign);
  }

  function updateCursor() {
    let cursor = 'default';
    
    switch(currentTool) {
      case 'wall':
      case 'room':
        cursor = 'crosshair';
        break;
      case 'door':
      case 'window':
        cursor = 'pointer';
        break;
    }
    
    stage.container().style.cursor = cursor;
  }

  function createWall(x1, y1, x2, y2) {
    wallCount++;
    
    currentShape = new Konva.Group({
      name: `wall-${wallCount}`,
      draggable: true
    });
    
    // Wall line
    const line = new Konva.Line({
      points: [x1, y1, x2, y2],
      stroke: '#333',
      strokeWidth: 8 * scale,
      lineCap: 'round',
      lineJoin: 'round'
    });
    
    // Length label
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / scale;
    const label = new Konva.Text({
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2 - 15,
      text: `${length.toFixed(2)}m`,
      fontSize: 12,
      fontFamily: 'Calibri',
      fill: '#333'
    });
    
    currentShape.add(line);
    currentShape.add(label);
    layer.add(currentShape);
  }

  function updateWall(shape, x1, y1, x2, y2) {
    const line = shape.findOne('Line');
    line.points([x1, y1, x2, y2]);
    
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / scale;
    const label = shape.findOne('Text');
    label.text(`${length.toFixed(2)}m`);
    label.x((x1 + x2) / 2);
    label.y((y1 + y2) / 2 - 15);
  }

  function createRoom(x, y, width, height) {
    roomCount++;
    
    currentShape = new Konva.Group({
      x: x,
      y: y,
      name: `room-${roomCount}`,
      draggable: true
    });
    
    // Room rectangle
    const rect = new Konva.Rect({
      width: width,
      height: height,
      fill: 'rgba(255, 255, 255, 0.7)',
      stroke: '#333',
      strokeWidth: 2 * scale
    });
    
    // Area label
    const area = (width * height) / (scale * scale);
    const label = new Konva.Text({
      x: width / 2,
      y: height / 2,
      text: `${area.toFixed(2)}m²`,
      fontSize: 14,
      fontFamily: 'Calibri',
      fill: '#333',
      align: 'center'
    });
    
    currentShape.add(rect);
    currentShape.add(label);
    layer.add(currentShape);
  }

  function updateRoom(shape, x, y, width, height) {
    shape.x(x);
    shape.y(y);
    
    const rect = shape.findOne('Rect');
    rect.width(width);
    rect.height(height);
    
    const area = (width * height) / (scale * scale);
    const label = shape.findOne('Text');
    label.text(`${area.toFixed(2)}m²`);
    label.x(width / 2);
    label.y(height / 2);
  }

  function finalizeShape(shape) {
    // Add resize and rotate handles
    addTransformers(shape);
    
    // Update status bar
    updateStatusBar();
  }

  function addTransformers(shape) {
    const transformer = new Konva.Transformer({
      enabledAnchors: ['top-left', 'top-right', 'bottom-right', 'bottom-left']
    });
    
    shape.add(transformer);
    transformer.attachTo(shape);
    
    // Update labels when resized
    shape.on('transform', () => {
      if (shape.children.length > 1) {
        const label = shape.findOne('Text');
        if (label) {
          const node = shape.children[0];
          
          if (node instanceof Konva.Line) {
            // Wall
            const length = node.getLength() / scale;
            label.text(`${length.toFixed(2)}m`);
          } else if (node instanceof Konva.Rect) {
            // Room
            const area = (node.width() * node.height()) / (scale * scale);
            label.text(`${area.toFixed(2)}m²`);
          }
        }
      }
    });
    
    layer.draw();
  }

  function selectShape(shape) {
    // Clear previous selection
    layer.find('.selected').forEach(s => {
      s.strokeWidth(2 * scale);
      s.getStage().find('.selected').destroy();
    });
    
    // Highlight selected shape
    if (shape instanceof Konva.Group) {
      shape.strokeWidth(4 * scale);
      
      // Show transformers
      const transformer = new Konva.Transformer({
        enabledAnchors: ['top-left', 'top-right', 'bottom-right', 'bottom-left']
      });
      shape.add(transformer);
      transformer.attachTo(shape);
    }
    
    layer.draw();
  }

  function redrawShapes() {
    // Store current shapes
    const shapes = [];
    layer.find('Group').forEach(group => {
      shapes.push({
        type: group.name().split('-')[0],
        data: group.toObject()
      });
    });
    
    // Clear layer
    layer.destroyChildren();
    setupGrid();
    
    // Redraw shapes with new scale
    shapes.forEach(item => {
      const group = Konva.Node.create(item.data, 'layer');
      layer.add(group);
      
      // Update stroke widths and font sizes based on scale
      group.find('Shape').forEach(shape => {
        if (shape.strokeWidth) {
          shape.strokeWidth(shape.strokeWidth() * scale);
        }
      });
      
      group.find('Text').forEach(text => {
        text.fontSize(text.fontSize() * scale);
      });
    });
    
    layer.draw();
  }

  function updateStatusBar() {
    // Count elements
    const elements = layer.find('Group').length;
    document.getElementById('elements-count').textContent = elements;
    
    // Calculate total area
    let totalArea = 0;
    layer.find('Group').forEach(group => {
      if (group.name().startsWith('room')) {
        const rect = group.findOne('Rect');
        if (rect) {
          totalArea += (rect.width() * rect.height()) / (scale * scale);
        }
      }
    });
    
    document.getElementById('design-area').textContent = `${totalArea.toFixed(2)} m²`;
    
    // Update dimensions
    const bbox = layer.getClientRect();
    const width = (bbox.width / scale).toFixed(2);
    const height = (bbox.height / scale).toFixed(2);
    document.getElementById('dimensions-value').textContent = `${width} × ${height} m`;
  }

  function fitToArea(area, geoJson) {
    // Calculate dimensions from area (assuming square for simplicity)
    const sideLength = Math.sqrt(area);
    const dimensionsMeters = sideLength;
    
    // Convert to pixels (assuming 1m = 50px at 1:50 scale)
    const pixelsPerMeter = 50 * scale;
    const dimensionsPixels = dimensionsMeters * pixelsPerMeter;
    
    // Resize stage if needed
    if (dimensionsPixels > stage.width() || dimensionsPixels > stage.height()) {
      stage.width(dimensionsPixels * 1.2);
      stage.height(dimensionsPixels * 1.2);
      
      // Update container
      document.getElementById('cad-stage').style.width = `${stage.width()}px`;
      document.getElementById('cad-stage').style.height = `${stage.height()}px`;
    }
    
    // Center the view
    stage.position({
      x: (stage.width() - dimensionsPixels) / 2,
      y: (stage.height() - dimensionsPixels) / 2
    });
    
    // Update status bar
    updateStatusBar();
    
    // Dispatch event with CAD ready
    document.dispatchEvent(new CustomEvent('cad-ready', {
      detail: {
        dimensions: { width: dimensionsMeters, height: dimensionsMeters },
        area: area
      }
    }));
  }

  function saveDesign() {
    // Serialize the design to JSON
    const designData = stage.toJSON();
    
    // In a real app, this would save to database
    localStorage.setItem('cad-design', designData);
    
    alert('Design saved successfully!');
  }

  function exportDesign() {
    const format = prompt('Export as: PNG, JPG, SVG, or JSON');
    
    if (!format) return;
    
    switch(format.toLowerCase()) {
      case 'png':
        stage.toImage({
          callback: function(img) {
            const link = document.createElement('a');
            link.download = 'design.png';
            link.href = img.src;
            link.click();
          }
        });
        break;
      
      case 'jpg':
        stage.toImage({
          mimeType: 'image/jpeg',
          callback: function(img) {
            const link = document.createElement('a');
            link.download = 'design.jpg';
            link.href = img.src;
            link.click();
          }
        });
        break;
      
      case 'svg':
        stage.toSVG({
          callback: function(svg) {
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = 'design.svg';
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
          }
        });
        break;
      
      case 'json':
        const data = stage.toJSON();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'design.json';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        break;
      
      default:
        alert('Invalid format. Please choose PNG, JPG, SVG, or JSON.');
    }
  }

  // Export functions
  export {
    initializeCAD,
    saveDesign,
    exportDesign,
    fitToArea,
    updateStatusBar
  };
</script>