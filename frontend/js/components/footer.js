/**
 * TravelVista — Footer Component
 */
const Footer = {
    render(container) {
        container.innerHTML = `
        <footer class="footer">
            <div class="footer-wave">
                <svg viewBox="0 0 1200 100" preserveAspectRatio="none">
                    <path d="M0,50 C200,100 400,0 600,50 C800,100 1000,0 1200,50 L1200,100 L0,100 Z" fill="var(--bg-secondary)" />
                </svg>
            </div>
            <div class="footer-content">
                <div class="container">
                    <div class="footer-grid">
                        <div class="footer-about">
                            <a href="#/" class="footer-logo">${Icons.compass(28)} <span>Travel<span class="logo-accent">Vista</span></span></a>
                            <p class="footer-desc">Your trusted partner for unforgettable travel experiences across India. We curate the finest tour packages to make your journey smooth and memorable.</p>
                            <div class="footer-social">
                                <a href="#" class="social-link" aria-label="Facebook">${Icons.facebook(18)}</a>
                                <a href="#" class="social-link" aria-label="Instagram">${Icons.instagram(18)}</a>
                                <a href="#" class="social-link" aria-label="Twitter">${Icons.twitter(18)}</a>
                                <a href="#" class="social-link" aria-label="Youtube">${Icons.youtube(18)}</a>
                            </div>
                        </div>
                        <div class="footer-links-col">
                            <h4 class="footer-heading">Quick Links</h4>
                            <a href="#/" class="footer-link">Home</a>
                            <a href="#/packages" class="footer-link">Tour Packages</a>
                            <a href="#/about" class="footer-link">About Us</a>
                            <a href="#/contact" class="footer-link">Contact</a>
                        </div>
                        <div class="footer-links-col">
                            <h4 class="footer-heading">Tour Types</h4>
                            <a href="#/packages" class="footer-link">Beach Tours</a>
                            <a href="#/packages" class="footer-link">Mountain Tours</a>
                            <a href="#/packages" class="footer-link">Adventure Tours</a>
                            <a href="#/packages" class="footer-link">Heritage Tours</a>
                        </div>
                        <div class="footer-contact-col">
                            <h4 class="footer-heading">Contact Info</h4>
                            <div class="footer-contact-item">${Icons.mapPin(16)}<span>42, MG Road, Pune, Maharashtra</span></div>
                            <div class="footer-contact-item">${Icons.phone(16)}<span>+91 9876543210</span></div>
                            <div class="footer-contact-item">${Icons.mail(16)}<span>info@travelvista.com</span></div>
                            <form class="footer-newsletter" id="footer-newsletter">
                                <input type="email" placeholder="Your email..." class="newsletter-input" id="newsletter-email">
                                <button type="submit" class="newsletter-btn">${Icons.send(16)}</button>
                            </form>
                            <p class="newsletter-success" id="newsletter-success" style="display:none">Subscribed! 🎉</p>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p>© 2026 TravelVista. All rights reserved. Made with ❤️ in India</p>
                    </div>
                </div>
            </div>
        </footer>`;

        // Newsletter form handler
        setTimeout(() => {
            const form = document.getElementById('footer-newsletter');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const input = document.getElementById('newsletter-email');
                    if (input && input.value) {
                        input.value = '';
                        const msg = document.getElementById('newsletter-success');
                        if (msg) { msg.style.display = 'block'; setTimeout(() => msg.style.display = 'none', 3000); }
                    }
                });
            }
        }, 100);
    }
};
