<!-- Estimator Controller Component -->
<script type="module">
  import CONFIG from '../../js/config.js';

  // Global variables
  let estimatorData = {};
  
  // Cost rates (these would come from database in real app)
  const COST_RATES = {
    blocks: 350, // per block
    cement: 2800, // per bag
    sand: 15000, // per truck (10m³)
    roofing: 2500, // per sheet
    door: 45000,
    window: 35000,
    labor: {
      foundation: 1500, // per m²
      structural: 2500,
      flooring: 1800,
      finishing: 2200
    }
  };
  
  // Material requirements per unit
  const MATERIAL_REQUIREMENTS = {
    blocksPerMeterWall: 10, // 10 blocks per meter of wall
    cementPerBlock: 0.1, // 0.1 bags per block
    sandPerBlock: 0.01, // 0.01m³ per block
    blocksPerMeterSquaredWallArea: 60 // 60 blocks per m² of wall area
  };

  export async function initializeEstimator() {
    // Create the estimator panel and append it to the DOM
    const container = document.getElementById('estimator-container') || document.body;
    const estimatorPanel = renderEstimatorPanel();
    container.appendChild(estimatorPanel);
    
    // Setup event listeners
    setupEventListeners();
    
    // Listen for CAD ready event
    document.addEventListener('cad-ready', (event) => {
      const { area } = event.detail;
      updateArea(area);
    });
    
    // Listen for design updates
    document.addEventListener('design-updated', (event) => {
      const { rooms, wallLength } = event.detail;
      updateDesignMetrics(rooms, wallLength);
      calculateEstimate();
    });
    
    return estimatorPanel;
  }

  function setupEventListeners() {
    document.getElementById('generate-quotation').addEventListener('click', generateQuotation);
  }

  function updateArea(area) {
    estimatorData.landArea = area;
    document.getElementById('estimator-area').textContent = formatArea(area);
    calculateEstimate();
  }

  function updateDesignMetrics(rooms, wallLength) {
    estimatorData.rooms = rooms;
    estimatorData.wallLength = wallLength;
    
    document.getElementById('estimator-rooms').textContent = rooms;
    document.getElementById('estimator-wall-length').textContent = `${wallLength.toFixed(2)} m`;
    
    // Calculate building area (simplified - average room size * number of rooms)
    const avgRoomSize = 12; // 12m² average room size
    const buildingArea = rooms * avgRoomSize;
    estimatorData.buildingArea = buildingArea;
    document.getElementById('estimator-building-area').textContent = `${buildingArea} m²`;
    
    calculateEstimate();
  }

  function calculateEstimate() {
    if (!estimatorData.landArea) return;
    
    // Calculate material costs
    const blocksNeeded = Math.ceil(estimatorData.wallLength * MATERIAL_REQUIREMENTS.blocksPerMeterWall);
    const cementNeeded = blocksNeeded * MATERIAL_REQUIREMENTS.cementPerBlock;
    const sandNeeded = blocksNeeded * MATERIAL_REQUIREMENTS.sandPerBlock;
    
    const costBlocks = blocksNeeded * COST_RATES.blocks;
    const costCement = Math.ceil(cementNeeded) * COST_RATES.cement;
    const costSand = Math.ceil(sandNeeded / 10) * COST_RATES.sand; // Sand sold by 10m³ trucks
    const costRoofing = Math.ceil(estimatorData.buildingArea / 2.5) * COST_RATES.roofing; // One sheet covers ~2.5m²
    const costDoorsWindows = (estimatorData.rooms * 1.5 * COST_RATES.door) + (estimatorData.rooms * 2 * COST_RATES.window); // Average 1.5 doors and 2 windows per room
    
    // Update material costs display
    document.getElementById('cost-blocks').textContent = formatCurrency(costBlocks);
    document.getElementById('cost-cement').textContent = formatCurrency(costCement);
    document.getElementById('cost-sand').textContent = formatCurrency(costSand);
    document.getElementById('cost-roofing').textContent = formatCurrency(costRoofing);
    document.getElementById('cost-doors-windows').textContent = formatCurrency(costDoorsWindows);
    
    // Calculate labor costs
    const laborFoundation = estimatorData.buildingArea * COST_RATES.labor.foundation;
    const laborStructural = estimatorData.buildingArea * COST_RATES.labor.structural;
    const laborFlooring = estimatorData.buildingArea * COST_RATES.labor.flooring;
    const laborFinishing = estimatorData.buildingArea * COST_RATES.labor.finishing;
    
    // Update labor costs display
    document.getElementById('labor-foundation').textContent = formatCurrency(laborFoundation);
    document.getElementById('labor-structural').textContent = formatCurrency(laborStructural);
    document.getElementById('labor-flooring').textContent = formatCurrency(laborFlooring);
    document.getElementById('labor-finishing').textContent = formatCurrency(laborFinishing);
    
    // Calculate total cost
    const totalMaterialCost = costBlocks + costCement + costSand + costRoofing + costDoorsWindows;
    const totalLaborCost = laborFoundation + laborStructural + laborFlooring + laborFinishing;
    const overhead = totalMaterialCost * 0.1; // 10% overhead
    const contingency = (totalMaterialCost + totalLaborCost) * 0.05; // 5% contingency
    
    const totalCost = totalMaterialCost + totalLaborCost + overhead + contingency;
    
    // Update total cost display
    document.getElementById('total-cost').textContent = formatCurrency(totalCost);
    
    // Store data for quotation generation
    estimatorData.costBreakdown = {
      materials: {
        blocks: costBlocks,
        cement: costCement,
        sand: costSand,
        roofing: costRoofing,
        doorsWindows: costDoorsWindows,
        total: totalMaterialCost
      },
      labor: {
        foundation: laborFoundation,
        structural: laborStructural,
        flooring: laborFlooring,
        finishing: laborFinishing,
        total: totalLaborCost
      },
      overhead: overhead,
      contingency: contingency,
      total: totalCost
    };
  }

  function generateQuotation() {
    if (!estimatorData.costBreakdown) {
      alert('No design data available. Please create a design first.');
      return;
    }
    
    // In a real app, this would call a serverless function to generate PDF
    // For now, we'll simulate the process
    const loadingBtn = document.getElementById('generate-quotation');
    const originalText = loadingBtn.textContent;
    loadingBtn.textContent = 'Generating...';
    loadingBtn.disabled = true;
    
    setTimeout(() => {
      loadingBtn.textContent = originalText;
      loadingBtn.disabled = false;
      
      alert(`Quotation generated successfully!\nTotal Estimated Cost: ${formatCurrency(estimatorData.costBreakdown.total)}\n\nThe quotation has been saved to your project files.`);
      
      // Dispatch event with quotation generated
      document.dispatchEvent(new CustomEvent('quotation-generated', {
        detail: {
          totalCost: estimatorData.costBreakdown.total,
          breakdown: estimatorData.costBreakdown,
          date: new Date().toISOString()
        }
      }));
      
    }, 2000);
  }

  function formatArea(area) {
    if (area < 1000) {
      return `${Math.round(area)} m²`;
    } else {
      return `${(area / 1000).toFixed(2)} km²`;
    }
  }

  function formatCurrency(amount) {
    return `₦${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }

  // Export functions
  export {
    initializeEstimator,
    calculateEstimate,
    generateQuotation
  };
</script>