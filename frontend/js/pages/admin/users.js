/**
 * Admin Users Page
 */
const AdminUsersPage = {
    async render(container) {
        const users = await Store.getAllUsers();
        container.innerHTML = `
        <div class="admin-page">
            <div class="admin-page-header"><div><h1>Manage Users</h1><p>${users.length} registered users</p></div></div>
            <div class="admin-table-container">
                <div class="admin-table-header"><h3>All Users</h3><div class="admin-search">${Icons.search(16)}<input type="text" id="u-search" placeholder="Search users..."></div></div>
                <table class="data-table"><thead><tr><th>User</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody id="u-tbody">${this.rows(users)}</tbody></table>
            </div>
        </div>`;

        document.getElementById('u-tbody').addEventListener('click', async (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const id = btn.dataset.id;
            if (btn.classList.contains('toggle-u')) { await Store.toggleUserBlock(id); Toast.info('User status updated'); Router.resolve(); }
            else if (btn.classList.contains('delete-u')) { if (confirm('Delete user?')) { await Store.deleteUser(id); Toast.success('Deleted'); Router.resolve(); } }
        });

        document.getElementById('u-search')?.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            document.getElementById('u-tbody').innerHTML = this.rows(users.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)));
        });
    },
    rows(users) {
        return users.map(u => `<tr>
            <td><div style="display:flex;align-items:center;gap:8px"><img src="${u.avatar}" alt="${u.name}" style="width:32px;height:32px;border-radius:50%;object-fit:cover"><span style="font-weight:500">${u.name}</span></div></td>
            <td>${u.email}</td><td>${u.phone || 'N/A'}</td><td><span class="badge badge-${u.role === 'admin' ? 'primary' : 'secondary'}">${u.role}</span></td>
            <td><span class="badge badge-${u.blocked ? 'danger' : 'success'}">${u.blocked ? 'Blocked' : 'Active'}</span></td>
            <td><div class="admin-table-actions"><button class="btn btn-ghost btn-sm toggle-u" data-id="${u.id}">${u.blocked ? Icons.check(14) : Icons.ban(14)}</button>${u.role !== 'admin' ? `<button class="btn btn-ghost btn-sm delete-u" data-id="${u.id}" style="color:var(--danger)">${Icons.trash(14)}</button>` : ''}</div></td>
        </tr>`).join('');
    }
};
