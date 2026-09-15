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

            // Set active navigation link based on current page
            function setActiveNavLink() {
                const currentPage = window.location.pathname;
                const navLinks = document.querySelectorAll('.nav-link');
                const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
                
                navLinks.forEach(link => {
                    const linkPage = link.getAttribute('data-page');
                    if (currentPage.includes(linkPage) || 
                        (currentPage === '/' && linkPage === 'home')) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                mobileNavLinks.forEach(link => {
                    const linkPage = link.getAttribute('href');
                    if (currentPage === linkPage || 
                        (currentPage === '/' && linkPage === '/')) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }

            // Initialize active link
            setActiveNavLink();
        });
