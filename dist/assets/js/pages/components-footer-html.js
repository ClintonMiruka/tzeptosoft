// Simple hover effects
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.1)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add click functionality to social links
        document.querySelector('.social-link[aria-label="Twitter"]').addEventListener('click', () => {
            window.open('https://twitter.com/tzeptosoft', '_blank');
        });

        document.querySelector('.social-link[aria-label="LinkedIn"]').addEventListener('click', () => {
            window.open('https://linkedin.com/company/tzeptosoft', '_blank');
        });

        document.querySelector('.social-link[aria-label="Email"]').addEventListener('click', () => {
            window.location.href = 'mailto:tzeptosoft@gmail.com';
        });
