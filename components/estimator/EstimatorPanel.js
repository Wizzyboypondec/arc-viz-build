<!-- Estimator Panel Component -->
<script type="module">
  export function renderEstimatorPanel() {
    const panel = document.createElement('div');
    panel.id = 'estimator-panel';
    panel.className = 'glass rounded-xl p-6';
    panel.innerHTML = `
      <h3 class="text-xl font-semibold mb-6">Cost Estimation</h3>
      
      <!-- Project Info -->
      <div class="space-y-4 mb-6">
        <div class="flex justify-between">
          <span class="text-slate-300">Land Area:</span>
          <span id="estimator-area">0 m²</span>
        </div>
        
        <div class="flex justify-between">
          <span class="text-slate-300">Building Area:</span>
          <span id="estimator-building-area">0 m²</span>
        </div>
        
        <div class="flex justify-between">
          <span class="text-slate-300">Number of Rooms:</span>
          <span id="estimator-rooms">0</span>
        </div>
        
        <div class="flex justify-between">
          <span class="text-slate-300">Wall Length:</span>
          <span id="estimator-wall-length">0 m</span>
        </div>
      </div>
      
      <!-- Material Costs -->
      <div class="border-t border-white/20 pt-4 mb-6">
        <h4 class="font-medium mb-3">Material Costs</h4>
        <div id="material-costs" class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>Blocks</span>
            <span id="cost-blocks">₦0</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Cement</span>
            <span id="cost-cement">₦0</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Sand</span>
            <span id="cost-sand">₦0</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Roofing</span>
            <span id="cost-roofing">₦0</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Doors & Windows</span>
            <span id="cost-doors-windows">₦0</span>
          </div>
        </div>
      </div>
      
      <!-- Labor Costs -->
      <div class="border-t border-white/20 pt-4 mb-6">
        <h4 class="font-medium mb-3">Labor Costs</h4>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>Foundation</span>
            <span id="labor-foundation">₦0</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Structural</span>
            <span id="labor-structural">₦0</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Flooring</span>
            <span id="labor-flooring">₦0</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Finishing</span>
            <span id="labor-finishing">₦0</span>
          </div>
        </div>
      </div>
      
      <!-- Total Cost -->
      <div class="border-t border-white/20 pt-4">
        <div class="flex justify-between items-center text-lg font-bold">
          <span>Total Estimated Cost:</span>
          <span id="total-cost">₦0</span>
        </div>
        
        <div class="mt-4">
          <button id="generate-quotation" class="btn-glass btn-primary w-full py-3 font-medium">
            Generate Quotation
          </button>
        </div>
      </div>
    `;
    
    return panel;
  }
</script>