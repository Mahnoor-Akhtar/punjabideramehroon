// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Global variables
let scene, camera, renderer, particles;
let currentSlide = 0;
const totalSlides = 3;

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
        
        // Initialize animations after loading
        initAnimations();
        init3DBackground();
    }, 2000);
});

// Initialize GSAP Animations
function initAnimations() {
    // Hero section animations
    gsap.from('.hero-text > *', {
        duration: 1.2,
        y: 100,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.5
    });

    gsap.from('.hero-image-container', {
        duration: 1.5,
        scale: 0.8,
        opacity: 0,
        rotation: -10,
        ease: 'power3.out',
        delay: 0.8
    });

    // Scroll-triggered animations
    gsap.utils.toArray('.category-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            duration: 1,
            y: 100,
            opacity: 0,
            rotation: 5,
            delay: i * 0.2,
            ease: 'power3.out'
        });
    });

    gsap.utils.toArray('.dish-card-3d').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            duration: 1.2,
            y: 150,
            opacity: 0,
            rotationY: -30,
            delay: i * 0.3,
            ease: 'power3.out'
        });
    });

    // Parallax effect for chef story
    gsap.to('.parallax-bg img', {
        scrollTrigger: {
            trigger: '.chef-story',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        },
        y: '-20%',
        ease: 'none'
    });

    // Gallery items animation
    gsap.utils.toArray('.gallery-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            duration: 1,
            scale: 0.8,
            opacity: 0,
            delay: i * 0.2,
            ease: 'power3.out'
        });
    });
}

// 3D Background with Three.js
function init3DBackground() {
    const canvas = document.getElementById('bg-canvas');
    
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Create floating particles
    const geometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;
        
        // Muted Gold particles (#C9A24A)
        colors[i] = 0.79; // R
        colors[i + 1] = 0.64; // G
        colors[i + 2] = 0.29; // B
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    camera.position.z = 5;
    
    animate3D();
}

function animate3D() {
    requestAnimationFrame(animate3D);
    
    if (particles) {
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.002;
    }
    
    renderer.render(scene, camera);
}

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: target,
                ease: 'power3.inOut'
            });
        }
    });
});

// Active navigation link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
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

// Enhanced Category Card Interactions
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        gsap.to(this, {
            duration: 0.5,
            y: -30,
            rotationX: 15,
            rotationY: 5,
            scale: 1.05,
            ease: 'power3.out'
        });
        
        gsap.to(this.querySelector('img'), {
            duration: 0.5,
            scale: 1.2,
            ease: 'power3.out'
        });
    });
    
    card.addEventListener('mouseleave', function() {
        gsap.to(this, {
            duration: 0.5,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: 'power3.out'
        });
        
        gsap.to(this.querySelector('img'), {
            duration: 0.5,
            scale: 1,
            ease: 'power3.out'
        });
    });
});

// Enhanced Dish Card Interactions
document.querySelectorAll('.dish-card-3d').forEach(card => {
    card.addEventListener('mouseenter', function() {
        gsap.to(this, {
            duration: 0.6,
            y: -25,
            rotationX: 10,
            scale: 1.02,
            ease: 'power3.out'
        });
        
        gsap.to(this.querySelector('.dish-glow'), {
            duration: 0.6,
            opacity: 0.4,
            ease: 'power3.out'
        });
    });
    
    card.addEventListener('mouseleave', function() {
        gsap.to(this, {
            duration: 0.6,
            y: 0,
            rotationX: 0,
            scale: 1,
            ease: 'power3.out'
        });
        
        gsap.to(this.querySelector('.dish-glow'), {
            duration: 0.6,
            opacity: 0,
            ease: 'power3.out'
        });
    });
});

// 3D Testimonial Carousel
function changeSlide(direction) {
    const slides = document.querySelectorAll('.testimonial-slide');
    
    // Hide current slide
    gsap.to(slides[currentSlide], {
        duration: 0.5,
        opacity: 0,
        rotationY: direction > 0 ? 90 : -90,
        ease: 'power3.in',
        onComplete: () => {
            slides[currentSlide].classList.remove('active');
        }
    });
    
    // Update current slide index
    currentSlide += direction;
    if (currentSlide >= totalSlides) currentSlide = 0;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    
    // Show new slide
    setTimeout(() => {
        slides[currentSlide].classList.add('active');
        gsap.fromTo(slides[currentSlide], 
            {
                opacity: 0,
                rotationY: direction > 0 ? -90 : 90
            },
            {
                duration: 0.5,
                opacity: 1,
                rotationY: 0,
                ease: 'power3.out'
            }
        );
    }, 250);
}

// Auto-advance testimonials
setInterval(() => {
    changeSlide(1);
}, 6000);

// Enhanced Button Interactions
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        gsap.to(this, {
            duration: 0.3,
            scale: 1.05,
            ease: 'power3.out'
        });
    });
    
    button.addEventListener('mouseleave', function() {
        gsap.to(this, {
            duration: 0.3,
            scale: 1,
            ease: 'power3.out'
        });
    });
    
    button.addEventListener('click', function(e) {
        // Ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Form Validation and Animation
const reservationForm = document.querySelector('.reservation-form');
if (reservationForm) {
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const inputs = this.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                gsap.to(input, {
                    duration: 0.3,
                    x: 10,
                    yoyo: true,
                    repeat: 3,
                    ease: 'power3.out'
                });
                input.style.borderColor = '#ff4444';
                isValid = false;
            } else {
                input.style.borderColor = 'rgba(57, 211, 83, 0.35)';
            }
        });
        
        if (isValid) {
            const submitBtn = this.querySelector('.form-submit');
            const originalText = submitBtn.textContent;
            
            gsap.to(submitBtn, {
                duration: 0.3,
                scale: 0.95,
                ease: 'power3.out'
            });
            
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = 'Reservation Confirmed!';
                submitBtn.style.background = 'linear-gradient(45deg, #4caf50, #45a049)';
                
                gsap.to(submitBtn, {
                    duration: 0.3,
                    scale: 1,
                    ease: 'power3.out'
                });
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    this.reset();
                    
                    // Success animation
                    gsap.from('.reservation-form-container', {
                        duration: 0.5,
                        scale: 1.05,
                        ease: 'power3.out'
                    });
                }, 3000);
            }, 2000);
        }
    });
}

// Newsletter Subscription
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const input = this.querySelector('input[type="email"]');
        const button = this.querySelector('button');
        
        if (input.value.trim() && input.value.includes('@')) {
            const originalText = button.textContent;
            button.textContent = 'Subscribed!';
            button.style.background = '#4caf50';
            
            gsap.to(button, {
                duration: 0.3,
                scale: 1.1,
                yoyo: true,
                repeat: 1,
                ease: 'power3.out'
            });
            
            input.value = '';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        } else {
            gsap.to(input, {
                duration: 0.3,
                x: 10,
                yoyo: true,
                repeat: 3,
                ease: 'power3.out'
            });
        }
    });
}

// Scroll-based Header Animation
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        header.style.background = 'rgba(26, 26, 26, 0.98)';
        header.style.backdropFilter = 'blur(30px)';
    } else {
        header.style.background = 'rgba(26, 26, 26, 0.95)';
        header.style.backdropFilter = 'blur(20px)';
    }
    
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
        gsap.to(header, {
            duration: 0.3,
            y: -100,
            ease: 'power3.out'
        });
    } else {
        gsap.to(header, {
            duration: 0.3,
            y: 0,
            ease: 'power3.out'
        });
    }
    
    lastScrollY = currentScrollY;
});

// Resize handler for 3D background
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Intersection Observer for enhanced animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.gallery-item, .contact-item').forEach(el => {
    observer.observe(el);
});

// Add CSS for ripple effect and animations
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    button {
        position: relative;
        overflow: hidden;
    }
    
    .animate-in {
        animation: slideInUp 0.8s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Performance optimization
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
    gsap.globalTimeline.timeScale(0.5);
}

