// Load services and products from JSON files
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Load services
    fetch('/data/services.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('services-container');
            if (container) {
                data.forEach(service => {
                    container.innerHTML += `
                        <div class="col-md-6 col-lg-4 fade-in visible">
                            <div class="card service-card h-100 hover-grow">
                                <div class="card-body">
                                    <div class="service-icon">
                                        <i class="${service.icon}"></i>
                                    </div>
                                    <h4 class="mb-3">${service.title}</h4>
                                    <p class="text-muted">${service.description}</p>
                                    <ul class="list-unstyled">
                                        ${service.features.map(feature => `<li class="mb-1">• ${feature}</li>`).join('')}
                                    </ul>
                                    ${service.comingSoon ? '<span class="badge bg-secondary">Coming Soon</span>' : ''}
                                </div>
                            </div>
                        </div>
                    `;
                });
            }
        })
        .catch(error => {
            console.error('Error loading services:', error);
            // Fallback content or error message
            const container = document.getElementById('services-container');
            if (container) {
                container.innerHTML = `
                    <div class="col-12 text-center">
                        <p class="text-danger">Unable to load services at this time. Please try again later.</p>
                    </div>
                `;
            }
        });
    
    // Load products
    fetch('data/products.json')
        .then(response => response.json())
        .then(products => {
            const container = document.getElementById('products-container');
            products.forEach(product => {
                container.innerHTML += `
                    <div class="col-lg-6 fade-in visible">
                        <div class="card product-card h-100 hover-grow">
                            <div class="row g-0">
                                <div class="col-md-5">
                                    <img src="assets/images/${product.image}" class="img-fluid rounded-start h-100" alt="${product.title}">
                                </div>
                                <div class="col-md-7">
                                    <div class="card-body">
                                        <h4 class="card-title">${product.title}</h4>
                                        <h6 class="text-primary mb-3">${product.subtitle}</h6>
                                        <p class="card-text">${product.description}</p>
                                        <ul class="list-unstyled mb-3">
                                            ${product.features.map(feature => `<li class="mb-1">• ${feature}</li>`).join('')}
                                        </ul>
                                        <div class="d-flex align-items-center">
                                            <span class="badge ${product.available ? 'bg-primary' : 'bg-secondary'} me-2">
                                                ${product.available ? 'Available Now' : 'In Development'}
                                            </span>
                                            <a href="products.html#${product.id}" class="text-primary small">Learn More →</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        });
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send the form data to your server
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Animate stats counters
    const animateCounters = () => {
        const counters = document.querySelectorAll('[data-count]');
        const speed = 200;
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText;
            const increment = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounters, 1);
            } else {
                counter.innerText = target;
                counter.classList.add('counting');
            }
        });
    };
    
    // Start counters when stats section is in view
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                observer.unobserve(statsSection);
            }
        });
        
        observer.observe(statsSection);
    }
});






// Counter Animation Function
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
        element.classList.add('counting');
        
        setTimeout(() => {
            element.classList.remove('counting');
        }, 100);
    }, 16);
}

// Intersection Observer for triggering animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stats-number');
            counters.forEach(counter => {
                if (!counter.classList.contains('animated')) {
                    counter.classList.add('animated');
                    animateCounter(counter);
                }
            });
        }
    });
}, observerOptions);

// Start observing when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
});