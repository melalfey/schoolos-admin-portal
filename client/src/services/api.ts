import { toast } from 'sonner';

const API_URL = 'http://142.93.190.119:5000/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiRequest<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const token = localStorage.getItem('schoolos_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data.data as T;
  } catch (error: any) {
    console.error(`API Error (${endpoint}):`, error);
    toast.error(error.message || 'Something went wrong');
    throw error;
  }
}

// School Service
export const schoolService = {
  getAll: () => apiRequest<any[]>('/schools'),
  getOne: (id: string) => apiRequest<any>(`/schools/${id}`),
  create: (data: any) => apiRequest<any>('/schools', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest<any>(`/schools/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest<any>(`/schools/${id}`, { method: 'DELETE' }),
  getAdmins: (id: string) => apiRequest<any[]>(`/schools/${id}/admins`),
  addAdmin: (id: string, email: string) => apiRequest<any>(`/schools/${id}/admins`, { method: 'POST', body: JSON.stringify({ email }) }),
  removeAdmin: (id: string, userId: string) => apiRequest<any>(`/schools/${id}/admins/${userId}`, { method: 'DELETE' }),
};

// User Service
export const userService = {
  getAll: (role?: string) => apiRequest<any[]>(`/users${role ? `?role=${role}` : ''}`),
  create: (data: any) => apiRequest<any>('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest<any>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest<any>(`/users/${id}`, { method: 'DELETE' }),
};
