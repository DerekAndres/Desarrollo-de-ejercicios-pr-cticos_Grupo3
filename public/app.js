const API_BASE = '/api/personas';

const el = (sel) => document.querySelector(sel);
const els = (sel) => Array.from(document.querySelectorAll(sel));

async function checkHealth() {
    try {
        const res = await fetch('/health');
        if (!res.ok) throw new Error('Health not ok');
        const data = await res.json();
        el('#apiStatus').textContent = 'online';
        el('#apiStatus').style.color = '#22c55e';
        el('#dbStatus').textContent = data.dbState || 'unknown';
        el('#dbStatus').style.color = data.dbState === 'connected' ? '#22c55e' : '#eab308';
    } catch (e) {
        el('#apiStatus').textContent = 'offline';
        el('#apiStatus').style.color = '#ef4444';
        el('#dbStatus').textContent = 'unknown';
        el('#dbStatus').style.color = '#ef4444';
    }
}

function getFormData() {
    return {
        nombre: el('#nombre').value.trim(),
        edad: Number(el('#edad').value),
        email: el('#email').value.trim(),
    };
}

function setForm(data = {}) {
    el('#personaId').value = data._id || '';
    el('#nombre').value = data.nombre || '';
    el('#edad').value = data.edad ?? '';
    el('#email').value = data.email || '';
    el('#saveBtn').textContent = data._id ? 'Actualizar' : 'Guardar';
}

function showMessage(targetSel, msg, isError = false) {
    const box = el(targetSel);
    box.textContent = msg || '';
    box.style.color = isError ? '#ef4444' : '#94a3b8';
}

async function listPersonas() {
    try {
        showMessage('#listMsg', 'Cargando…');
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error('Error cargando personas');
        const personas = await res.json();
        renderTable(personas);
        showMessage('#listMsg', `Total: ${personas.length}`);
    } catch (e) {
        renderTable([]);
        showMessage('#listMsg', e.message, true);
    }
}

function renderTable(personas) {
    const tbody = el('#personasTable tbody');
    tbody.innerHTML = '';
    personas.forEach((p) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${escapeHtml(p.nombre)}</td>
      <td>${p.edad}</td>
      <td>${escapeHtml(p.email)}</td>
      <td>
        <button class="small" data-action="edit" data-id="${p._id}">Editar</button>
        <button class="small danger" data-action="delete" data-id="${p._id}">Eliminar</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

function escapeHtml(str = '') {
    return str.replace(/[&<>'"]/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[c]);
}

async function createPersona(data) {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(parseApiError(err) || `Error ${res.status}`);
    }
    return res.json();
}

async function updatePersona(id, data) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(parseApiError(err) || `Error ${res.status}`);
    }
    return res.json();
}

async function deletePersona(id) {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
        const err = await safeJson(res);
        throw new Error(parseApiError(err) || `Error ${res.status}`);
    }
    return res.json();
}

function parseApiError(err) {
    if (!err) return '';
    if (Array.isArray(err.errors)) {
        return err.errors.map(e => e.msg || e.message || JSON.stringify(e)).join(', ');
    }
    return err.message || '';
}

async function safeJson(res) {
    try { return await res.json(); } catch { return null; }
}

// Events
el('#personaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = el('#personaId').value;
    const data = getFormData();
    try {
        // Basic client-side validation
        if (!data.nombre) throw new Error('Nombre es requerido');
        if (!Number.isInteger(data.edad) || data.edad < 0) throw new Error('Edad debe ser un entero positivo');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) throw new Error('Email no es válido');

        if (id) {
            await updatePersona(id, data);
            showMessage('#formMsg', 'Persona actualizada');
        } else {
            await createPersona(data);
            showMessage('#formMsg', 'Persona creada');
        }
        setForm({});
        await listPersonas();
    } catch (err) {
        showMessage('#formMsg', err.message, true);
    }
});

el('#resetBtn').addEventListener('click', () => setForm({}));

document.body.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    try {
        if (action === 'edit') {
            // We can fetch by id, but we already have the row values; to keep it simple, read cells
            const tr = btn.closest('tr');
            const nombre = tr.children[0].textContent;
            const edad = Number(tr.children[1].textContent);
            const email = tr.children[2].textContent;
            setForm({ _id: id, nombre, edad, email });
            el('#nombre').focus();
        } else if (action === 'delete') {
            if (confirm('¿Eliminar esta persona?')) {
                await deletePersona(id);
                await listPersonas();
                showMessage('#listMsg', 'Persona eliminada');
            }
        }
    } catch (err) {
        showMessage('#listMsg', err.message, true);
    }
});

el('#refreshBtn').addEventListener('click', listPersonas);

// Init
checkHealth();
listPersonas();
