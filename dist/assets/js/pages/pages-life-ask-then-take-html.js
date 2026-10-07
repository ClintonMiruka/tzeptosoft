document.addEventListener('DOMContentLoaded', () => {
      // Header Functionality
      const mobileMenuToggle = document.getElementById('mobileMenuToggle');
      const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
      const mobileMenuClose = document.getElementById('mobileMenuClose');
      const searchToggle = document.getElementById('searchToggle');
      const searchBox = document.getElementById('searchBox');
      const searchInput = document.querySelector('.search-input');

      // Mobile Menu Toggle
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

      // Search Toggle
      searchToggle?.addEventListener('click', () => {
        const isActive = searchBox?.classList.contains('active');
        searchBox?.classList.toggle('active');
        searchToggle?.setAttribute('aria-expanded', !isActive);
        
        if (!isActive && searchInput) {
          searchInput.focus();
        }
      });

      // Close search and mobile menu on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          searchBox?.classList.remove('active');
          searchToggle?.setAttribute('aria-expanded', 'false');
          mobileMenuOverlay?.classList.remove('active');
          document.body.style.overflow = '';
        }
      });

      // Search functionality
      const searchForm = document.querySelector('.search-box');
      searchForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput?.value.trim();
        if (query) {
          console.log('Searching for:', query);
          // Implement your search logic here
        }
      });

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

      // Preloader
      window.addEventListener('load', () => {
        document.getElementById('preloader').style.display = 'none';
      });

      // Matrix Animation
      const matrixAnimation = document.querySelector('.matrix-animation');
      function startMatrixAnimation() {
        matrixAnimation.textContent = '';
        matrixAnimation.classList.remove('typing');
        void matrixAnimation.offsetWidth;
        matrixAnimation.textContent = 'ASK, THEN TAKE';
        matrixAnimation.classList.add('typing');
      }
      startMatrixAnimation();
      setInterval(startMatrixAnimation, 4000);

      // Intersection Observer for Sections
      const sections = document.querySelectorAll('.blog-container, .terminal-content');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('terminal-content') && !entry.target.dataset.animated) {
              startTerminalSequence();
              entry.target.dataset.animated = 'true';
            }
          }
        });
      }, { threshold: 0.1 });
      sections.forEach(section => observer.observe(section));

      // Terminal Sequence
      function startTerminalSequence() {
        const lines = document.querySelectorAll('.terminal-content .terminal-line');
        let delay = 0;
        lines.forEach(line => {
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
          }, delay);
          delay += 1000;
        });
      }

      // Matrix Rain
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

      // Cursor Trail
      const cursorTrail = document.getElementById('cursor-trail');
      document.addEventListener('mousemove', (e) => {
        cursorTrail.style.left = e.clientX - 15 + 'px';
        cursorTrail.style.top = e.clientY - 15 + 'px';
      });
    });
