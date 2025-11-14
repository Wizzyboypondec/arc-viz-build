<!-- Hero Section Component with Glassmorphism Effect -->
<script type="module">
  export function renderHero() {
    const hero = document.createElement('section');
    hero.id = 'home';
    hero.className = 'pt-28 pb-20 px-6';
    hero.innerHTML = `
      <div class="container mx-auto max-w-7xl">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-12">
          <!-- Text Content -->
          <div class="lg:w-1/2 space-y-8">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Transform Your Land into
              <span class="gradient-text">Architectural Masterpiece</span>
            </h1>
            
            <p class="text-lg text-slate-300 leading-relaxed">
              Our advanced Web CAD platform combines geospatial intelligence, AI-powered design assistance, 
              and real-time cost estimation to bring your construction vision to life — from concept to completion.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 pt-6">
              <button id="start-design" class="btn-glass btn-primary px-8 py-4 text-lg font-medium transition-all duration-300">
                Start Designing Now
              </button>
              <button id="view-demo" class="btn-glass btn-outline px-8 py-4 text-lg font-medium transition-all duration-300">
                Watch Demo
              </button>
            </div>

            <!-- Trust Indicators -->
            <div class="flex flex-wrap items-center gap-6 pt-8 text-sm text-slate-400">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Accurate Cost Estimation</span>
              </div>
              
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Google Earth Integration</span>
              </div>
              
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Professional Documents</span>
              </div>
            </div>
          </div>

          <!-- Visual Preview Card -->
          <div class="lg:w-1/2 flex justify-center">
            <div class="card-primary w-full max-w-md relative group hover:shadow-2xl transition-all duration-500">
              <div class="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              <h3 class="text-2xl font-bold mb-6">Project Summary</h3>
              
              <div class="space-y-4 mb-6">
                <div class="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span class="text-slate-300">Land Area:</span>
                  <span class="font-semibold">500 m²</span>
                </div>
                
                <div class="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span class="text-slate-300">Estimated Cost:</span>
                  <span class="font-semibold">₦15,000,000</span>
                </div>
                
                <div class="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span class="text-slate-300">Construction Time:</span>
                  <span class="font-semibold">6 months</span>
                </div>
                
                <div class="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span class="text-slate-300">Materials Used:</span>
                  <span class="font-semibold">12 types</span>
                </div>
              </div>
              
              <!-- Progress Bar -->
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span>Design Progress</span>
                  <span>65%</span>
                </div>
                <div class="w-full bg-slate-700 rounded-full h-3">
                  <div class="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full" style="width: 65%;"></div>
                </div>
              </div>
              
              <!-- CTA Button -->
              <button class="w-full mt-6 btn-glass btn-outline py-3 font-medium">
                View Full Details →
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    const startDesignBtn = hero.querySelector('#start-design');
    if (startDesignBtn) {
      startDesignBtn.addEventListener('click', () => {
        window.location.href = 'pages/design.html';
      });
    }

    const viewDemoBtn = hero.querySelector('#view-demo');
    if (viewDemoBtn) {
      viewDemoBtn.addEventListener('click', () => {
        alert('Demo video would play here');
      });
    }

    return hero;
  }
</script>