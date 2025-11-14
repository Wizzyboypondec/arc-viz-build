<!-- Navbar Component with Glassmorphism Effect -->
<script type="module">
  export function renderNavbar() {
    const navbar = document.createElement('nav');
    navbar.className = 'fixed top-0 w-full z-50 px-6 py-4 glass';
    navbar.innerHTML = `
      <div class="container mx-auto flex items-center justify-between">
        <!-- Logo Section -->
        <div class="flex items-center space-x-3">
          <svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <circle cx="8" cy="6" r="2" fill="#6366f1"/>
            <circle cx="16" cy="12" r="2" fill="#8b5cf6"/>
            <circle cx="12" cy="18" r="2" fill="#ec4899"/>
          </svg>
          <span class="text-xl font-semibold">Idi UBC LTD</span>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex space-x-8">
          <a href="#home" class="nav-link hover:text-purple-300 transition duration-300">Home</a>
          <a href="#design" class="nav-link hover:text-purple-300 transition duration-300">Design</a>
          <a href="#estimate" class="nav-link hover:text-purple-300 transition duration-300">Estimate</a>
          <a href="#documents" class="nav-link hover:text-purple-300 transition duration-300">Documents</a>
          <a href="#about" class="nav-link hover:text-purple-300 transition duration-300">About</a>
        </div>

        <!-- User Actions -->
        <div class="hidden md:flex items-center space-x-4">
          <button id="login-btn" class="btn-glass btn-outline text-sm">Login</button>
          <button id="dashboard-btn" class="btn-glass btn-primary text-sm">Dashboard</button>
        </div>

        <!-- Mobile Menu Button -->
        <button id="mobile-menu-toggle" class="md:hidden flex items-center p-2 rounded-lg hover:bg-white/10 transition-colors">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div id="mobile-menu" class="md:hidden hidden bg-slate-900/95 glass mt-2 mx-6 rounded-xl overflow-hidden backdrop-blur-md">
        <div class="flex flex-col p-4 space-y-2">
          <a href="#home" class="py-3 px-4 nav-link hover:bg-white/10 rounded-lg transition-colors">Home</a>
          <a href="#design" class="py-3 px-4 nav-link hover:bg-white/10 rounded-lg transition-colors">Design</a>
          <a href="#estimate" class="py-3 px-4 nav-link hover:bg-white/10 rounded-lg transition-colors">Estimate</a>
          <a href="#documents" class="py-3 px-4 nav-link hover:bg-white/10 rounded-lg transition-colors">Documents</a>
          <a href="#about" class="py-3 px-4 nav-link hover:bg-white/10 rounded-lg transition-colors">About</a>
          <div class="pt-4 border-t border-white/20 mt-4">
            <button id="mobile-login" class="w-full mb-2 btn-glass btn-outline">Login</button>
            <button id="mobile-dashboard" class="w-full btn-glass btn-primary">Dashboard</button>
          </div>
        </div>
      </div>
    `;

    // Add mobile menu toggle functionality
    navbar.querySelector('#mobile-menu-toggle').addEventListener('click', function() {
      const menu = navbar.querySelector('#mobile-menu');
      menu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking a link
    const mobileLinks = navbar.querySelectorAll('#mobile-menu a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbar.querySelector('#mobile-menu').classList.add('hidden');
      });
    });

    return navbar;
  }
</script>