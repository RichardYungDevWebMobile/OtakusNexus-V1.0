import { get } from '../../services/apiClient';

// Simple placeholder news service. If you have a real API, change BASE to your endpoint.
const BASE = 'https://api.example.com'; // replace with real backend when available

export async function fetchLatestNews() {
  try {
    // fallback: return mocked data if remote fails
    const data = await get(`${BASE}/news`).catch(() => null);
    if (data && Array.isArray(data)) return data;
  } catch (e) {
    // ignore
  }

  // Mocked news for offline/dev
  return [
    { id: 'n1', title: 'Nexus: grosse update UI', source: 'Otakus Nexus', publishedAt: '2h', image: 'https://placehold.co/600x400', body: 'Détails...' },
    { id: 'n2', title: 'Nouveaux épisodes cette semaine', source: 'AnimeDaily', publishedAt: '4h', image: 'https://placehold.co/600x400', body: 'Détails...' },
  ];
}
