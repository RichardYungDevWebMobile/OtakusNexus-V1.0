const DEFAULT_TIMEOUT = 10000;

async function timeoutPromise(promise, ms = DEFAULT_TIMEOUT) {
  let id;
  const timeout = new Promise((_, reject) => (id = setTimeout(() => reject(new Error('timeout')), ms)));
  const res = await Promise.race([promise, timeout]);
  clearTimeout(id);
  return res;
}

export async function get(url, opts = {}) {
  const resp = await timeoutPromise(fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' }, ...opts }));
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json().catch(() => null);
}

export async function post(url, body, opts = {}) {
  const resp = await timeoutPromise(
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), ...opts })
  );
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json().catch(() => null);
}
