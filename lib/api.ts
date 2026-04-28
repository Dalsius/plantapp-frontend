const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('plantapp_token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// AUTH
export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// PLANTS
export async function identifyPlant(file: File) {
  const form = new FormData();
  form.append('photo', file);
  const res = await fetch(`${API}/plants/identify`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: form,
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function getPlants() {
  const res = await fetch(`${API}/plants`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function waterPlant(id: number) {
  const res = await fetch(`${API}/plants/${id}/water`, {
    method: 'PATCH',
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function deletePlant(id: number) {
  const res = await fetch(`${API}/plants/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw await res.json();
  return res.json();
}
