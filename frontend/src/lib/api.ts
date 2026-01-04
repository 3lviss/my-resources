const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface ApiResponse<T = unknown> {
  status_code: number;
  message: string;
  data: T | null;
}

export async function api<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();
  return data;
}

export const auth = {
  register: (email: string) =>
    api("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  login: (email: string) =>
    api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  logout: () =>
    api("/auth/logout", {
      method: "POST",
    }),

  me: () => api("/auth/me"),
};

export const resources = {
  getAll: (page: number = 1) => api(`/resources?page=${page}`),
  getById: (id: string) => api(`/resources/${id}`),
  getTypes: () => api<string[]>("/resources/types"),
};
