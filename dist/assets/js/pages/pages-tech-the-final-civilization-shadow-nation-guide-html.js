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
                }, 1000);
            });

            // AI Background Animation
            const aiBg = document.getElementById('ai-bg');
            const aiChars = '01';
            for (let i = 0; i < 100; i++) {
                const char = document.createElement('div');
                char.classList.add('ai-char');
                char.textContent = aiChars[Math.floor(Math.random() * aiChars.length)];
                char.style.left = Math.random() * 100 + 'vw';
                char.style.animationDelay = Math.random() * 3 + 's';
                char.style.fontSize = (10 + Math.random() * 10) + 'px';
                char.style.opacity = 0.3 + Math.random() * 0.4;
                aiBg.appendChild(char);
            }

            // Particles
            const particleContainer = document.getElementById('particles');
            for (let i = 0; i < 40; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                particle.style.left = Math.random() * 100 + 'vw';
                particle.style.top = Math.random() * 100 + 'vh';
                particle.style.animationDelay = Math.random() * 3 + 's';
                particle.style.width = particle.style.height = (2 + Math.random() * 4) + 'px';
                particleContainer.appendChild(particle);
            }

            // Cursor Trail
            const cursorTrail = document.getElementById('cursor-trail');
            document.addEventListener('mousemove', (e) => {
                cursorTrail.style.left = e.clientX - 15 + 'px';
                cursorTrail.style.top = e.clientY - 15 + 'px';
            });

            // Related Card Click Handlers
            document.querySelectorAll('.related-card').forEach(card => {
                card.addEventListener('click', function() {
                    const link = this.getAttribute('onclick')?.match(/window\.location\.href='([^']+)'/)?.[1];
                    if (link) {
                        alert(`Navigating to: ${link}\n\nIn a real site, this would take you to the article.`);
                        // window.location.href = link; // Uncomment for real navigation
                    }
                });
            });

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

            // Word Count Display
            const wordCount = document.querySelectorAll('.article-paragraph, .code-block, .article-list li, .quote-box, .timeline-content, .warning-box p, .extinction-box p, .survival-box p');
            let totalWords = 0;
            wordCount.forEach(element => {
                totalWords += element.textContent.split(/\s+/).length;
            });
            
            // Add word count to meta
            const wordCountElement = document.createElement('div');
            wordCountElement.style.position = 'fixed';
            wordCountElement.style.bottom = '20px';
            wordCountElement.style.right = '20px';
            wordCountElement.style.backgroundColor = 'rgba(255, 0, 51, 0.8)';
            wordCountElement.style.color = 'white';
            wordCountElement.style.padding = '10px';
            wordCountElement.style.borderRadius = '5px';
            wordCountElement.style.fontFamily = "'JetBrains Mono', monospace";
            wordCountElement.style.fontSize = '12px';
            wordCountElement.style.zIndex = '1000';
            wordCountElement.textContent = `Words: ${totalWords.toLocaleString()}`;
            document.body.appendChild(wordCountElement);
        });
