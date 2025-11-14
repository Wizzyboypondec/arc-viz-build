<!-- Features Section Component with Glassmorphism Effect -->
<script type="module">
  export function renderFeatures() {
    const features = document.createElement('section');
    features.id = 'features';
    features.className = 'section-padding';
    features.innerHTML = `
      <div class="container mx-auto max-w-6xl">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Comprehensive Features</h2>
          <p class="text-xl text-slate-300 max-w-3xl mx-auto">
            Everything you need to design, estimate, and build with precision and confidence.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1: Web CAD Designer -->
          <div class="card-primary group hover:shadow-2xl transition-all duration-500">
            <div class="w-14 h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            
            <h3 class="text-xl font-semibold mb-4">Web CAD Designer</h3>
            
            <p class="text-slate-300 mb-4 leading-relaxed">
              Create precise architectural designs with our intuitive canvas-based editor. Drag and drop building elements, upload existing floor plans, or start from scratch.
            </p>
            
            <ul class="space-y-2 text-slate-300 mb-6">
              <li class="flex items-start gap-2">
                <svg class="w-5 h-5 text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Drag & drop interface</span>
              </li>
              <li class="flex items-start gap-2">
                <svg class="w-5 h-5 text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Floor plan scanner</span>
              </li>
              <li class="flex items-start gap-2">
                <svg class="w-5 h-5 text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Real-time collaboration</span>
              </li>
            </ul>
            
            <button class="btn-glass btn-outline w-full py-3 font-medium transition-all duration-300">
              Learn More →
            </button>
          </div>

          <!-- Feature 2: Smart Cost Estimation -->
          <div class="card-primary group hover:shadow-2xl transition-all duration-500">
            <div class="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            
            <h3 class="text-xl font-semibold mb-4">Smart Cost Estimation</h3>
            
            <p class="text-slate-300 mb-4 leading-relaxed">
              Automatically calculate material costs, labor, and overhead based on your design and real-time market prices. Get accurate quotes in seconds.
            </p>
            
            <ul class="space-y-2 text-slate-300 mb-6">
              <li class="flex items-start gap-2">
                <svg class="w-5 h-5 text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Real-time pricing</span>
              </li>
              <li class="flex items-start gap-2">
                <svg class="w-5 h-5 text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Material consumption formulas</span>
              </li>
              <li class="flex items-start gap-2">
                <svg class="w-5 h-5 text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Export to PDF/Excel</span>
              </li>
            </ul>
            
            <button class="btn-glass btn-outline w-full py-3 font-medium transition-all duration-300">
              Learn More →
            </button>
          </div>

          <!-- Feature 3: Geospatial Intelligence -->
          <div class="card-primary group hover:shadow-2xl transition-all duration-500">
            <div class="w-14 h-14 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            
            <h3 class="text-xl font-semibold mb-4">Geospatial Intelligence</h3>
            
            <p class="text-slate-300 mb-4 leading-relaxed">
              Integrate Google Earth Engine to analyze soil composition, climate data, and terrain characteristics for your land area. Make informed decisions from the start.
            </p>
            
            <ul class="space-y-2 text-slate-300 mb-6">
              <li class="flex items-start gap-2">
                <svg class="w-5 h-5 text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Soil analysis</span>
              </li>
              <li class="flex items-start gap-2">
                <svg class="w-5 h-5 text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Climate data integration</span>
              </li>
              <li class="flex items-start gap-2">
                <svg class="w-5 h-5 text-green-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Terrain elevation mapping</span>
              </li>
            </ul>
            
            <button class="btn-glass btn-outline w-full py-3 font-medium transition-all duration-300">
              Learn More →
            </button>
          </div>
        </div>
      </div>
    `;

    // Add event listeners to all feature buttons
    const buttons = features.querySelectorAll('button:not([id])');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const featureTitle = e.target.parentElement.querySelector('h3').textContent;
        alert(`More information about: ${featureTitle}`);
      });
    });

    return features;
  }
</script>