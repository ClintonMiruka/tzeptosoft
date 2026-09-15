// All your articles data
        const articles = [
            // Masculinity Articles
            {
                title: "Women Don't Want Nice Guys",
                excerpt: "The brutal truth pages/about.html attraction, biology, and what high-value men actually offer.",
                category: "masculinity",
                date: "2024-03-15",
                readTime: "8 min",
                url: "pages/women-dont-wat-nice-guys.html",
                popular: true
            },
            {
                title: "Why You Should Date Many Women Before You Marry",
                excerpt: "15,000-word guide on why dating multiple women before marriage is essential.",
                category: "masculinity",
                date: "2024-02-28",
                readTime: "30 min",
                url: "pages/Why You Should Date Many Women Before You Marry: A Practical Guide for Me.html",
                popular: true
            },
            {
                title: "The War on Masculinity",
                excerpt: "Why modern society wants to strip men of their power and how to fight back.",
                category: "masculinity",
                date: "2024-03-10",
                readTime: "12 min",
                url: "pages/The War on Masculinity: Why Modern Society Wants to Strip Men of Their Power.html"
            },
            {
                title: "Testosterone Warfare: Masculine Vitality",
                excerpt: "How to optimize your hormones, build physical dominance, and reclaim your masculine energy.",
                category: "masculinity",
                date: "2024-02-15",
                readTime: "15 min",
                url: "pages/Testosterone Warfare: Masculine Vitality.html"
            },
            {
                title: "25 Moves Every Ambitious Man Should Master by 25",
                excerpt: "The essential skills, habits, and mindsets every young man needs to dominate his 20s.",
                category: "masculinity",
                date: "2024-01-30",
                readTime: "20 min",
                url: "pages/25 Moves Every Ambitious Man Should Master by 25.html"
            },
            {
                title: "50 Badass Lessons for Young Dudes",
                excerpt: "Raw, unfiltered life lessons for men who want power, not permission.",
                category: "masculinity",
                date: "2024-01-20",
                readTime: "25 min",
                url: "pages/50 Badass Lessons for Young Dudes.html"
            },

            // Femininity Articles
            {
                title: "10 Savage Lessons for Women",
                excerpt: "Ditch feminist lies, secure high-value men, build legendary families.",
                category: "femininity",
                date: "2024-03-12",
                readTime: "10 min",
                url: "pages/10 Savage Lessons for Women.html",
                popular: true
            },
            {
                title: "What is it Like to be a 30-Year-Old Unmarried Woman",
                excerpt: "The brutal reality of the biological clock and social expectations.",
                category: "femininity",
                date: "2024-02-25",
                readTime: "8 min",
                url: "pages/what-is-it-like-to-be-a-30-year-old-unmarried-woman.html"
            },
            {
                title: "How to Know if a Girl is a Virgin",
                excerpt: "Practical guide to understanding female sexual history and value.",
                category: "femininity",
                date: "2024-02-10",
                readTime: "6 min",
                url: "pages/How to know if a girl is a virgin.html"
            },

            // Wealth Articles
            {
                title: "10 Income Streams to Build Before 30",
                excerpt: "Or die building them. The essential wealth-building strategies for young men.",
                category: "wealth",
                date: "2024-03-20",
                readTime: "18 min",
                url: "pages/10 Income Streams to Build Before 30 (Or Die Building Them).html",
                popular: true
            },
            {
                title: "The Modern Man's Guide to Building Wealth Before 30",
                excerpt: "No trust fund needed. Just ruthless execution and smart strategies.",
                category: "wealth",
                date: "2024-03-05",
                readTime: "22 min",
                url: "pages/The Modern Man's Guide to Building Wealth Before 30 (No Trust Fund Needed).html"
            },
            {
                title: "Wealth Warfare: Ruthless Guide to Financial Control",
                excerpt: "How to weaponize money, build multiple income streams, and achieve financial freedom.",
                category: "wealth",
                date: "2024-02-20",
                readTime: "25 min",
                url: "pages/Wealth Warfare: Ruthless Guide to Financial Control.html"
            },
            {
                title: "Master Your Money",
                excerpt: "The ultimate guide to financial discipline, investment, and wealth accumulation.",
                category: "wealth",
                date: "2024-02-05",
                readTime: "15 min",
                url: "pages/master-your-money.html"
            },

            // Mindset Articles
            {
                title: "Build a Mind So Dangerous They Can't Touch You",
                excerpt: "How to develop unbreakable mental fortitude and strategic thinking.",
                category: "mindset",
                date: "2024-03-18",
                readTime: "14 min",
                url: "pages/Build a Mind So Dangerous They Can't Touch You.html",
                popular: true
            },
            {
                title: "Why Discipline Beats Motivation Every Single Time",
                excerpt: "The cold truth pages/about.html consistency, habits, and long-term success.",
                category: "mindset",
                date: "2024-03-08",
                readTime: "9 min",
                url: "pages/Why Discipline Beats Motivation Every Single Time.html"
            },
            {
                title: "Emotional Control Is the Final Boss",
                excerpt: "Mastering your emotions is the ultimate competitive advantage.",
                category: "mindset",
                date: "2024-02-22",
                readTime: "11 min",
                url: "pages/Emotional Control Is the Final Boss.html"
            },
            {
                title: "The Ruthless Code: 21 Unforgiving Laws for Young Men",
                excerpt: "Who refuse to obey society and want to build their own empire.",
                category: "mindset",
                date: "2024-02-12",
                readTime: "18 min",
                url: "pages/ The Ruthless Code: 21 Unforgiving Laws for Young Men Who Refuse to Obey Society.html"
            },
            {
                title: "Mental Jailbreak: Escape Slave Thinking",
                excerpt: "How to escape slave thinking and install a warrior mindset.",
                category: "mindset",
                date: "2024-01-25",
                readTime: "16 min",
                url: "pages/Mental Jailbreak: How to Escape Slave Thinking and Install a Warrior Mindset..html"
            },

            // Tech Articles
            {
                title: "Arch Linux Optimization Guide",
                excerpt: "Turn your laptop into a beast mode coding machine.",
                category: "tech",
                date: "2024-03-25",
                readTime: "35 min",
                url: "pages/Arch Linux Optimization Guide: Turn Your Laptop Into a Beast Mode Coding Machine | Tzeptosoft.html"
            },
            {
                title: "Master Git in One Day",
                excerpt: "The complete guide to version control for developers.",
                category: "tech",
                date: "2024-03-22",
                readTime: "20 min",
                url: "pages/Master Git in One Day.html"
            },
            {
                title: "Top 10 Programming Languages Every Tech Entrepreneur Must Master",
                excerpt: "The essential languages for building digital empires.",
                category: "tech",
                date: "2024-03-14",
                readTime: "25 min",
                url: "pages/Top 10 Programming Languages Every Tech Entrepreneur Must Master ⚔.HTML"
            },
            {
                title: "Coding Bootcamps Are a Scam",
                excerpt: "The truth pages/about.html tech education and how to actually learn to code.",
                category: "tech",
                date: "2024-03-02",
                readTime: "12 min",
                url: "pages/Coding Bootcamps Are a Scam.html"
            },
            {
                title: "How to Start a Software Agency as a Young Man",
                excerpt: "Practical steps to build your own tech business from scratch.",
                category: "tech",
                date: "2024-02-18",
                readTime: "28 min",
                url: "pages/How to Start a Software Agency as a Young Man.html"
            },

            // Relationships Articles
            {
                title: "How to Avoid a False Rape Case",
                excerpt: "A practical guide for men in the modern dating landscape.",
                category: "relationships",
                date: "2024-03-16",
                readTime: "10 min",
                url: "pages/How to Avoid a False Rape Case: A Practical Guide for Men.html"
            },
            {
                title: "How to Protect Yourself as a Man in a Divorce",
                excerpt: "A lawyer's timeless guide to protecting your assets and rights.",
                category: "relationships",
                date: "2024-03-06",
                readTime: "15 min",
                url: "pages/How to Protect Yourself as a Man in a Divorce.html"
            },
            {
                title: "The Law of Reciprocity",
                excerpt: "Why you must treat people how they treat you.",
                category: "relationships",
                date: "2024-02-28",
                readTime: "8 min",
                url: "pages/The Law of Reciprocity: Why You Must Treat People How They Treat You.html"
            },
            {
                title: "Don't Burn Bridges",
                excerpt: "Strategic relationship management for long-term success.",
                category: "relationships",
                date: "2024-02-14",
                readTime: "7 min",
                url: "pages/dont-burn-bridges.html"
            },

            // Life Articles
            {
                title: "Why School Sucks",
                excerpt: "11,500-word manifesto exposing the education system.",
                category: "life",
                date: "2024-03-30",
                readTime: "45 min",
                url: "pages/why school sucks.html",
                popular: true
            },
            {
                title: "Burn the Boats: Why 'Plan B' Is Making You Weak",
                excerpt: "The psychology of total commitment and why it's essential for success.",
                category: "life",
                date: "2024-03-24",
                readTime: "14 min",
                url: "pages/Burn the Boats: Why 'Plan B' Is Making You Weak.html"
            },
            {
                title: "Live on Your Terms",
                excerpt: "How to escape societal expectations and design your ideal life.",
                category: "life",
                date: "2024-03-17",
                readTime: "12 min",
                url: "pages/live-on-your-terms.html"
            },
            {
                title: "Porn is Killing You",
                excerpt: "Stop watching porn or stay weak, broke, and alone.",
                category: "life",
                date: "2024-03-09",
                readTime: "11 min",
                url: "pages/Porn is killing you-stop watching porn or stay weak broke and alone.html"
            },
            {
                title: "Take Ruthless Care of Your Body",
                excerpt: "Your physical health is your most valuable asset.",
                category: "life",
                date: "2024-03-01",
                readTime: "13 min",
                url: "pages/take-ruthless-care-of-your-body.html"
            },
            {
                title: "The Gym is Church",
                excerpt: "Why physical training is spiritual practice for modern men.",
                category: "life",
                date: "2024-02-24",
                readTime: "9 min",
                url: "pages/the-gym-is-church.html"
            },
            {
                title: "Read More Than You Talk",
                excerpt: "The power of silent learning and strategic knowledge acquisition.",
                category: "life",
                date: "2024-02-16",
                readTime: "7 min",
                url: "pages/read-more-than-you-talk.html"
            },
            {
                title: "Avoid Useless Entertainment",
                excerpt: "How to reclaim your time and attention from digital distractions.",
                category: "life",
                date: "2024-02-08",
                readTime: "10 min",
                url: "pages/avoid-useless-entertainment.html"
            },
            {
                title: "Build Skills, Not Just Dreams",
                excerpt: "Practical action beats wishful thinking every time.",
                category: "life",
                date: "2024-02-01",
                readTime: "8 min",
                url: "pages/build-skills-not-dreams.html"
            }
        ];

        document.addEventListener('DOMContentLoaded', () => {
            // Initialize blog functionality
            initializeBlog();
            
            // Header Functionality (same as index.html)
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

        // Blog-specific functionality
        function initializeBlog() {
            const articlesGrid = document.getElementById('articlesGrid');
            const filterBtns = document.querySelectorAll('.filter-btn');
            const sortSelect = document.getElementById('sortSelect');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const pageNumbers = document.getElementById('pageNumbers');
            
            let currentCategory = 'all';
            let currentSort = 'newest';
            let currentPage = 1;
            const articlesPerPage = 12;
            
            // Get category badge class
            function getCategoryBadgeClass(category) {
                const badgeClasses = {
                    'masculinity': 'badge-masculinity',
                    'femininity': 'badge-femininity',
                    'wealth': 'badge-wealth',
                    'mindset': 'badge-mindset',
                    'tech': 'badge-tech',
                    'relationships': 'badge-relationships',
                    'life': 'badge-life'
                };
                return badgeClasses[category] || 'badge-life';
            }
            
            // Format date
            function formatDate(dateString) {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                });
            }
            
            // Render articles
            function renderArticles() {
                // Filter articles by category
                let filteredArticles = articles.filter(article => {
                    if (currentCategory === 'all') return true;
                    return article.category === currentCategory;
                });
                
                // Sort articles
                filteredArticles.sort((a, b) => {
                    switch(currentSort) {
                        case 'newest':
                            return new Date(b.date) - new Date(a.date);
                        case 'oldest':
                            return new Date(a.date) - new Date(b.date);
                        case 'popular':
                            return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
                        case 'title':
                            return a.title.localeCompare(b.title);
                        default:
                            return 0;
                    }
                });
                
                // Calculate pagination
                const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
                const startIndex = (currentPage - 1) * articlesPerPage;
                const endIndex = startIndex + articlesPerPage;
                const pageArticles = filteredArticles.slice(startIndex, endIndex);
                
                // Clear grid
                articlesGrid.innerHTML = '';
                
                // Render articles
                pageArticles.forEach(article => {
                    const articleCard = document.createElement('div');
                    articleCard.className = 'archive-article-card';
                    
                    articleCard.innerHTML = `
                        <div class="article-card-header">
                            <span class="article-category-badge ${getCategoryBadgeClass(article.category)}">
                                ${article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                            </span>
                            <h3 class="article-card-title">${article.title}</h3>
                            <p class="article-card-excerpt">${article.excerpt}</p>
                        </div>
                        <div class="article-card-footer">
                            <div class="article-meta">
                                <span class="article-date">${formatDate(article.date)}</span>
                                <span class="article-read-time">${article.readTime} read</span>
                            </div>
                            <a href="${article.url}" class="read-btn">
                                Read Article
                                <svg class="read-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                                </svg>
                            </a>
                        </div>
                    `;
                    
                    articlesGrid.appendChild(articleCard);
                });
                
                // Update pagination
                updatePagination(totalPages);
            }
            
            // Update pagination controls
            function updatePagination(totalPages) {
                pageNumbers.innerHTML = '';
                
                // Always show first page
                const firstPageBtn = document.createElement('button');
                firstPageBtn.className = `page-number ${currentPage === 1 ? 'active' : ''}`;
                firstPageBtn.textContent = '1';
                firstPageBtn.addEventListener('click', () => {
                    currentPage = 1;
                    renderArticles();
                });
                pageNumbers.appendChild(firstPageBtn);
                
                // Show ellipsis if needed
                if (currentPage > 3) {
                    const ellipsis = document.createElement('span');
                    ellipsis.className = 'page-number';
                    ellipsis.textContent = '...';
                    ellipsis.style.cursor = 'default';
                    pageNumbers.appendChild(ellipsis);
                }
                
                // Show current page and neighbors
                for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                    if (i === 1 || i === totalPages) continue;
                    
                    const pageBtn = document.createElement('button');
                    pageBtn.className = `page-number ${currentPage === i ? 'active' : ''}`;
                    pageBtn.textContent = i;
                    pageBtn.addEventListener('click', () => {
                        currentPage = i;
                        renderArticles();
                    });
                    pageNumbers.appendChild(pageBtn);
                }
                
                // Show ellipsis if needed
                if (currentPage < totalPages - 2) {
                    const ellipsis = document.createElement('span');
                    ellipsis.className = 'page-number';
                    ellipsis.textContent = '...';
                    ellipsis.style.cursor = 'default';
                    pageNumbers.appendChild(ellipsis);
                }
                
                // Always show last page if there is one
                if (totalPages > 1) {
                    const lastPageBtn = document.createElement('button');
                    lastPageBtn.className = `page-number ${currentPage === totalPages ? 'active' : ''}`;
                    lastPageBtn.textContent = totalPages;
                    lastPageBtn.addEventListener('click', () => {
                        currentPage = totalPages;
                        renderArticles();
                    });
                    pageNumbers.appendChild(lastPageBtn);
                }
                
                // Update button states
                prevBtn.disabled = currentPage === 1;
                nextBtn.disabled = currentPage === totalPages;
                
                prevBtn.style.opacity = currentPage === 1 ? '0.5' : '1';
                nextBtn.style.opacity = currentPage === totalPages ? '0.5' : '1';
            }
            
            // Event listeners for filters
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Update active filter
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Update category and reset page
                    currentCategory = btn.dataset.category;
                    currentPage = 1;
                    
                    // Re-render articles
                    renderArticles();
                });
            });
            
            // Event listener for sort
            sortSelect.addEventListener('change', () => {
                currentSort = sortSelect.value;
                currentPage = 1;
                renderArticles();
            });
            
            // Event listeners for pagination buttons
            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderArticles();
                }
            });
            
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(
                    articles.filter(a => currentCategory === 'all' || a.category === currentCategory).length / articlesPerPage
                );
                if (currentPage < totalPages) {
                    currentPage++;
                    renderArticles();
                }
            });
            
            // Initial render
            renderArticles();
        }
