document.addEventListener('DOMContentLoaded', () => {
            // Matrix Animation
            const matrixAnimation = document.querySelector('.matrix-animation');
            function startMatrixAnimation() {
                matrixAnimation.textContent = '';
                matrixAnimation.classList.remove('typing');
                void matrixAnimation.offsetWidth; // Trigger reflow
                matrixAnimation.textContent = 'ESCAPING THE MATRIX';
                matrixAnimation.classList.add('typing');
            }
            
            startMatrixAnimation();
            setInterval(startMatrixAnimation, 4000);

            // Matrix Rain Effect
            const matrixBg = document.getElementById('matrix-bg');
            function createMatrixRain() {
                for (let i = 0; i < 50; i++) {
                    const char = document.createElement('div');
                    char.classList.add('matrix-char');
                    char.textContent = String.fromCharCode(33 + Math.random() * 94);
                    char.style.left = Math.random() * 100 + 'vw';
                    char.style.animationDelay = Math.random() * 5 + 's';
                    char.style.fontSize = (12 + Math.random() * 8) + 'px';
                    matrixBg.appendChild(char);
                    
                    // Remove old characters after animation
                    setTimeout(() => {
                        if (char.parentNode === matrixBg) {
                            matrixBg.removeChild(char);
                        }
                    }, 5000);
                }
            }
            
            createMatrixRain();
            setInterval(createMatrixRain, 200);

            // Particles Effect
            const particleContainer = document.getElementById('particles');
            function createParticles() {
                for (let i = 0; i < 50; i++) {
                    const particle = document.createElement('div');
                    particle.classList.add('particle');
                    particle.style.left = Math.random() * 100 + 'vw';
                    particle.style.top = Math.random() * 100 + 'vh';
                    particle.style.animationDelay = Math.random() * 3 + 's';
                    particle.style.width = (3 + Math.random() * 4) + 'px';
                    particle.style.height = particle.style.width;
                    particleContainer.appendChild(particle);
                    
                    setTimeout(() => {
                        if (particle.parentNode === particleContainer) {
                            particleContainer.removeChild(particle);
                        }
                    }, 10000);
                }
            }
            
            createParticles();
            setInterval(createParticles, 500);

            // Cursor Trail Effect
            const cursorTrail = document.getElementById('cursor-trail');
            let mouseX = 0;
            let mouseY = 0;
            let trailX = 0;
            let trailY = 0;
            
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });
            
            function animateCursor() {
                // Smooth follow effect
                trailX += (mouseX - trailX) * 0.1;
                trailY += (mouseY - trailY) * 0.1;
                
                cursorTrail.style.left = trailX - 15 + 'px';
                cursorTrail.style.top = trailY - 15 + 'px';
                
                // Size based on speed
                const speed = Math.sqrt(Math.pow(mouseX - trailX, 2) + Math.pow(mouseY - trailY, 2));
                const size = Math.min(30, Math.max(15, speed / 2));
                cursorTrail.style.width = size + 'px';
                cursorTrail.style.height = size + 'px';
                
                requestAnimationFrame(animateCursor);
            }
            
            animateCursor();

            // CTA Button Interaction
            const ctaButton = document.getElementById('startJourney');
            ctaButton.addEventListener('click', (event) => {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = ctaButton.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = event.clientX - rect.left - size / 2;
                const y = event.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.4);
                    transform: scale(0);
                    animation: ripple-animation 0.6s linear;
                    width: ${size}px;
                    height: ${size}px;
                    top: ${y}px;
                    left: ${x}px;
                `;
                
                ctaButton.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => {
                    ripple.remove();
                }, 600);
                
                // Action
                console.log('Starting journey...');
                alert('🚀 Welcome to Tzeptosoft! Ready to escape the matrix?');
                
                // Optional: Add loading state
                const originalText = ctaButton.textContent;
                ctaButton.textContent = 'Loading...';
                ctaButton.disabled = true;
                
                setTimeout(() => {
                    ctaButton.textContent = originalText;
                    ctaButton.disabled = false;
                }, 1500);
            });

            // Holographic elements interaction
            document.querySelectorAll('.holo-element').forEach(element => {
                element.addEventListener('mouseenter', () => {
                    element.style.animationDuration = '2s';
                    element.style.opacity = '1';
                });
                
                element.addEventListener('mouseleave', () => {
                    element.style.animationDuration = '4s';
                    element.style.opacity = '0.7';
                });
            });

            // Dynamic text effect (optional)
            const subtitles = [
                "Raw, Unfiltered Wisdom for Warriors to Build Empires and Dominate Life",
                "For Men & Women Ready to Escape the Matrix",
                "No Bullshit. No Filter. No Apologies.",
                "Build Your Legacy. Dominate Your Life."
            ];
            
            let subtitleIndex = 0;
            const heroSubtitle = document.querySelector('.hero-subtitle');
            
            function rotateSubtitle() {
                subtitleIndex = (subtitleIndex + 1) % subtitles.length;
                heroSubtitle.style.opacity = '0';
                
                setTimeout(() => {
                    heroSubtitle.textContent = subtitles[subtitleIndex];
                    heroSubtitle.style.opacity = '1';
                }, 500);
            }
            
            // Uncomment to enable rotating subtitles
            // setInterval(rotateSubtitle, 5000);

            // Stats counter animation
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                let current = 0;
                const increment = target / 30;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
                }, 50);
            });

            // Responsive adjustments
            function handleResize() {
                const holoElements = document.querySelectorAll('.holo-element');
                const isMobile = window.innerWidth < 768;
                
                holoElements.forEach(el => {
                    el.style.display = isMobile ? 'none' : 'block';
                });
            }
            
            window.addEventListener('resize', handleResize);
            handleResize(); // Initial check
        });
