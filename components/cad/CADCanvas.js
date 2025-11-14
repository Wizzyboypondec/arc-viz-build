<!-- CAD Canvas Component with Konva.js -->
<script type="module">
  import CONFIG from '../../js/config.js';

  export function renderCADCanvas() {
    const container = document.createElement('div');
    container.id = 'cad-canvas-container';
    container.className = 'w-full glass rounded-xl overflow-hidden';
    container.innerHTML = `
      <div class="p-4 border-b border-white/20">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <h3 class="text-lg font-semibold">CAD Design Studio</h3>
          
          <!-- Toolbar -->
          <div class="flex flex-wrap items-center gap-2">
            <select id="scale-selector" class="input-glass px-3 py-2 text-sm">
              <option value="1:50">1:50</option>
              <option value="1:100">1:100</option>
              <option value="1:200">1:200</option>
            </select>
            
            <button id="zoom-in" class="tool-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            
            <button id="zoom-out" class="tool-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
            
            <button id="reset-view" class="tool-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button id="save-design" class="btn-glass btn-outline text-sm py-2 px-4">
              Save
            </button>
            <button id="export-design" class="btn-glass btn-primary text-sm py-2 px-4">
              Export
            </button>
          </div>
        </div>
      </div>
      
      <!-- Canvas Area -->
      <div class="p-4">
        <div id="cad-stage" class="border border-white/20 rounded-lg bg-gray-50"></div>
        
        <!-- Status Bar -->
        <div class="mt-4 text-sm text-slate-400">
          <div class="flex justify-between">
            <span>Dimensions: <span id="dimensions-value">0 × 0 m</span></span>
            <span>Elements: <span id="elements-count">0</span></span>
            <span>Area: <span id="design-area">0 m²</span></span>
          </div>
        </div>
      </div>
    `;
    
    return container;
  }
</script>