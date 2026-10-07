document.addEventListener('DOMContentLoaded', () => {
      // Preloader
      window.addEventListener('load', () => {
        document.getElementById('preloader').style.display = 'none';
      });

      // Intersection Observer
      const sections = document.querySelectorAll('.section, .blog-container, .newsletter-container');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.id === 'terminal' && !entry.target.dataset.animated) {
              startTerminalSequence();
              entry.target.dataset.animated = 'true';
            }
          }
        });
      }, { threshold: 0.2 });
      sections.forEach(section => observer.observe(section));

      // Terminal Sequence
      function startTerminalSequence() {
        const lines = document.querySelectorAll('#terminal .terminal-content .terminal-line');
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
                setTimeout(type, 35);
              } else {
                line.classList.add('typed');
              }
            };
            type();
          }, delay);
          delay += 1000;
        });
      }

      // Hack Simulation
      const hackBtn = document.querySelector('.hack-btn');
      const hackOutput = document.querySelector('.hack-output');
      let isHacking = false;
      if (hackBtn) {
        hackBtn.addEventListener('click', () => {
          if (isHacking) return;
          isHacking = true;
          hackOutput.classList.add('active');
          const hackLines = hackOutput.querySelectorAll('.terminal-line');
          let delay = 0;
          hackLines.forEach(line => {
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
          setTimeout(() => { isHacking = false; }, delay + 1000);
        });
      }

      // Cipher Effect
      const cipherBg = document.getElementById('cipher-bg');
      for (let i = 0; i < 60; i++) {
        const stream = document.createElement('div');
        stream.classList.add('cipher-stream');
        stream.textContent = String.fromCharCode(33 + Math.random() * 94);
        stream.style.left = Math.random() * 100 + 'vw';
        stream.style.animationDelay = Math.random() * 5 + 's';
        cipherBg.appendChild(stream);
      }

      // Particles
      const particleContainer = document.getElementById('particles');
      for (let i = 0; i < 60; i++) {
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
        cursorTrail.style.left = e.clientX - 5 + 'px';
        cursorTrail.style.top = e.clientY - 5 + 'px';
      });
    });
