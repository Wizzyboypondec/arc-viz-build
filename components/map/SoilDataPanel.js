<!-- Soil Data Panel Component -->
<script type="module">
  export function renderSoilDataPanel() {
    const panel = document.createElement('div');
    panel.id = 'soil-data-panel';
    panel.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-lg p-4 max-w-md z-50 border border-white/20';
    panel.innerHTML = `
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-lg font-semibold">Soil & Climate Analysis</h3>
        <button id="close-soil-panel" class="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-4">
          <div class="glass p-3 rounded">
            <div class="text-sm text-gray-300">Soil Type</div>
            <div id="soil-type" class="font-medium">-</div>
          </div>
          <div class="glass p-3 rounded">
            <div class="text-sm text-gray-300">pH Level</div>
            <div id="ph-level" class="font-medium">-</div>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="glass p-3 rounded">
            <div class="text-sm text-gray-300">Organic Matter</div>
            <div id="organic-matter" class="font-medium">-</div>
          </div>
          <div class="glass p-3 rounded">
            <div class="text-sm text-gray-300">Drainage</div>
            <div id="drainage" class="font-medium">-</div>
          </div>
        </div>
        
        <div class="glass p-3 rounded">
          <div class="text-sm text-gray-300 mb-1">Suitability</div>
          <div class="flex items-center">
            <div id="suitability-score" class="font-medium mr-2">-</div>
            <div class="w-full bg-gray-700 rounded-full h-2.5">
              <div id="suitability-bar" class="bg-green-500 h-2.5 rounded-full" style="width: 0%"></div>
            </div>
          </div>
        </div>
        
        <div class="glass p-3 rounded">
          <div class="text-sm text-gray-300 mb-1">Recommendations</div>
          <div id="recommendations" class="text-sm text-gray-300">-</div>
        </div>
      </div>
    `;
    
    // Close button event
    panel.querySelector('#close-soil-panel').addEventListener('click', () => {
      panel.remove();
    });
    
    return panel;
  }
  
  // Update soil data in panel
  export function updateSoilData(data) {
    const panel = document.getElementById('soil-data-panel');
    if (!panel) return;
    
    // Update values
    panel.querySelector('#soil-type').textContent = data.soil_type || '-';
    panel.querySelector('#ph-level').textContent = data.ph_level ? `${data.ph_level}` : '-';
    panel.querySelector('#organic-matter').textContent = data.organic_matter || '-';
    panel.querySelector('#drainage').textContent = data.drainage || '-';
    panel.querySelector('#recommendations').textContent = data.recommendations || '-';
    
    // Update suitability score and bar
    const suitability = data.suitability?.toLowerCase() || '';
    let score = 'Low';
    let width = 33;
    let color = 'bg-red-500';
    
    if (suitability.includes('high')) {
      score = 'High';
      width = 100;
      color = 'bg-green-500';
    } else if (suitability.includes('medium')) {
      score = 'Medium';
      width = 66;
      color = 'bg-yellow-500';
    }
    
    panel.querySelector('#suitability-score').textContent = score;
    const bar = panel.querySelector('#suitability-bar');
    bar.className = `h-2.5 rounded-full ${color}`;
    bar.style.width = `${width}%`;
  }
</script>