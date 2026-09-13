document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 500);
    }

    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('main-nav');
    const navOverlay = document.getElementById('nav-overlay');

    if (hamburger && mainNav) {
        const toggleNav = () => {
            hamburger.classList.toggle('open');
            mainNav.classList.toggle('open');
            if (navOverlay) {
                navOverlay.style.display = mainNav.classList.contains('open') ? 'block' : 'none';
            }
            document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
        };

        hamburger.addEventListener('click', toggleNav);

        if (navOverlay) {
            navOverlay.addEventListener('click', toggleNav);
        }

        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('open')) {
                    toggleNav();
                }
            });
        });
    }

    const counters = document.querySelectorAll('.stat-num');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.floor(current);
                setTimeout(updateCounter, 16);
            } else {
                counter.innerText = target;
            }
        };
        updateCounter();
    });

    // Enhanced smooth scrolling that accounts for the fixed header height
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                // Calculate the header offset (80px for mobile/desktop)
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

    // Load testimonials dynamically
    loadTestimonials();
});

async function loadTestimonials() {
    const container = document.getElementById('testimonial-carousel');
    const dotsContainer = document.getElementById('carousel-dots');
    if (!container) return;

    let testimonials = [];
    try {
        // Uncomment this line when backend is running:
        // testimonials = await API.getTestimonials();
    } catch (e) {
        console.warn('API unavailable, using sample testimonials');
    }

    if (!testimonials || testimonials.length === 0) {
        // Fallback sample data (replace with your own content)
        testimonials = [
            { name: "Dr. Adebayo Ogunlesi", role: "Principal, ABC High School", text: "Destiny built a complete school portal that transformed our operations. Highly recommended!", stars: 5 },
            { name: "Uyiekpen Martins", role: "CEO, TaskNow", text: "Professional, fast, and delivered exactly what we needed. Great communication throughout.", stars: 5 },
            { name: "Mike Ike", role: "Forex Trader", text: "The mentorship program gave me the discipline and knowledge to trade profitably.", stars: 4 }
        ];
    }

    container.innerHTML = testimonials.map(t => `
        <div class="testimonial-card">
            <div class="stars">${'<i class="fas fa-star"></i>'.repeat(t.stars)}</div>
            <p>"${t.text}"</p>
            <h4>${t.name}</h4>
            <span>${t.role}</span>
        </div>
    `).join('');

    // Initialize carousel dots
    if (dotsContainer) {
        const cards = container.querySelectorAll('.testimonial-card');
        dotsContainer.innerHTML = '';
        cards.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                container.scrollLeft = i * container.clientWidth;
                updateDots();
            });
            dotsContainer.appendChild(dot);
        });

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.dot');
            const scrollPos = container.scrollLeft;
            const cardWidth = cards[0]?.offsetWidth || 350;
            const activeIndex = Math.round(scrollPos / cardWidth);
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIndex);
            });
        };

        container.addEventListener('scroll', updateDots);
        updateDots();
    }
}

function closeAdminModal() {
    const modal = document.getElementById('admin-login-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}