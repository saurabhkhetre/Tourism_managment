/**
 * Admin Settings Page
 */
const AdminSettingsPage = {
    async render(container) {
        const settings = await Store.loadSettings();
        container.innerHTML = `
        <div class="admin-page">
            <div class="admin-page-header"><div><h1>Settings</h1><p>Configure your application</p></div></div>
            <div class="settings-form">
                <div class="settings-section"><h3>${Icons.globe(20)} General Settings</h3>
                    <div class="form-row"><div class="form-group"><label class="form-label">Site Name</label><input type="text" class="form-input" id="s-name" value="${settings.siteName || 'TravelVista'}"></div>
                    <div class="form-group"><label class="form-label">Contact Email</label><input type="email" class="form-input" id="s-email" value="${settings.contactEmail || 'info@travelvista.com'}"></div></div>
                    <div class="form-row"><div class="form-group"><label class="form-label">Phone</label><input type="tel" class="form-input" id="s-phone" value="${settings.phone || '+91 9876543210'}"></div>
                    <div class="form-group"><label class="form-label">Address</label><input type="text" class="form-input" id="s-address" value="${settings.address || '42, MG Road, Pune'}"></div></div>
                </div>
                <div class="settings-section"><h3>${Icons.creditCard(20)} Payment Settings</h3>
                    <div class="form-group"><label class="form-label">Currency</label><select class="form-input" id="s-currency"><option ${settings.currency === 'INR' ? 'selected' : ''}>INR</option><option ${settings.currency === 'USD' ? 'selected' : ''}>USD</option></select></div>
                    <div class="form-group"><label class="form-checkbox"><input type="checkbox" id="s-online-pay" ${settings.onlinePayment !== false ? 'checked' : ''}> Enable Online Payment</label></div>
                </div>
                <button class="btn btn-primary btn-lg" id="save-settings">${Icons.check(16)} Save Settings</button>
            </div>
        </div>`;

        document.getElementById('save-settings')?.addEventListener('click', async () => {
            const data = { siteName: document.getElementById('s-name').value, contactEmail: document.getElementById('s-email').value, phone: document.getElementById('s-phone').value, address: document.getElementById('s-address').value, currency: document.getElementById('s-currency').value, onlinePayment: document.getElementById('s-online-pay').checked };
            await Store.saveSettings(data);
            Toast.success('Settings saved!');
        });
    }
};
