document.addEventListener('DOMContentLoaded', () => {
    // Load components
    fetch('/components/hero.html')
      .then(response => response.text())
      .then(data => document.getElementById('hero').innerHTML = data);
    fetch('/components/navbar.html')
      .then(response => response.text())
      .then(data => document.getElementById('navbar').innerHTML = data);
    fetch('/components/blog-header.html')
      .then(response => response.text())
      .then(data => {
        const blogHeader = document.getElementById('blog-header');
        if (blogHeader) blogHeader.innerHTML = data;
      });
    fetch('/components/footer.html')
      .then(response => response.text())
      .then(data => document.getElementById('footer').innerHTML = data);
  
    // Preloader
    window.addEventListener('load', () => {
      document.getElementById('preloader').style.display = 'none';
    });
  
    // Intersection Observer
    const sections = document.querySelectorAll('.section, .blog-container');
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
    }, { threshold: 0.1 });
    sections.forEach(section => observer.observe(section));
  
    // Terminal Sequence
    function startTerminalSequence() {
      const lines = document.querySelectorAll('#terminal .terminal-content .terminal-line');
      let delay = 0;
      lines.forEach(line => {
        line.textContent = ''; // Clear text
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
  
    // Hack Simulation
    const hackBtn = document.querySelector('.hack-btn');
    const hackOutput = document.querySelector('.hack-output');
    let isHacking = false;
    if (hackBtn) {
      hackBtn.addEventListener('click', () => {
        if (isHacking) return; // Prevent multiple clicks
        isHacking = true;
        hackOutput.classList.add('active');
        const hackLines = hackOutput.querySelectorAll('.terminal-line');
        let delay = 0;
        hackLines.forEach(line => {
          line.textContent = ''; // Clear text
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
        // Reset after animation completes
        setTimeout(() => { isHacking = false; }, delay + 1000);
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