<!-- Footer Component with Glassmorphism Effect -->
<script type="module">
  export function renderFooter() {
    const footer = document.createElement('footer');
    footer.className = 'bg-slate-800/70 glass py-12 px-6';
    footer.innerHTML = `
      <div class="container mx-auto max-w-7xl">
        <div class="grid md:grid-cols-4 gap-8 mb-8">
          <!-- Company Info -->
          <div class="md:col-span-2">
            <div class="flex items-center space-x-3 mb-4">
              <svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <circle cx="8" cy="6" r="2" fill="#6366f1"/>
                <circle cx="16" cy="12" r="2" fill="#8b5cf6"/>
                <circle cx="12" cy="18" r="2" fill="#ec4899"/>
              </svg>
              <span class="text-xl font-semibold">Idi UBC LTD</span>
            </div>
            
            <p class="text-slate-300 mb-4 leading-relaxed">
              Your trusted partner in digital construction planning and cost estimation. 
              Empowering architects, builders, and homeowners with cutting-edge technology.
            </p>
            
            <div class="flex flex-wrap gap-4 text-sm text-slate-400">
              <a href="#privacy" class="hover:text-white transition duration-300 hover:underline">Privacy Policy</a>
              <a href="#terms" class="hover:text-white transition duration-300 hover:underline">Terms of Service</a>
              <a href="#cookies" class="hover:text-white transition duration-300 hover:underline">Cookie Policy</a>
              <a href="#security" class="hover:text-white transition duration-300 hover:underline">Security</a>
            </div>
          </div>
          
          <!-- Quick Links -->
          <div>
            <h4 class="font-semibold mb-4 text-white">Quick Links</h4>
            <ul class="space-y-2">
              <li><a href="#home" class="text-slate-300 hover:text-white transition duration-300 hover:underline">Home</a></li>
              <li><a href="#design" class="text-slate-300 hover:text-white transition duration-300 hover:underline">Design Tool</a></li>
              <li><a href="#estimate" class="text-slate-300 hover:text-white transition duration-300 hover:underline">Cost Estimator</a></li>
              <li><a href="#templates" class="text-slate-300 hover:text-white transition duration-300 hover:underline">Templates</a></li>
              <li><a href="#about" class="text-slate-300 hover:text-white transition duration-300 hover:underline">About Us</a></li>
              <li><a href="#contact" class="text-slate-300 hover:text-white transition duration-300 hover:underline">Contact</a></li>
            </ul>
          </div>
          
          <!-- Legal & Support -->
          <div>
            <h4 class="font-semibold mb-4 text-white">Support</h4>
            <ul class="space-y-2">
              <li><a href="#help" class="text-slate-300 hover:text-white transition duration-300 hover:underline">Help Center</a></li>
              <li><a href="#docs" class="text-slate-300 hover:text-white transition duration-300 hover:underline">Documentation</a></li>
              <li><a href="#api" class="text-slate-300 hover:text-white transition duration-300 hover:underline">API Reference</a></li>
              <li><a href="#status" class="text-slate-300 hover:text-white transition duration-300 hover:underline">System Status</a></li>
              <li><a href="#feedback" class="text-slate-300 hover:text-white transition duration-300 hover:underline">Feedback</a></li>
            </ul>
          </div>
        </div>
        
        <!-- Bottom Bar -->
        <div class="border-t border-white/20 pt-8 mt-8 text-center">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-slate-400 mb-4 md:mb-0">
              &copy; <span id="current-year">2025</span> Idi UBC LTD. All rights reserved.
            </p>
            
            <div class="flex space-x-6">
              <a href="#facebook" class="text-slate-400 hover:text-white transition duration-300">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              <a href="#twitter" class="text-slate-400 hover:text-white transition duration-300">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              
              <a href="#instagram" class="text-slate-400 hover:text-white transition duration-300">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zm9.252 11.987c0 5.078-4.12 9.198-9.252 9.198-5.132 0-9.252-4.12-9.252-9.198 0-5.077 4.12-9.197 9.252-9.197 5.133-.001 9.252 4.12 9.252 9.197zm-14.442 0c0 2.757 2.243 5.001 5.001 5.001 2.756 0 5.001-2.244 5.001-5.001 0-2.756-2.244-5-5.001-5-2.758 0-5.001 2.244-5.001 5zm7.402-4.95c-.814 0-1.475.66-1.475 1.474 0 .814.661 1.474 1.475 1.474.814 0 1.474-.66 1.474-1.474 0-.814-.66-1.474-1.474-1.474zm-6.398 1.544c.365 0 .659-.294.659-.659 0-.364-.294-.658-.659-.658-.364 0-.658.294-.658.658 0 .365.294.659.658.659zm1.318 8.406h10.083c.854 0 1.55-.695 1.55-1.55v-5.954c0-.854-.696-1.55-1.55-1.55H7.907c-.854 0-1.55.696-1.55 1.55v5.954c0 .855.696 1.55 1.55 1.55z"/>
                </svg>
              </a>
              
              <a href="#linkedin" class="text-slate-400 hover:text-white transition duration-300">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    // Set current year
    const yearElement = footer.querySelector('#current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }

    return footer;
  }
</script>