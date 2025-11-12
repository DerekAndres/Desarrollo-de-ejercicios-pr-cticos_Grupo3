const BASE = '/api';

async function handleResponse(res) {
  if (!res.ok) {
    let message = 'Error de servidor';
    try { const data = await res.json(); message = data.message || JSON.stringify(data); } catch {}
    throw new Error(message);
  }
  return res.json();
}

export async function getUsuarios() {
  const res = await fetch(`${BASE}/usuarios`);
  return handleResponse(res);
}

export async function getPersonas() {
  const res = await fetch(`${BASE}/personas`);
  return handleResponse(res);
}

export async function getHealth() {
  const res = await fetch('/health');
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}
