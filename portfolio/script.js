// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 15, 35, 0.98)';
    } else {
        navbar.style.background = 'rgba(15, 15, 35, 0.95)';
    }
});

// Typing animation for hero subtitle
const heroSubtitle = document.querySelector('.hero-subtitle');
const titles = [
    'Creative Developer',
    'UI/UX Designer', 
    'Creative Problem Solver',
    'Tech Enthusiast'
];
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
        heroSubtitle.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
    } else {
        heroSubtitle.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentTitle.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typeSpeed = 500; // Pause before starting new word
    }

    setTimeout(typeEffect, typeSpeed);
}

// Start typing effect after page load
window.addEventListener('load', () => {
    setTimeout(typeEffect, 1000);
});

// Scroll reveal animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
        }
    });
}, observerOptions);

// Observe elements for scroll reveal
document.addEventListener('DOMContentLoaded', () => {
    const elementsToObserve = document.querySelectorAll(
        '.about-content, .skill-category, .project-card, .contact-content'
    );
    
    elementsToObserve.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
});

// Floating elements animation enhancement
const floatingCards = document.querySelectorAll('.floating-card');
floatingCards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.1)';
        card.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.3)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    });
});

// Skills animation on scroll
const skillItems = document.querySelectorAll('.skill-item');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.5 });

skillItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = 'all 0.6s ease';
    skillObserver.observe(item);
});

// Statistics counter animation
const stats = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const finalValue = target.textContent;
            const numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
            const suffix = finalValue.replace(/[\d.]/g, '');
            
            let currentValue = 0;
            const increment = numericValue / 50;
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= numericValue) {
                    target.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    target.textContent = Math.floor(currentValue) + suffix;
                }
            }, 30);
        }
    });
}, { threshold: 0.8 });

stats.forEach(stat => {
    statsObserver.observe(stat);
});

// Project cards hover effect enhancement
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) rotateX(5deg)';
        card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotateX(0deg)';
        card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    });
});

// Contact form handling
const contactForm = document.querySelector('.contact-form form');

if (contactForm) {
    contactForm.addEventListener('submit', () => {
        const name = contactForm.querySelector('input[name="name"]').value;
        const email = contactForm.querySelector('input[name="email"]').value;
        const message = contactForm.querySelector('textarea[name="message"]').value;

        const submitBtn = contactForm.querySelector('.btn-primary');

        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            submitBtn.disabled = false;
            return;
        }

        // Update UI only, don't block form
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
    });
}

// Notification handler (toast-style)
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Optional styling (minimal)
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 18px',
        borderRadius: '8px',
        background: type === 'error' ? '#e74c3c' : '#2ecc71',
        color: '#fff',
        fontSize: '14px',
        zIndex: 9999,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        opacity: 0,
        transition: 'opacity 0.3s ease'
    });

    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = 1;
    }, 100);

    setTimeout(() => {
        notification.style.opacity = 0;
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#06d6a0' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-card');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Smooth page transitions
window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0';
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Remove loading class after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.style.opacity = '1';
        }, 500);
    });
    
    // Add stagger animation to navigation items
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Initialize intersection observer for all animated elements
    const animatedElements = document.querySelectorAll(
        '.hero-content, .about-content, .skills-grid, .projects-grid, .contact-content'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease';
    });
    
    const mainObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        mainObserver.observe(element);
    });
});

// Console message for developers
console.log(`
🚀 Welcome to Ayush Hardeniya's Portfolio!
👨‍💻 Built with passion and lots of chai ☕️
📧 Contact: ayushhardeniya@gmail.com
🔗 LinkedIn: https://linkedin.com/in/ayushhardeniya
`);

// Easter egg - Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        showNotification('🎉 Konami Code activated! You found the easter egg!', 'success');
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);
