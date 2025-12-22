// services/api.js
// Lightweight API client stub. Replace baseURL with your real endpoint.

const BASE_URL = 'https://api.example.com';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    let err;
    try { err = JSON.parse(text); } catch (e) { err = { message: text }; }
    throw new Error(err.message || 'API request failed');
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

export async function login({ email, password }) {
  // stub implementation: in real app call POST /auth/login
  // return await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) resolve({ token: 'stub-token', user: { email } });
      else reject(new Error('Invalid credentials'));
    }, 500);
  });
}

export async function register({ email, password }) {
  // stub implementation
  return new Promise((resolve) => setTimeout(() => resolve({ id: Date.now(), email }), 500));
}

export async function fetchWatchlist() {
  // stub: return fake watchlist
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          { id: 1, title: 'Naruto', status: 'Watching' },
          { id: 2, title: 'One Piece', status: 'Planned' },
        ]),
      300
    )
  );
}

export async function fetchAnimeById(id) {
  // stub: return fake details
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          id,
          title: `Anime #${id}`,
          synopsis: 'This is a stub synopsis for the anime detail screen.',
          episodes: 24,
          score: 8.2,
          image: null,
        }),
      300
    )
  );
}

export default { login, register, fetchWatchlist, fetchAnimeById };
