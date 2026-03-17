/**
 * TravelVista — Login Page
 */
const LoginPage = {
    async render(container) {
        container.innerHTML = `
        <div class="auth-page"><div class="auth-card">
            <div class="auth-logo"><h1>Travel<span>Vista</span></h1><p>Welcome back! Login to your account</p></div>
            <div id="login-error" class="auth-error" style="display:none"></div>
            <form class="auth-form" id="login-form">
                <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="login-email" value="travelvista@gmail.com" required placeholder="Enter your email"></div>
                <div class="form-group"><label class="form-label">Password</label><input type="password" class="form-input" id="login-password" value="pass1234" required placeholder="Enter your password"></div>
                <button type="submit" class="btn btn-primary" id="login-btn">Login</button>
            </form>
            <div class="auth-footer">Don't have an account? <a href="#/register">Register here</a></div>
        </div></div>`;

        document.getElementById('login-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('login-btn');
            btn.textContent = 'Logging in...';
            btn.disabled = true;
            const result = await Store.login(
                document.getElementById('login-email').value,
                document.getElementById('login-password').value
            );
            if (result.success) {
                Toast.success('Welcome back!');
                Router.navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
            } else {
                const err = document.getElementById('login-error');
                err.textContent = result.message;
                err.style.display = 'block';
                btn.textContent = 'Login';
                btn.disabled = false;
            }
        });
    }
};
