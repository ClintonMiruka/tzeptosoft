document.addEventListener('DOMContentLoaded', () => {
      // Mobile menu functionality
      const mobileMenuToggle = document.getElementById('mobileMenuToggle');
      const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
      const mobileMenuClose = document.getElementById('mobileMenuClose');
      const searchToggle = document.getElementById('searchToggle');
      const searchBox = document.getElementById('searchBox');
      const searchInput = document.querySelector('.search-input');
      const hackBtn = document.querySelector('.hack-btn');
      const hackOutput = document.querySelector('.hack-output');

      // Mobile menu toggle
      mobileMenuToggle?.addEventListener('click', () => {
        mobileMenuOverlay?.classList.toggle('active');
        document.body.style.overflow = mobileMenuOverlay?.classList.contains('active') ? 'hidden' : '';
      });

      mobileMenuClose?.addEventListener('click', () => {
        mobileMenuOverlay?.classList.remove('active');
        document.body.style.overflow = '';
      });

      mobileMenuOverlay?.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
          mobileMenuOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });

      // Search functionality
      searchToggle?.addEventListener('click', () => {
        const isActive = searchBox?.classList.contains('active');
        searchBox?.classList.toggle('active');
        searchToggle?.setAttribute('aria-expanded', !isActive);
        if (!isActive && searchInput) searchInput.focus();
      });

      // Escape key to close menus
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          searchBox?.classList.remove('active');
          searchToggle?.setAttribute('aria-expanded', 'false');
          mobileMenuOverlay?.classList.remove('active');
          document.body.style.overflow = '';
        }
      });

      // Remove preloader
      window.addEventListener('load', () => {
        document.getElementById('preloader').style.display = 'none';
      });

      // Matrix animation
      const matrixAnimation = document.querySelector('.matrix-animation');
      function startMatrixAnimation() {
        matrixAnimation.textContent = '';
        matrixAnimation.classList.remove('typing');
        void matrixAnimation.offsetWidth;
        matrixAnimation.textContent = 'FORGING FUTURE KINGS';
        matrixAnimation.classList.add('typing');
      }
      startMatrixAnimation();
      setInterval(startMatrixAnimation, 4000);

      // Header scroll effect
      let lastScrollY = window.scrollY;
      window.addEventListener('scroll', () => {
        const header = document.querySelector('.main-header');
        const currentScrollY = window.scrollY;
        if (currentScrollY > 100) {
          header?.classList.add('scrolled');
        } else {
          header?.classList.remove('scrolled');
        }
        lastScrollY = currentScrollY;
      });

      // Matrix background characters
      const matrixBg = document.getElementById('matrix-bg');
      for (let i = 0; i < 50; i++) {
        const char = document.createElement('div');
        char.classList.add('matrix-char');
        char.textContent = String.fromCharCode(33 + Math.random() * 94);
        char.style.left = Math.random() * 100 + 'vw';
        char.style.animationDelay = Math.random() * 5 + 's';
        matrixBg.appendChild(char);
      }

      // Particles
      const particleContainer = document.getElementById('particles');
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particleContainer.appendChild(particle);
      }

      // Cursor trail
      const cursorTrail = document.getElementById('cursor-trail');
      document.addEventListener('mousemove', (e) => {
        cursorTrail.style.left = e.clientX - 15 + 'px';
        cursorTrail.style.top = e.clientY - 15 + 'px';
      });

      // Terminal animation
      const terminalLines = document.querySelectorAll('.terminal-line');
      let delay = 0;
      terminalLines.forEach(line => {
        line.textContent = '';
        const text = line.dataset.text;
        let charIndex = 0;
        setTimeout(() => {
          const type = () => {
            if (charIndex < text.length) {
              line.textContent += text[charIndex];
              charIndex++;
              setTimeout(type, 35);
            } else {
              line.classList.add('typed');
            }
          };
          type();
        }, delay);
        delay += 1000;
      });

      // Hack button functionality
      hackBtn?.addEventListener('click', () => {
        hackBtn.disabled = true;
        hackBtn.textContent = 'Protocol Active...';
        hackOutput.classList.add('active');
        
        const hackLines = hackOutput.querySelectorAll('.terminal-line');
        let hackDelay = 0;
        hackLines.forEach(line => {
          line.textContent = '';
          const text = line.dataset.text;
          let charIndex = 0;
          setTimeout(() => {
            const type = () => {
              if (charIndex < text.length) {
                line.textContent += text[charIndex];
                charIndex++;
                setTimeout(type, 30);
              } else {
                line.classList.add('typed');
              }
            };
            type();
          }, hackDelay);
          hackDelay += 1500;
        });
        
        setTimeout(() => {
          hackBtn.textContent = 'Protocol Complete ✅';
          hackBtn.style.background = 'linear-gradient(90deg, #00CC00, #00FF00)';
        }, 5000);
      });

      // Smooth scroll for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 100,
              behavior: 'smooth'
            });
          }
        });
      });

      // Newsletter form
      const newsletterBtn = document.querySelector('.newsletter-container button');
      const newsletterInput = document.querySelector('.newsletter-container input');
      
      newsletterBtn?.addEventListener('click', () => {
        if (newsletterInput.value && newsletterInput.value.includes('@')) {
          newsletterBtn.innerHTML = '<i class="fas fa-check"></i> Royal Access Granted!';
          newsletterBtn.style.background = 'linear-gradient(90deg, #00CC00, #00FF00)';
          newsletterInput.value = '';
          setTimeout(() => {
            newsletterBtn.innerHTML = 'Subscribe to Power 🚀';
            newsletterBtn.style.background = '';
          }, 3000);
        }
      });
      
      newsletterInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          newsletterBtn.click();
        }
      });
    });
