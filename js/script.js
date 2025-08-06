// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Smooth Scrolling for Anchor Links
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

    // Navbar Background on Scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'var(--primary-white)';
            navbar.style.backdropFilter = 'none';
        }
    });

    // Animate Progress Bars
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress');
                if (progressBar) {
                    const width = progressBar.style.width;
                    progressBar.style.width = '0%';
                    setTimeout(() => {
                        progressBar.style.width = width;
                    }, 200);
                }
            }
        });
    }, observerOptions);

    // Observe progress containers
    const progressContainers = document.querySelectorAll('.progress-bar');
    progressContainers.forEach(container => {
        observer.observe(container);
    });

    // Animate Cards on Scroll
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe cards for animation
    const cards = document.querySelectorAll('.offering-card, .workshop-card, .category-card, .benefit-card, .value-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        cardObserver.observe(card);
    });

    // Counter Animation
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        updateCounter();
    }

    // Animate counters when they come into view
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    // Observe stat numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        counterObserver.observe(stat);
    });

    // Form Handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const inputs = this.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ef4444';
                    input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                } else {
                    input.style.borderColor = '#e2e8f0';
                    input.style.boxShadow = 'none';
                }
            });
            
            if (isValid) {
                showNotification('Form submitted successfully! We\'ll get back to you soon.', 'success');
                this.reset();
            } else {
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    });

    // Category Filter (if on courses page)
    const categoryCards = document.querySelectorAll('.category-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(button => button.classList.remove('active'));
                this.classList.add('active');
                
                // Filter cards
                categoryCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Testimonial Slider (if on testimonials page)
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        let currentSlide = 0;
        const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
        const totalSlides = slides.length;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        }

        // Auto-advance slides
        setInterval(nextSlide, 5000);

        // Navigation buttons
        const nextBtn = document.querySelector('.slider-next');
        const prevBtn = document.querySelector('.slider-prev');
        
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Initialize
        showSlide(0);
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0';
                    }
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });

    // Gallery Filter and Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryFilters = document.querySelectorAll('.gallery-filter');
    
    if (galleryFilters.length > 0) {
        galleryFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Update active filter
                galleryFilters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 100);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Lightbox for gallery
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img')?.src;
            if (imgSrc) {
                createLightbox(imgSrc);
            }
        });
    });
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-green)' : type === 'error' ? '#ef4444' : 'var(--primary-indigo)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: var(--shadow-medium);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-family: 'Poppins', sans-serif;
    `;

    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 1rem;
    `;

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        margin-left: auto;
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button functionality
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
}

// Lightbox functionality
function createLightbox(imageSrc) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${imageSrc}" alt="Gallery Image">
            <button class="lightbox-close">&times;</button>
        </div>
    `;

    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    const content = lightbox.querySelector('.lightbox-content');
    content.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
    `;

    const img = lightbox.querySelector('img');
    img.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        border-radius: 10px;
    `;

    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;

    document.body.appendChild(lightbox);

    // Animate in
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 10);

    // Close functionality
    function closeLightbox() {
        lightbox.style.opacity = '0';
        setTimeout(() => lightbox.remove(), 300);
    }

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

// Loading Animation
function showLoading() {
    const loading = document.createElement('div');
    loading.id = 'loading';
    loading.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    
    loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: 'Poppins', sans-serif;
    `;

    const spinner = loading.querySelector('.spinner');
    spinner.style.cssText = `
        width: 40px;
        height: 40px;
        border: 4px solid var(--light-gray);
        border-top: 4px solid var(--primary-indigo);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    `;

    // Add keyframes for spinner animation
    if (!document.querySelector('#spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'spinner-styles';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.remove();
    }
}

// Utility function to simulate API calls
function simulateRequest(callback, delay = 2000) {
    showLoading();
    setTimeout(() => {
        hideLoading();
        callback();
    }, delay);
}// E
nhanced Testimonial Slider functionality
document.addEventListener('DOMContentLoaded', function() {
    // Testimonial Slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        let currentSlide = 0;
        const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
        const dots = testimonialSlider.querySelectorAll('.dot');
        const totalSlides = slides.length;
        let slideInterval;

        function showSlide(index) {
            // Hide all slides
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (dots[i]) {
                    dots[i].classList.remove('active');
                }
            });
            
            // Show current slide
            if (slides[index]) {
                slides[index].classList.add('active');
            }
            if (dots[index]) {
                dots[index].classList.add('active');
            }
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        }

        function startAutoSlide() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoSlide() {
            clearInterval(slideInterval);
        }

        // Navigation buttons
        const nextBtn = testimonialSlider.querySelector('.slider-next');
        const prevBtn = testimonialSlider.querySelector('.slider-prev');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopAutoSlide();
                nextSlide();
                startAutoSlide();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopAutoSlide();
                prevSlide();
                startAutoSlide();
            });
        }

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoSlide();
                currentSlide = index;
                showSlide(currentSlide);
                startAutoSlide();
            });
        });

        // Pause on hover
        testimonialSlider.addEventListener('mouseenter', stopAutoSlide);
        testimonialSlider.addEventListener('mouseleave', startAutoSlide);

        // Initialize
        showSlide(0);
        startAutoSlide();
    }

    // Video testimonial play buttons
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        const playButton = card.querySelector('.play-button');
        if (playButton) {
            playButton.addEventListener('click', function() {
                // Simulate video play (you can integrate with actual video player)
                showNotification('Video player would open here. Integration with YouTube/Vimeo can be added.', 'info');
            });
        }
    });

    // Animate testimonial cards on scroll with stagger effect
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    testimonialCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
        testimonialObserver.observe(card);
    });

    // Animate achievement cards
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(card);
    });

    // Company testimonial hover effects
    const companyTestimonials = document.querySelectorAll('.company-testimonial');
    companyTestimonials.forEach(testimonial => {
        testimonial.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        testimonial.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Enhanced counter animation for stats
    function animateCounterEnhanced(element, target, duration = 2000, suffix = '') {
        let start = 0;
        const increment = target / (duration / 16);
        const isPercentage = suffix === '%';
        const hasPlus = element.textContent.includes('+');
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                let displayValue = Math.floor(start);
                if (isPercentage) {
                    element.textContent = displayValue + '%';
                } else if (hasPlus) {
                    element.textContent = displayValue + '+';
                } else {
                    element.textContent = displayValue + suffix;
                }
                requestAnimationFrame(updateCounter);
            } else {
                if (isPercentage) {
                    element.textContent = target + '%';
                } else if (hasPlus) {
                    element.textContent = target + '+';
                } else {
                    element.textContent = target + suffix;
                }
            }
        }
        updateCounter();
    }

    // Animate stat numbers with enhanced effects
    const statNumbers = document.querySelectorAll('.stat-number');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const text = statNumber.textContent;
                let target, suffix = '';
                
                if (text.includes('%')) {
                    target = parseInt(text.replace('%', ''));
                    suffix = '%';
                } else if (text.includes('+')) {
                    target = parseInt(text.replace('+', ''));
                    suffix = '+';
                } else if (text.includes('/')) {
                    // Handle ratings like 4.9/5
                    const parts = text.split('/');
                    target = parseFloat(parts[0]);
                    suffix = '/' + parts[1];
                } else {
                    target = parseInt(text.replace(/[^\d]/g, ''));
                }
                
                animateCounterEnhanced(statNumber, target, 2000, suffix);
                statObserver.unobserve(statNumber);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statObserver.observe(stat);
    });

    // Add loading states for testimonial images
    const testimonialImages = document.querySelectorAll('.student-avatar img');
    testimonialImages.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const fallback = this.nextElementSibling;
            if (fallback && fallback.classList.contains('avatar-fallback')) {
                fallback.style.display = 'flex';
            }
        });
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity for smooth loading
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });

    // Testimonial card interaction effects
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'var(--shadow-light)';
        });
    });

    // Add ripple effect to CTA buttons
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(button => {
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
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple animation keyframes
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
});// FAQ C
ategory Switching
document.addEventListener('DOMContentLoaded', function() {
    // FAQ Category buttons
    const faqCategoryBtns = document.querySelectorAll('.faq-category-btn');
    const faqCategories = document.querySelectorAll('.faq-category');
    
    faqCategoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetCategory = this.getAttribute('data-category');
            
            // Remove active class from all buttons and categories
            faqCategoryBtns.forEach(button => button.classList.remove('active'));
            faqCategories.forEach(category => category.classList.remove('active'));
            
            // Add active class to clicked button and corresponding category
            this.classList.add('active');
            const targetCategoryElement = document.getElementById(targetCategory);
            if (targetCategoryElement) {
                targetCategoryElement.classList.add('active');
            }
        });
    });

    // Enhanced FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items in the same category
                const currentCategory = item.closest('.faq-category');
                const categoryItems = currentCategory.querySelectorAll('.faq-item');
                categoryItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0';
                        }
                    }
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0';
                }
            });
        }
    });

    // Contact form validation and submission
    const contactForms = document.querySelectorAll('.contact-form, form');
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const inputs = this.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true;
            let firstInvalidField = null;
            
            // Validate each field
            inputs.forEach(input => {
                const value = input.value.trim();
                
                if (!value) {
                    isValid = false;
                    input.style.borderColor = '#ef4444';
                    input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                    
                    if (!firstInvalidField) {
                        firstInvalidField = input;
                    }
                } else {
                    // Additional validation for email
                    if (input.type === 'email') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(value)) {
                            isValid = false;
                            input.style.borderColor = '#ef4444';
                            input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                            
                            if (!firstInvalidField) {
                                firstInvalidField = input;
                            }
                        } else {
                            input.style.borderColor = '#10b981';
                            input.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                        }
                    } else {
                        input.style.borderColor = '#10b981';
                        input.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                    }
                }
            });
            
            if (isValid) {
                // Show success message
                showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
                
                // Reset form
                this.reset();
                
                // Reset field styles
                inputs.forEach(input => {
                    input.style.borderColor = '';
                    input.style.boxShadow = '';
                });
                
                // Simulate form submission (replace with actual API call)
                simulateRequest(() => {
                    console.log('Form submitted successfully');
                }, 1000);
                
            } else {
                showNotification('Please fill in all required fields correctly.', 'error');
                
                // Focus on first invalid field
                if (firstInvalidField) {
                    firstInvalidField.focus();
                    firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });

    // Real-time validation for form fields
    const formFields = document.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            const value = this.value.trim();
            
            if (this.hasAttribute('required') && !value) {
                this.style.borderColor = '#ef4444';
                this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            } else if (this.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    this.style.borderColor = '#ef4444';
                    this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                } else {
                    this.style.borderColor = '#10b981';
                    this.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }
            } else if (value) {
                this.style.borderColor = '#10b981';
                this.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            } else {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }
        });

        field.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary-indigo)';
            this.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
        });
    });

    // Contact method hover effects
    const contactMethods = document.querySelectorAll('.contact-method');
    contactMethods.forEach(method => {
        method.addEventListener('click', function() {
            const link = this.querySelector('a');
            if (link) {
                window.open(link.href, '_blank');
            }
        });
    });

    // Animate contact cards on scroll
    const contactCards = document.querySelectorAll('.contact-info-card, .contact-form-card');
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    contactCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        contactObserver.observe(card);
    });
});