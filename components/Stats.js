<!-- Stats Section Component with Glassmorphism Effect -->
<script type="module">
  export function renderStats() {
    const stats = document.createElement('section');
    stats.className = 'py-16 px-6 bg-slate-800/50 glass';
    stats.innerHTML = `
      <div class="container mx-auto max-w-6xl">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <!-- Stat 1 -->
          <div class="stat-item">
            <div class="text-3xl md:text-4xl font-bold text-indigo-400 mb-2" data-target="10000">0</div>
            <p class="text-slate-300">Projects Created</p>
          </div>
          
          <!-- Stat 2 -->
          <div class="stat-item">
            <div class="text-3xl md:text-4xl font-bold text-purple-400 mb-2" data-target="5000000000">₦0</div>
            <p class="text-slate-300">Estimated Value</p>
          </div>
          
          <!-- Stat 3 -->
          <div class="stat-item">
            <div class="text-3xl md:text-4xl font-bold text-pink-400 mb-2" data-target="500">0</div>
            <p class="text-slate-300">Construction Firms</p>
          </div>
          
          <!-- Stat 4 -->
          <div class="stat-item">
            <div class="text-3xl md:text-4xl font-bold text-blue-400 mb-2" data-target="98">0%</div>
            <p class="text-slate-300">Accuracy Rate</p>
          </div>
        </div>
      </div>
    `;

    // Animation function for counting up stats
    function animateStats() {
      const statItems = stats.querySelectorAll('.stat-item');
      
      statItems.forEach(item => {
        const target = parseInt(item.querySelector('[data-target]').dataset.target);
        const display = item.querySelector('[data-target]');
        const isCurrency = display.textContent.startsWith('₦');
        const isPercentage = display.textContent.endsWith('%');
        
        let count = 0;
        const increment = Math.ceil(target / 50);
        const duration = 2000; // 2 seconds
        const stepTime = Math.abs(Math.floor(duration / (target / increment)));
        
        const timer = setInterval(() => {
          count += increment;
          
          if (count >= target) {
            count = target;
            clearInterval(timer);
          }
          
          let text = count.toLocaleString();
          if (isCurrency) text = '₦' + text;
          if (isPercentage) text = text + '%';
          
          display.textContent = text;
        }, stepTime);
      });
    }

    // Intersection Observer to trigger animation when in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(stats);

    return stats;
  }
</script>