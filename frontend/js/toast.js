/**
 * TravelVista — Toast Notification System
 */
const Toast = {
    _container: null,

    _getContainer() {
        if (!this._container) this._container = document.getElementById('toast-container');
        return this._container;
    },

    show(message, type = 'success', duration = 3500) {
        const container = this._getContainer();
        const iconMap = { success: Icons.checkCircle, error: Icons.xCircle, warning: Icons.alertTriangle, info: Icons.info };
        const id = 'toast-' + Date.now() + Math.random();
        const el = document.createElement('div');
        el.id = id;
        el.className = `toast toast-${type}`;
        el.innerHTML = `
            <span class="toast-icon">${(iconMap[type] || Icons.info)(18)}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="Toast.remove('${id}')">${Icons.x(14)}</button>
        `;
        container.appendChild(el);
        setTimeout(() => this.remove(id), duration);
    },

    remove(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    },

    success(msg) { this.show(msg, 'success'); },
    error(msg) { this.show(msg, 'error'); },
    warning(msg) { this.show(msg, 'warning'); },
    info(msg) { this.show(msg, 'info'); },
};
