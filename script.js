// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // CTA Button interaction
    const ctaButton = document.getElementById('cta-button');
    
    ctaButton.addEventListener('click', function() {
        // Animate button click
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
        
        // Show alert for demo purposes
        showNotification('Welcome to INFO-6150! Ready to start learning web design?');
        
        // Scroll to about section
        setTimeout(() => {
            document.getElementById('about').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 1000);
    });

    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        
        if (window.scrollY > 100) {
            header.style.background = 'rgba(102, 126, 234, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            header.style.backdropFilter = 'none';
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards and project cards
    const animatedElements = document.querySelectorAll('.feature, .project-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Form interaction demonstration
    addFormInteractivity();
});

// Utility function to show notifications
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: '#4CAF50',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '5px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add form interactivity for learning purposes
function addFormInteractivity() {
    // Create a simple contact form dynamically
    const contactSection = document.getElementById('contact');
    
    if (contactSection) {
        const form = document.createElement('div');
        form.innerHTML = `
            <div style="max-width: 500px; margin: 20px auto; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                <h3 style="text-align: center; margin-bottom: 20px; color: #333;">Quick Contact Demo</h3>
                <form id="demo-form">
                    <div style="margin-bottom: 15px;">
                        <input type="text" id="name" placeholder="Your Name" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" required>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <input type="email" id="email" placeholder="Your Email" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" required>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <textarea id="message" placeholder="Your Message" rows="4" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; resize: vertical;" required></textarea>
                    </div>
                    <button type="submit" style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Send Message</button>
                </form>
            </div>
        `;
        
        contactSection.insertBefore(form, contactSection.firstChild);
        
        // Add form submission handler
        document.getElementById('demo-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            showNotification(`Thank you ${name}! This is a demo form. In a real application, your message would be sent.`);
            
            // Reset form
            this.reset();
        });
    }
}

// Add some interactive elements for demonstration
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'white';
        });
    });
    
    // Add click interaction to feature cards
    const featureCards = document.querySelectorAll('.feature');
    
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            showNotification(`You clicked on ${title}! This could link to detailed course materials.`);
        });
        
        // Add cursor pointer
        card.style.cursor = 'pointer';
    });
});