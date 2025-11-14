<!-- Map Container Component with Leaflet -->
<script type="module">
  import CONFIG from '../../js/config.js';

  export function renderMapContainer() {
    const container = document.createElement('div');
    container.id = 'map-container';
    container.className = 'w-full h-96 rounded-xl overflow-hidden glass relative';
    container.innerHTML = `
      <div id="map" class="w-full h-full"></div>
      
      <!-- Map Controls -->
      <div class="absolute top-4 left-4 z-10 space-y-2">
        <!-- Location Search -->
        <div class="glass p-3 rounded-lg">
          <div class="flex space-x-2">
            <input 
              type="text" 
              id="location-search" 
              placeholder="Search location..." 
              class="bg-transparent outline-none text-white placeholder-gray-300 flex-1 text-sm"
            >
            <button 
              id="search-btn" 
              class="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Current Location -->
        <button 
          id="current-location" 
          class="glass p-3 rounded-lg flex items-center space-x-2 hover:bg-white/10 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="text-sm">Current Location</span>
        </button>
      </div>
      
      <!-- Map Information Panel -->
      <div class="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md rounded-lg p-4 min-w-48">
        <h4 class="font-semibold mb-2">Land Area Information</h4>
        <div class="space-y-1 text-sm">
          <div class="flex justify-between">
            <span>Area:</span>
            <span id="area-value">0 m²</span>
          </div>
          <div class="flex justify-between">
            <span>Coordinates:</span>
            <span id="coords-count">0</span>
          </div>
          <div class="flex justify-between">
            <span>Soil Data:</span>
            <span id="soil-status">-</span>
          </div>
        </div>
      </div>
    `;

    return container;
  }
</script>