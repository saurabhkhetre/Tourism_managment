/**
 * Admin Transport Page
 */
const AdminTransportPage = {
    async render(container) {
        let transport = [];
        try {
            transport = await Store.loadTransport();
        } catch (e) {
            Toast.error('Failed to load transport');
            console.error(e);
        }
        container.innerHTML = `
        <div class="admin-page">
            <div class="admin-page-header"><div><h1>Manage Transport</h1><p>${transport.length} vehicles</p></div><button class="btn btn-primary" id="add-tr">${Icons.plus(16)} Add Vehicle</button></div>
            <div class="admin-table-container"><table class="data-table"><thead><tr><th>Type</th><th>Name</th><th>Capacity</th><th>Price/Day</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody id="tr-tbody">${transport.map(t => `<tr><td>${t.type || 'Car'}</td><td style="font-weight:500">${t.name}</td><td>${t.capacity || 0}</td><td>₹${(t.pricePerDay || 0).toLocaleString()}</td><td><span class="badge badge-${t.available !== false ? 'success' : 'warning'}">${t.available !== false ? 'Available' : 'Unavailable'}</span></td><td><div class="admin-table-actions"><button class="btn btn-ghost btn-sm edit-tr" data-id="${t.id}">${Icons.edit(14)}</button><button class="btn btn-ghost btn-sm del-tr" data-id="${t.id}" style="color:var(--danger)">${Icons.trash(14)}</button></div></td></tr>`).join('')}</tbody></table></div>
        </div>`;

        // Create modal in document.body
        let modalEl = document.getElementById('tr-modal');
        if (modalEl) modalEl.remove();
        modalEl = document.createElement('div');
        modalEl.className = 'modal-backdrop';
        modalEl.id = 'tr-modal';
        modalEl.style.display = 'none'; modalEl.style.zIndex = '9999';
        modalEl.innerHTML = `<div class="modal">
            <div class="modal-header"><h3 id="tr-title">Add Vehicle</h3><button class="btn btn-ghost btn-sm" id="close-tr">${Icons.x(18)}</button></div>
            <div class="modal-body">
                <div class="form-row"><div class="form-group"><label class="form-label">Name</label><input type="text" class="form-input" id="tf-name" required></div><div class="form-group"><label class="form-label">Type</label><select class="form-input" id="tf-type"><option>Bus</option><option>Car</option><option>Van</option><option>SUV</option><option>Tempo Traveller</option></select></div></div>
                <div class="form-row"><div class="form-group"><label class="form-label">Capacity</label><input type="number" class="form-input" id="tf-cap" value="20"></div><div class="form-group"><label class="form-label">Price/Day (₹)</label><input type="number" class="form-input" id="tf-price" required></div></div>
                <div class="form-group"><label class="form-checkbox"><input type="checkbox" id="tf-avail" checked> Available</label></div>
            </div>
            <div class="modal-footer"><button class="btn btn-ghost" id="cancel-tr">Cancel</button><button class="btn btn-primary" id="save-tr">Save</button></div>
        </div>`;
        document.body.appendChild(modalEl);

        let editId = null;
        const modal = modalEl;
        const open = (t = null) => {
            editId = t?.id || null;
            document.getElementById('tr-title').textContent = t ? 'Edit Vehicle' : 'Add Vehicle';
            document.getElementById('tf-name').value = t?.name || '';
            document.getElementById('tf-type').value = t?.type || 'Bus';
            document.getElementById('tf-cap').value = t?.capacity || 20;
            document.getElementById('tf-price').value = t?.pricePerDay || '';
            document.getElementById('tf-avail').checked = t?.available !== false;
            modal.style.display = 'flex';
        };
        document.getElementById('add-tr').addEventListener('click', () => open());
        document.getElementById('close-tr').addEventListener('click', () => modal.style.display = 'none');
        document.getElementById('cancel-tr').addEventListener('click', () => modal.style.display = 'none');
        document.getElementById('save-tr').addEventListener('click', async () => {
            const d = {
                name: document.getElementById('tf-name').value,
                type: document.getElementById('tf-type').value,
                capacity: Number(document.getElementById('tf-cap').value),
                pricePerDay: Number(document.getElementById('tf-price').value),
                available: document.getElementById('tf-avail').checked
            };
            try {
                if (editId) { d.id = editId; await Store.updateTransport(d); Toast.success('Vehicle updated!'); }
                else { await Store.addTransport(d); Toast.success('Vehicle added!'); }
                modal.style.display = 'none';
                Router.resolve();
            } catch (e) {
                Toast.error('Failed to save vehicle');
                console.error(e);
            }
        });
        document.querySelectorAll('.edit-tr').forEach(b => b.addEventListener('click', () => open(transport.find(t => t.id == b.dataset.id))));
        document.querySelectorAll('.del-tr').forEach(b => b.addEventListener('click', async () => {
            if (confirm('Delete this vehicle?')) {
                try {
                    await Store.deleteTransport(b.dataset.id);
                    Toast.success('Vehicle deleted');
                    Router.resolve();
                } catch (e) {
                    Toast.error('Failed to delete vehicle');
                    console.error(e);
                }
            }
        }));
    }
};




