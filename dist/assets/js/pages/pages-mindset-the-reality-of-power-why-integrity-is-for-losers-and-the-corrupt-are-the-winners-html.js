document.addEventListener('DOMContentLoaded', () => {
            // Header functionality
            const mobileMenuToggle = document.getElementById('mobileMenuToggle');
            const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
            const mobileMenuClose = document.getElementById('mobileMenuClose');
            const searchToggle = document.getElementById('searchToggle');
            const searchBox = document.getElementById('searchBox');
            const searchInput = document.querySelector('.search-input');
            const toggleChapters = document.getElementById('toggleChapters');
            const chapterNav = document.getElementById('chapterNav');
            const progressBar = document.getElementById('progressBar');

            // Mobile menu
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

            // Search
            searchToggle?.addEventListener('click', () => {
                const isActive = searchBox?.classList.contains('active');
                searchBox?.classList.toggle('active');
                searchToggle?.setAttribute('aria-expanded', !isActive);
                if (!isActive && searchInput) searchInput.focus();
            });

            // Close on escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    searchBox?.classList.remove('active');
                    searchToggle?.setAttribute('aria-expanded', 'false');
                    mobileMenuOverlay?.classList.remove('active');
                    chapterNav?.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            // Preloader
            window.addEventListener('load', () => {
                setTimeout(() => {
                    document.getElementById('preloader').style.display = 'none';
                }, 1000);
            });

            // Matrix animation
            const matrixAnimation = document.querySelector('.matrix-animation');
            if (matrixAnimation) {
                function startMatrixAnimation() {
                    const text = matrixAnimation.textContent;
                    matrixAnimation.textContent = '';
                    matrixAnimation.classList.remove('typing');
                    void matrixAnimation.offsetWidth;
                    matrixAnimation.textContent = text;
                    matrixAnimation.classList.add('typing');
                }
                startMatrixAnimation();
                setInterval(startMatrixAnimation, 4000);
            }

            // Scroll header effect
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

            // Matrix background
            const matrixBg = document.getElementById('matrix-bg');
            if (matrixBg) {
                for (let i = 0; i < 50; i++) {
                    const char = document.createElement('div');
                    char.classList.add('matrix-char');
                    char.textContent = String.fromCharCode(33 + Math.random() * 94);
                    char.style.left = Math.random() * 100 + 'vw';
                    char.style.animationDelay = Math.random() * 5 + 's';
                    matrixBg.appendChild(char);
                }
            }

            // Particles
            const particleContainer = document.getElementById('particles');
            if (particleContainer) {
                for (let i = 0; i < 50; i++) {
                    const particle = document.createElement('div');
                    particle.classList.add('particle');
                    particle.style.left = Math.random() * 100 + 'vw';
                    particle.style.top = Math.random() * 100 + 'vh';
                    particle.style.animationDelay = Math.random() * 3 + 's';
                    particleContainer.appendChild(particle);
                }
            }

            // Cursor trail
            const cursorTrail = document.getElementById('cursor-trail');
            if (cursorTrail) {
                document.addEventListener('mousemove', (e) => {
                    cursorTrail.style.left = e.clientX - 15 + 'px';
                    cursorTrail.style.top = e.clientY - 15 + 'px';
                });
            }

            // Terminal animation
            const terminalContent = document.querySelector('.terminal-content');
            if (terminalContent && !terminalContent.dataset.animated) {
                function startTerminalSequence() {
                    const lines = document.querySelectorAll('.terminal-line');
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
                    terminalContent.dataset.animated = 'true';
                }
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            startTerminalSequence();
                        }
                    });
                }, { threshold: 0.1 });
                
                observer.observe(terminalContent);
            }

            // Chapter navigation toggle
            toggleChapters?.addEventListener('click', () => {
                chapterNav?.classList.toggle('active');
            });

            // Progress bar
            window.addEventListener('scroll', () => {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                progressBar.style.width = scrolled + '%';
            });

            // Chapter link highlighting
            const chapterLinks = document.querySelectorAll('.chapter-link');
            const sections = document.querySelectorAll('h2[id]');

            function highlightChapter() {
                let scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
                
                sections.forEach((section, index) => {
                    const sectionTop = section.offsetTop - 100;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        chapterLinks.forEach(link => link.classList.remove('active'));
                        chapterLinks[index]?.classList.add('active');
                    }
                });
            }

            window.addEventListener('scroll', highlightChapter);
            highlightChapter(); // Initial call

            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 100,
                            behavior: 'smooth'
                        });
                        
                        // Close chapter nav on mobile
                        if (window.innerWidth < 1024) {
                            chapterNav?.classList.remove('active');
                        }
                    }
                });
            });

            // Newsletter form
            const newsletterForm = document.querySelector('.newsletter-container');
            const newsletterButton = newsletterForm?.querySelector('button');
            const newsletterInput = newsletterForm?.querySelector('input[type="email"]');
            
            newsletterButton?.addEventListener('click', () => {
                const email = newsletterInput?.value.trim();
                if (email && email.includes('@')) {
                    alert('🔥 Welcome to the inner circle. Forbidden knowledge incoming.');
                    newsletterInput.value = '';
                } else {
                    alert('Enter a valid email address.');
                }
            });

            // Enter key support for newsletter
            newsletterInput?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    newsletterButton?.click();
                }
            });

            // Auto-expand chapter nav on desktop
            if (window.innerWidth >= 1024) {
                setTimeout(() => {
                    chapterNav?.classList.add('active');
                }, 2000);
            }
        });
