/**
 * TravelVista — Contact Page
 */
const ContactPage = {
    async render(container) {
        container.innerHTML = `
        <div class="page-header"><div class="container"><h1>Contact Us</h1><p>We'd love to hear from you</p></div></div>
        <div class="contact-page"><div class="container">
            <div class="contact-grid">
                <div class="contact-info">
                    <h2>Get in Touch</h2>
                    <p>Have questions about our tours? Want to customize a package? Our team is here to help you plan your perfect trip.</p>
                    <div class="contact-cards">
                        <div class="contact-card"><div class="card-icon">${Icons.mapPin(20)}</div><div><h4>Address</h4><p>42, MG Road, Pune, Maharashtra 411001</p></div></div>
                        <div class="contact-card"><div class="card-icon">${Icons.phone(20)}</div><div><h4>Phone</h4><p>+91 9876543210</p></div></div>
                        <div class="contact-card"><div class="card-icon">${Icons.mail(20)}</div><div><h4>Email</h4><p>info@travelvista.com</p></div></div>
                        <div class="contact-card"><div class="card-icon">${Icons.clock(20)}</div><div><h4>Working Hours</h4><p>Mon - Sat: 9:00 AM - 7:00 PM</p></div></div>
                    </div>
                </div>
                <div class="contact-form-wrapper">
                    <h2>Send us a Message</h2>
                    <div id="contact-success" class="form-success" style="display:none">Your message has been sent! We'll get back to you soon.</div>
                    <form class="contact-form" id="contact-form">
                        <div class="form-row"><div class="form-group"><label class="form-label">Name</label><input type="text" class="form-input" id="contact-name" required></div>
                        <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="contact-email" required></div></div>
                        <div class="form-group"><label class="form-label">Subject</label><input type="text" class="form-input" id="contact-subject"></div>
                        <div class="form-group"><label class="form-label">Message</label><textarea class="form-textarea" id="contact-message" required></textarea></div>
                        <button type="submit" class="btn btn-primary btn-lg">Send Message ${Icons.send(16)}</button>
                    </form>
                </div>
            </div>
            <div class="contact-map">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242117.6810838907!2d73.69815229457037!3d18.524564859498456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1" width="100%" height="300" style="border:0;border-radius:var(--radius-xl)" allowfullscreen loading="lazy"></iframe>
            </div>
        </div></div>`;

        document.getElementById('contact-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const enquiry = {
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                subject: document.getElementById('contact-subject').value,
                message: document.getElementById('contact-message').value,
            };
            await Store.addEnquiry(enquiry);
            document.getElementById('contact-success').style.display = 'block';
            e.target.reset();
            Toast.success('Message sent successfully!');
            setTimeout(() => { const s = document.getElementById('contact-success'); if (s) s.style.display = 'none'; }, 5000);
        });
    }
};
