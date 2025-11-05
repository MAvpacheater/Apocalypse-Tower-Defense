// src/js/main.js - Main JavaScript functionality

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initHeaderScroll();
    initScrollAnimations();
    initMobileMenu();
    initDevNotice();
    animateStats();
    initParallax();
    initRippleEffect();
    initGameplaySlider();
    logInitialization();
});

// ===== DEVELOPMENT NOTICE =====
function initDevNotice() {
    const notice = document.getElementById('devNotice');
    const closeBtn = document.getElementById('closeNotice');
    
    if (!notice || !closeBtn) return;

    const noticeClosed = localStorage.getItem('devNoticeClosed');
    if (noticeClosed === 'true') {
        notice.classList.add('hidden');
    }

    closeBtn.addEventListener('click', () => {
        notice.classList.add('hidden');
        localStorage.setItem('devNoticeClosed', 'true');
    });

    setTimeout(() => {
        if (!notice.classList.contains('hidden')) {
            notice.style.opacity = '0.7';
        }
    }, 10000);
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== HEADER SCROLL EFFECT =====
function initHeaderScroll() {
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    if (!header) return;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.background = 'rgba(10, 14, 26, 0.95)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(10, 14, 26, 0.8)';
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                if (entry.target.classList.contains('feature-card')) {
                    const cards = document.querySelectorAll('.feature-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll(
        '.feature-card, .gameplay-content, .stat-item, .section-header, .team-card'
    );
    
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('mobileNav');
    
    if (!mobileMenuToggle || !nav) return;

    // Toggle menu
    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        nav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking on a link
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu on window resize if going to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 968 && nav.classList.contains('active')) {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== STATS COUNTER ANIMATION =====
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateValue(entry.target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

function animateValue(element) {
    const text = element.textContent;
    const value = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/[\d,]/g, '');
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
            current = value;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, duration / steps);
}

// ===== PARALLAX EFFECT FOR HERO =====
function initParallax() {
    const hero = document.querySelector('.hero-content');
    
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        if (scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// ===== GAMEPLAY SLIDER =====
function initGameplaySlider() {
    const slider = document.querySelector('.gameplay-slider');
    if (!slider) return;

    const images = slider.querySelectorAll('.slider-image');
    const dots = slider.querySelectorAll('.dot');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    
    let currentSlide = 0;
    const totalSlides = images.length;

    function showSlide(index) {
        images.forEach(img => img.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        images[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
    }

    nextBtn?.addEventListener('click', nextSlide);
    prevBtn?.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    // Auto-slide every 5 seconds
    setInterval(nextSlide, 5000);
}

// ===== BUTTON RIPPLE EFFECT =====
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .theme-btn, .lang-btn, .team-contact-btn, .social-link');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                left: ${x}px;
                top: ${y}px;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== PAGE VISIBILITY =====
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = '🧟 Come back to defend!';
    } else {
        document.title = 'Apocalypse Tower Defense | Roblox Game';
    }
});

// ===== LOGGING =====
function logInitialization() {
    console.log('%c🧟 Apocalypse Tower Defense', 'color: #dc2626; font-size: 20px; font-weight: bold;');
    console.log('%cWebsite loaded successfully!', 'color: #22c55e; font-size: 14px;');
    console.log(`%cTheme: ${window.themeManager?.getCurrentTheme() || 'dark'}`, 'color: #9ca3af;');
    console.log(`%cLanguage: ${window.i18n?.getCurrentLanguage() || 'uk'}`, 'color: #9ca3af;');
    console.log('%c🎮 Demo version available!', 'color: #22c55e; font-size: 12px;');
}

// ===== EASTER EGG =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        activateZombieMode();
    }
});

function activateZombieMode() {
    window.themeManager?.setTheme('zombie');
    
    const message = document.createElement('div');
    message.textContent = '🧟 ZOMBIE MODE ACTIVATED! 🧟';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #22c55e, #10b981);
        color: white;
        padding: 2rem 3rem;
        border-radius: 20px;
        font-size: 24px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 20px 60px rgba(34, 197, 94, 0.4);
        animation: zombiePulse 0.5s ease-in-out 3;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = 'translate(-50%, -50%) scale(0)';
        message.style.transition = 'all 0.3s ease';
        setTimeout(() => message.remove(), 300);
    }, 2000);
}

// Add zombie pulse animation
const zombieStyle = document.createElement('style');
zombieStyle.textContent = `
    @keyframes zombiePulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.1); }
    }
`;
document.head.appendChild(zombieStyle);

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`%cPage Load Time: ${(perfData.loadEventEnd - perfData.fetchStart).toFixed(2)}ms`, 'color: #3b82f6;');
        }, 0);
    });
}

// Export functions for external use
window.app = {
    animateStats,
    initParallax,
    initSmoothScroll,
    initDevNotice,
    initGameplaySlider,
    initMobileMenu
};
