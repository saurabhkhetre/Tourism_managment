/**
 * TravelVista — Register Page
 */
const RegisterPage = {
    async render(container) {
        container.innerHTML = `
        <div class="auth-page"><div class="auth-card">
            <div class="auth-logo"><h1>Travel<span>Vista</span></h1><p>Create your account to get started</p></div>
            <div id="register-error" class="auth-error" style="display:none"></div>
            <form class="auth-form" id="register-form">
                <div class="form-row">
                    <div class="form-group"><label class="form-label">Full Name</label><input type="text" class="form-input" id="reg-name" required placeholder="Your full name"></div>
                    <div class="form-group"><label class="form-label">Phone</label><input type="tel" class="form-input" id="reg-phone" placeholder="Phone number"></div>
                </div>
                <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="reg-email" required placeholder="Your email"></div>
                <div class="form-group"><label class="form-label">Password</label><input type="password" class="form-input" id="reg-password" required placeholder="Create a password" minlength="6"></div>
                <div class="form-group"><label class="form-label">Confirm Password</label><input type="password" class="form-input" id="reg-confirm" required placeholder="Confirm your password"></div>
                <button type="submit" class="btn btn-primary" id="reg-btn">Create Account</button>
            </form>
            <div class="auth-footer">Already have an account? <a href="#/login">Login here</a></div>
        </div></div>`;

        document.getElementById('register-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = document.getElementById('reg-password').value;
            const confirm = document.getElementById('reg-confirm').value;
            if (password !== confirm) {
                const err = document.getElementById('register-error');
                err.textContent = 'Passwords do not match';
                err.style.display = 'block';
                return;
            }
            const btn = document.getElementById('reg-btn');
            btn.textContent = 'Creating account...';
            btn.disabled = true;
            const result = await Store.register({
                name: document.getElementById('reg-name').value,
                email: document.getElementById('reg-email').value,
                phone: document.getElementById('reg-phone').value,
                password
            });
            if (result.success) {
                Toast.success('Account created successfully!');
                Router.navigate('/dashboard');
            } else {
                const err = document.getElementById('register-error');
                err.textContent = result.message;
                err.style.display = 'block';
                btn.textContent = 'Create Account';
                btn.disabled = false;
            }
        });
    }
};
