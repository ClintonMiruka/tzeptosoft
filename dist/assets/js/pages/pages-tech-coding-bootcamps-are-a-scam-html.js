document.addEventListener('DOMContentLoaded', () => {
      const mobileMenuToggle = document.getElementById('mobileMenuToggle');
      const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
      const mobileMenuClose = document.getElementById('mobileMenuClose');
      const searchToggle = document.getElementById('searchToggle');
      const searchBox = document.getElementById('searchBox');
      const searchInput = document.querySelector('.search-input');

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

      searchToggle?.addEventListener('click', () => {
        const isActive = searchBox?.classList.contains('active');
        searchBox?.classList.toggle('active');
        searchToggle?.setAttribute('aria-expanded', !isActive);
        if (!isActive && searchInput) searchInput.focus();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          searchBox?.classList.remove('active');
          searchToggle?.setAttribute('aria-expanded', 'false');
          mobileMenuOverlay?.classList.remove('active');
          document.body.style.overflow = '';
        }
      });

      window.addEventListener('load', () => {
        document.getElementById('preloader').style.display = 'none';
      });

      const matrixAnimation = document.querySelector('.matrix-animation');
      function startMatrixAnimation() {
        matrixAnimation.textContent = '';
        matrixAnimation.classList.remove('typing');
        void matrixAnimation.offsetWidth;
        matrixAnimation.textContent = 'REJECT THE SCAM. FORGE YOUR CODE.';
        matrixAnimation.classList.add('typing');
      }
      startMatrixAnimation();
      setInterval(startMatrixAnimation, 4000);

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

      const matrixBg = document.getElementById('matrix-bg');
      for (let i = 0; i < 60; i++) {
        const char = document.createElement('div');
        char.classList.add('matrix-char');
        char.textContent = String.fromCharCode(33 + Math.random() * 94);
        char.style.left = Math.random() * 100 + 'vw';
        char.style.animationDelay = Math.random() * 5 + 's';
        matrixBg.appendChild(char);
      }

      const particleContainer = document.getElementById('particles');
      for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particleContainer.appendChild(particle);
      }

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

      // Checklist Interactivity
      const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          const item = checkbox.closest('.checklist-item');
          if (checkbox.checked) {
            item.classList.add('completed');
          } else {
            item.classList.remove('completed');
          }
        });
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
    });
