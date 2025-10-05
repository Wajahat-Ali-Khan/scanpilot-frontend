import type {
  User,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UploadResponse,
  ProcessRequest,
  AuditResult,
  UpdateProfileRequest,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('access_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        localStorage.removeItem('access_token');
        window.location.href = '/';
        throw new Error('Unauthorized');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async register(data: RegisterRequest): Promise<User> {
    return this.request<User>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<TokenResponse> {
    const response = await this.request<TokenResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    localStorage.setItem('access_token', response.access_token);
    return response;
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // User methods
  async getProfile(): Promise<User> {
    return this.request<User>('/api/users/profile');
  }

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    return this.request<User>('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Upload methods
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/api/uploads/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }

    return response.json();
  }

  // Results methods
  async processDocument(data: ProcessRequest): Promise<AuditResult> {
    return this.request<AuditResult>('/api/results/process', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getResults(): Promise<AuditResult[]> {
    return this.request<AuditResult[]>('/api/results/');
  }

  async getResultById(id: string): Promise<AuditResult> {
    return this.request<AuditResult>(`/api/results/${id}`);
  }
}

export const api = new ApiService();