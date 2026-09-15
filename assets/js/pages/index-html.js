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
                if (!isActive && searchInput) searchInput.focus();
            });

            // Escape Key Close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    searchBox?.classList.remove('active');
                    searchToggle?.setAttribute('aria-expanded', 'false');
                    mobileMenuOverlay?.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            // Preloader
            window.addEventListener('load', () => {
                setTimeout(() => {
                    document.getElementById('preloader').style.display = 'none';
                }, 800);
            });

            // Matrix Animation
            const matrixAnimation = document.querySelector('.matrix-animation');
            function startMatrixAnimation() {
                matrixAnimation.textContent = '';
                matrixAnimation.classList.remove('typing');
                void matrixAnimation.offsetWidth;
                matrixAnimation.textContent = 'ESCAPING THE MATRIX';
                matrixAnimation.classList.add('typing');
            }
            startMatrixAnimation();
            setInterval(startMatrixAnimation, 4000);

            // Scroll Header Effect
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

            // Smooth Scrolling for Anchor Links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                });
            });

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

            // Newsletter Form
            const newsletterForm = document.getElementById('newsletterForm');
            newsletterForm?.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                
                // Simple validation
                if (email && email.includes('@')) {
                    // Here you would typically send to your backend
                    alert('🔥 Welcome to the Tzeptosoft tribe! Check your email for confirmation.');
                    newsletterForm.reset();
                } else {
                    alert('Please enter a valid email address.');
                }
            });

            // Article Card Click Handlers - REMOVED DEMO POPUP
            document.querySelectorAll('.article-card').forEach(card => {
                card.addEventListener('click', function() {
                    const link = this.getAttribute('onclick')?.match(/window\.location\.href='([^']+)'/)?.[1];
                    if (link) {
                        // Direct navigation without popup
                        window.location.href = link;
                    }
                });
            });
        });
