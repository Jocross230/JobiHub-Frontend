const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44378';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  return localStorage.getItem('careerflow_token');
}

function clearAuth() {
  localStorage.removeItem('careerflow_token');
  localStorage.removeItem('careerflow_user');
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    clearAuth();
    window.dispatchEvent(new CustomEvent('auth:expired'));
    throw new ApiError(401, 'incorrect username or password.');
  }
  if (res.status === 403) throw new ApiError(403, 'Access denied.');
  if (res.status === 404) throw new ApiError(404, 'Resource not found.');
  if (res.status === 409) throw new ApiError(409, 'Conflict — resource already exists.');
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;

    try {
      const body = await res.json();

      if (body.message) {
        msg = body.message;
      } else if (body.title) {
        msg = body.title;
      } else if (body.errors) {
        const validationMessages = Object.values(body.errors)
            .flat()
            .filter(Boolean);

        if (validationMessages.length > 0) {
          msg = validationMessages.join('\n');
        }
      } else if (typeof body === 'string') {
        msg = body;
      }
    } catch {
      // Keep the default status message.
    }

    throw new ApiError(res.status, msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(path: string, auth = true): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(auth ? authHeaders() : {}) },
  });
  return handleResponse<T>(res);
}

export async function apiPost<T>(path: string, body?: unknown, auth = true): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(auth ? authHeaders() : {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(res);
}

export async function apiPut<T>(path: string, body?: unknown, auth = true): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(auth ? authHeaders() : {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(res);
}

export async function apiDelete<T = void>(path: string, auth = true): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...(auth ? authHeaders() : {}) },
  });
  return handleResponse<T>(res);
}
