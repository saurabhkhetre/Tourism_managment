/**
 * TravelVista — About Page
 */
const AboutPage = {
    async render(container) {
        container.innerHTML = `
        <div class="about-page">
            <section class="about-hero"><div class="container">
                <h1>About TravelVista</h1>
                <p>We are passionate about creating unforgettable travel experiences. Since 2010, we've been helping thousands of travelers explore the beauty of India with carefully curated tour packages.</p>
            </div></section>
            <div class="container">
                <div class="about-stats">
                    <div class="about-stat"><div class="stat-number">500+</div><div class="stat-label">Tours Completed</div></div>
                    <div class="about-stat"><div class="stat-number">10,000+</div><div class="stat-label">Happy Travelers</div></div>
                    <div class="about-stat"><div class="stat-number">50+</div><div class="stat-label">Destinations</div></div>
                    <div class="about-stat"><div class="stat-number">15+</div><div class="stat-label">Years Experience</div></div>
                </div>
                <section class="about-story">
                    <div class="about-story-grid">
                        <div class="about-story-image"><img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80" alt="Our Story"></div>
                        <div class="about-story-content">
                            <h2>Our Story</h2>
                            <p>Founded in 2010, TravelVista started with a simple mission: to make travel accessible, enjoyable, and memorable for everyone.</p>
                            <p>Over the years, we've grown from a small local agency to one of India's most trusted travel partners, serving thousands of happy travelers across 50+ destinations.</p>
                            <p>Our team of experienced travel experts works tirelessly to curate the perfect tour packages that combine adventure, culture, and comfort.</p>
                        </div>
                    </div>
                </section>
            </div>
            <section class="why-choose"><div class="container">
                <h2 class="section-title">Why Choose Us</h2>
                <div class="why-choose-grid">
                    <div class="why-card"><div class="why-icon">${Icons.shield(28)}</div><h3>Safety First</h3><p>All tours include comprehensive insurance and 24/7 emergency support.</p></div>
                    <div class="why-card"><div class="why-icon">${Icons.award(28)}</div><h3>Expert Guides</h3><p>Our certified guides bring destinations to life with their knowledge.</p></div>
                    <div class="why-card"><div class="why-icon">${Icons.heart(28)}</div><h3>Personalized Service</h3><p>Every trip is tailored to your preferences and interests.</p></div>
                </div>
            </div></section>
            <div class="container">
                <section class="about-team">
                    <h2 class="section-title">Our Team</h2>
                    <div class="team-grid">
                        <div class="team-card"><img src="https://i.pravatar.cc/150?img=33" alt="Rajesh Kumar"><h4>Rajesh Kumar</h4><p>Founder & CEO</p></div>
                        <div class="team-card"><img src="https://i.pravatar.cc/150?img=47" alt="Priya Sharma"><h4>Priya Sharma</h4><p>Head of Operations</p></div>
                        <div class="team-card"><img src="https://i.pravatar.cc/150?img=12" alt="Amit Patel"><h4>Amit Patel</h4><p>Lead Tour Guide</p></div>
                        <div class="team-card"><img src="https://i.pravatar.cc/150?img=25" alt="Neha Gupta"><h4>Neha Gupta</h4><p>Customer Relations</p></div>
                    </div>
                </section>
            </div>
        </div>`;
    }
};
