import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
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
      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        localStorage.removeItem('schoolos_token');
        localStorage.removeItem('schoolos_user');
        window.location.href = '/login';
      }
      throw new Error(data.message || 'API request failed');
    }

    return data.data || data; // Handle both wrapped { data: ... } and direct responses
  } catch (error: any) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Auth Service
export const authService = {
  login: (credentials: any) => apiRequest<any>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (data: any) => apiRequest<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getCurrentUser: () => apiRequest<any>('/auth/me'),
};

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
};

// Student Service
export const studentService = {
  getAll: (page = 1, limit = 10, search = '') => apiRequest<any>(`/students?page=${page}&limit=${limit}&search=${search}`),
  getOne: (id: string) => apiRequest<any>(`/students/${id}`),
  create: (data: any) => apiRequest<any>('/students', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest<any>(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest<any>(`/students/${id}`, { method: 'DELETE' }),
};

// Staff Service
export const staffService = {
  getAll: (page = 1, limit = 10, search = '') => apiRequest<any>(`/staff?page=${page}&limit=${limit}&search=${search}`),
  getOne: (id: string) => apiRequest<any>(`/staff/${id}`),
  create: (data: any) => apiRequest<any>('/staff', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest<any>(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest<any>(`/staff/${id}`, { method: 'DELETE' }),
};

export default apiRequest;
