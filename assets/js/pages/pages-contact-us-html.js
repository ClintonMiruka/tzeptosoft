document.addEventListener('DOMContentLoaded', () => {
      // Matrix Animation
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

      // Particles Animation
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

      // Cursor Trail
      const cursorTrail = document.getElementById('cursor-trail');
      if (cursorTrail) {
        document.addEventListener('mousemove', (e) => {
          cursorTrail.style.left = e.clientX - 15 + 'px';
          cursorTrail.style.top = e.clientY - 15 + 'px';
        });
      }

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

      // Tab Functionality
      const tabs = document.querySelectorAll('.comms-tab');
      const contents = document.querySelectorAll('.comms-content');
      
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          // Remove active class from all tabs and contents
          tabs.forEach(t => t.classList.remove('active'));
          contents.forEach(c => c.classList.remove('active'));
          
          // Add active class to clicked tab
          tab.classList.add('active');
          
          // Show corresponding content
          const tabId = tab.getAttribute('data-tab');
          const content = document.getElementById(tabId);
          if (content) content.classList.add('active');
        });
      });

      // Copy Email Functionality - Enhanced for primary contact hub
      const emailHandle = document.getElementById('emailHandle');
      const emailCard = document.getElementById('emailCard');
      const copyEmailButton = document.getElementById('copyEmailButton');
      const emailAddressDisplay = document.getElementById('emailAddressDisplay');
      const copyEmail = document.getElementById('copyEmail');
      
      function copyEmailToClipboard() {
        const email = 'tzeptosoft@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
          // Visual feedback on button
          if (copyEmailButton) {
            const originalText = copyEmailButton.innerHTML;
            copyEmailButton.innerHTML = '<span>✅</span><span>EMAIL COPIED!</span>';
            copyEmailButton.style.background = 'rgba(0, 204, 102, 0.3)';
            copyEmailButton.style.borderColor = 'var(--success)';
            
            setTimeout(() => {
              copyEmailButton.innerHTML = originalText;
              copyEmailButton.style.background = '';
              copyEmailButton.style.borderColor = '';
            }, 2000);
          }
          
          // Visual feedback on email handles
          const emailElements = [emailHandle, emailAddressDisplay, copyEmail];
          emailElements.forEach(el => {
            if (el) {
              const originalText = el.textContent;
              const originalColor = el.style.color;
              const originalBg = el.style.background;
              
              el.textContent = '✓ EMAIL COPIED TO CLIPBOARD';
              el.style.color = 'var(--matrix-green)';
              el.style.background = 'rgba(0, 255, 0, 0.1)';
              
              setTimeout(() => {
                el.textContent = originalText;
                el.style.color = originalColor;
                el.style.background = originalBg;
              }, 2000);
            }
          });
          
          // Visual feedback on card
          if (emailCard) {
            emailCard.style.borderColor = 'var(--success)';
            emailCard.style.boxShadow = '0 0 30px rgba(0, 204, 102, 0.3)';
            
            setTimeout(() => {
              emailCard.style.borderColor = '';
              emailCard.style.boxShadow = '';
            }, 1000);
          }
        }).catch(err => {
          console.error('Encryption protocol failed: ', err);
        });
      }
      
      // Set up click handlers for all email elements
      if (emailHandle) {
        emailHandle.addEventListener('click', copyEmailToClipboard);
        emailHandle.title = 'Click to copy email to clipboard';
      }
      
      if (emailCard) {
        emailCard.addEventListener('click', copyEmailToClipboard);
      }
      
      if (copyEmailButton) {
        copyEmailButton.addEventListener('click', copyEmailToClipboard);
      }
      
      if (emailAddressDisplay) {
        emailAddressDisplay.addEventListener('click', copyEmailToClipboard);
        emailAddressDisplay.title = 'Click to copy email to clipboard';
      }
      
      if (copyEmail) {
        copyEmail.addEventListener('click', copyEmailToClipboard);
        copyEmail.title = 'Click to copy email to clipboard';
      }

      // Contact Card Effects
      const contactCards = document.querySelectorAll('.contact-card');
      contactCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          const icon = card.querySelector('.card-icon-large');
          if (icon) {
            const originalText = icon.textContent;
            const glitchText = originalText.split('').map(char => 
              Math.random() > 0.9 ? String.fromCharCode(33 + Math.random() * 94) : char
            ).join('');
            
            icon.textContent = glitchText;
            
            setTimeout(() => {
              icon.textContent = originalText;
            }, 100);
          }
        });
      });

      // Network Item Click Effects
      const networkItems = document.querySelectorAll('.network-item');
      networkItems.forEach(item => {
        item.addEventListener('click', (e) => {
          // Add click effect
          item.style.transform = 'scale(0.98)';
          setTimeout(() => {
            item.style.transform = '';
          }, 150);
        });
      });

      // Resource Card Effects
      const resourceCards = document.querySelectorAll('.resource-card');
      resourceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          const links = card.querySelectorAll('.resource-link');
          links.forEach(link => {
            const originalColor = link.style.color;
            link.style.color = 'var(--matrix-green)';
            setTimeout(() => {
              link.style.color = originalColor;
            }, 300);
          });
        });
      });

      // Strategic Console Message
      console.log(`
%cTZEPTOSOFT COMMAND CENTER
%c⚔️ Strategic Communications Protocol: ACTIVE
%cPrimary Contact Hub: Loaded | Encryption: Level 7 | Channels: Verified
%c
%cIMPORTANT: All communications are logged and analyzed for tactical improvement.
%cThis is not a customer service portal. This is a war room.
%c
%cPrimary Contact Channels:
%c1. Email: tzeptosoft@gmail.com (Encrypted Priority)
%c2. GitHub: ClintonMiruka/tzeptosoft (Source Code)
%c3. Telegram: @tzeptosoftadmin (Real-time Briefings)
%c4. YouTube: @TZEPTOSOFT (Visual Intelligence)
%c
%cChoose your path wisely.
      `, 
      'color: #00CCFF; font-family: monospace; font-size: 16px; font-weight: bold;',
      'color: #00FF00; font-family: monospace;',
      'color: #FFFFFF; font-family: monospace; font-size: 12px;',
      'color: #666666; font-family: monospace;',
      'color: #FFAA00; font-family: monospace;',
      'color: #FFAA00; font-family: monospace;',
      'color: #666666; font-family: monospace;',
      'color: #00FF00; font-family: monospace;',
      'color: #00CCFF; font-family: monospace;',
      'color: #9900FF; font-family: monospace;',
      'color: #FF4444; font-family: monospace;'
      );

      // Auto-populate email template on resource link clicks
      const resourceLinks = document.querySelectorAll('.resource-link');
      resourceLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          // Track which resources warriors are accessing
          console.log(`Warrior accessed: ${link.textContent} - ${link.href}`);
        });
      });

      // Strategic timer for page engagement
      let pageEngagementTime = 0;
      const engagementTimer = setInterval(() => {
        pageEngagementTime += 5;
        if (pageEngagementTime === 30) {
          console.log('%c⚠️ 30 seconds studying protocols. Good discipline.', 'color: #00FF00; font-family: monospace;');
        }
        if (pageEngagementTime === 60) {
          console.log('%c✅ 1 minute protocol study. You\'re taking this seriously.', 'color: #00FF00; font-family: monospace;');
        }
        if (pageEngagementTime === 120) {
          console.log('%c🎯 2 minutes. You\'re either preparing or procrastinating. Choose action.', 'color: #FFAA00; font-family: monospace;');
          clearInterval(engagementTimer);
        }
      }, 5000);

      // Clean up on page unload
      window.addEventListener('beforeunload', () => {
        clearInterval(engagementTimer);
      });

      // Email card pulse animation for attention
      setTimeout(() => {
        if (emailCard) {
          emailCard.style.animation = 'pulse 2s ease-in-out';
          setTimeout(() => {
            emailCard.style.animation = '';
          }, 2000);
        }
      }, 1000);
    });

    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 204, 255, 0.4); }
        70% { box-shadow: 0 0 0 20px rgba(0, 204, 255, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 204, 255, 0); }
      }
    `;
    document.head.appendChild(style);
