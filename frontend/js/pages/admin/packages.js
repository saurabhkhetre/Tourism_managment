/**
 * TravelVista — Admin Packages Page
 */
const AdminPackagesPage = {
    async render(container) {
        const pkgs = await Store.loadAllPackages();
        container.innerHTML = `
        <div class="admin-page">
            <div class="admin-page-header"><div><h1>Manage Packages</h1><p>${pkgs.length} total packages</p></div><button class="btn btn-primary" id="add-pkg-btn">${Icons.plus(16)} Add Package</button></div>
            <div class="admin-table-container">
                <div class="admin-table-header"><h3>All Packages</h3><div class="admin-search">${Icons.search(16)}<input type="text" id="pkg-search" placeholder="Search packages..."></div></div>
                <table class="data-table"><thead><tr><th>Package</th><th>Category</th><th>Price</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody id="pkg-tbody">${this.renderRows(pkgs)}</tbody></table>
            </div>
        </div>
        <div class="modal-backdrop" id="pkg-modal" style="display:none"><div class="modal modal-lg">
            <div class="modal-header"><h3 id="pkg-modal-title">Add Package</h3><button class="btn btn-ghost btn-sm" id="close-pkg-modal">${Icons.x(18)}</button></div>
            <div class="modal-body"><form id="pkg-form">
                <div class="form-row"><div class="form-group"><label class="form-label">Title</label><input type="text" class="form-input" id="pf-title" required></div><div class="form-group"><label class="form-label">Location</label><input type="text" class="form-input" id="pf-location" required></div></div>
                <div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" id="pf-desc"></textarea></div>
                <div class="form-row"><div class="form-group"><label class="form-label">Category</label><select class="form-input" id="pf-category"><option>Beach</option><option>Mountain</option><option>Adventure</option><option>Heritage</option><option>Wildlife</option><option>Spiritual</option></select></div><div class="form-group"><label class="form-label">Duration</label><input type="text" class="form-input" id="pf-duration" placeholder="e.g. 5 Days / 4 Nights"></div></div>
                <div class="form-row-3"><div class="form-group"><label class="form-label">Price (₹)</label><input type="number" class="form-input" id="pf-price" required></div><div class="form-group"><label class="form-label">Original Price (₹)</label><input type="number" class="form-input" id="pf-oprice"></div><div class="form-group"><label class="form-label">Max Persons</label><input type="number" class="form-input" id="pf-max" value="20"></div></div>
                <div class="form-group"><label class="form-label">Image URL</label><input type="text" class="form-input" id="pf-image" placeholder="https://..."></div>
                <div class="form-row"><div class="form-group"><label class="form-checkbox"><input type="checkbox" id="pf-featured"> Featured Package</label></div><div class="form-group"><label class="form-checkbox"><input type="checkbox" id="pf-active" checked> Active</label></div></div>
            </form></div>
            <div class="modal-footer"><button class="btn btn-ghost" id="cancel-pkg">Cancel</button><button class="btn btn-primary" id="save-pkg">Save Package</button></div>
        </div></div>`;

        let editId = null;
        const modal = document.getElementById('pkg-modal');
        const openModal = (pkg = null) => {
            editId = pkg?.id || null;
            document.getElementById('pkg-modal-title').textContent = pkg ? 'Edit Package' : 'Add Package';
            document.getElementById('pf-title').value = pkg?.title || '';
            document.getElementById('pf-location').value = pkg?.location || '';
            document.getElementById('pf-desc').value = pkg?.description || '';
            document.getElementById('pf-category').value = pkg?.category || 'Beach';
            document.getElementById('pf-duration').value = pkg?.duration || '';
            document.getElementById('pf-price').value = pkg?.price || '';
            document.getElementById('pf-oprice').value = pkg?.originalPrice || '';
            document.getElementById('pf-max').value = pkg?.maxPersons || 20;
            document.getElementById('pf-image').value = pkg?.image || '';
            document.getElementById('pf-featured').checked = pkg?.featured || false;
            document.getElementById('pf-active').checked = pkg?.active !== false;
            modal.style.display = 'flex';
        };

        document.getElementById('add-pkg-btn').addEventListener('click', () => openModal());
        document.getElementById('close-pkg-modal').addEventListener('click', () => modal.style.display = 'none');
        document.getElementById('cancel-pkg').addEventListener('click', () => modal.style.display = 'none');

        document.getElementById('save-pkg').addEventListener('click', async () => {
            const data = { title: document.getElementById('pf-title').value, location: document.getElementById('pf-location').value, description: document.getElementById('pf-desc').value, category: document.getElementById('pf-category').value, duration: document.getElementById('pf-duration').value, price: Number(document.getElementById('pf-price').value), originalPrice: Number(document.getElementById('pf-oprice').value) || Number(document.getElementById('pf-price').value), maxPersons: Number(document.getElementById('pf-max').value), image: document.getElementById('pf-image').value, featured: document.getElementById('pf-featured').checked, active: document.getElementById('pf-active').checked };
            if (editId) { data.id = editId; await Store.updatePackage(data); Toast.success('Package updated!'); }
            else { await Store.addPackage(data); Toast.success('Package added!'); }
            modal.style.display = 'none';
            Router.resolve();
        });

        // Delegated events for edit/delete/toggle
        document.getElementById('pkg-tbody').addEventListener('click', async (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const id = btn.dataset.id;
            if (btn.classList.contains('edit-pkg')) openModal(Store.getPackage(id));
            else if (btn.classList.contains('toggle-pkg')) { await Store.togglePackageActive(id); Router.resolve(); }
            else if (btn.classList.contains('delete-pkg')) { if (confirm('Delete?')) { await Store.deletePackage(id); Toast.success('Deleted!'); Router.resolve(); } }
        });

        // Search
        document.getElementById('pkg-search')?.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            const filtered = pkgs.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
            document.getElementById('pkg-tbody').innerHTML = this.renderRows(filtered);
        });
    },

    renderRows(pkgs) {
        return pkgs.map(p => `<tr>
            <td style="font-weight:500">${p.title}</td><td>${p.category}</td><td>₹${p.price.toLocaleString()}</td><td>⭐ ${p.rating}</td>
            <td><span class="badge badge-${p.active ? 'success' : 'warning'}">${p.active ? 'Active' : 'Inactive'}</span></td>
            <td><div class="admin-table-actions"><button class="btn btn-ghost btn-sm edit-pkg" data-id="${p.id}">${Icons.edit(14)}</button><button class="btn btn-ghost btn-sm toggle-pkg" data-id="${p.id}">${p.active ? Icons.eyeOff(14) : Icons.eye(14)}</button><button class="btn btn-ghost btn-sm delete-pkg" data-id="${p.id}" style="color:var(--danger)">${Icons.trash(14)}</button></div></td>
        </tr>`).join('');
    }
};
