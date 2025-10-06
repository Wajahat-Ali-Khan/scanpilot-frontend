import type {
  User,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UploadResponse,
  ProcessRequest,
  AuditResult,
  UpdateProfileRequest,
  UploadWithStatus,
  ProcessFileRequest,
  FileProcessingResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = this.getValidToken();
  
  if (!endpoint.includes('/auth/') && !token) {
    this.redirectToLogin();
    throw new Error('No valid token');
  }

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
      this.handleUnauthorized();
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
  private isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    if (!exp) return false;
    
    return Date.now() >= (exp * 1000) - 5000;
  } catch {
    return true;
  }
}

  private handleUnauthorized(): void {
    this.logout();
    this.redirectToLogin();
  }

  private redirectToLogin(): void {
    if (!window.location.pathname.includes('/') || window.location.pathname !== '/') {
      window.location.href = '/';
    }
  }

  async register(data: RegisterRequest): Promise<User> {
    localStorage.removeItem('access_token');
    
    return this.request<User>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

async login(data: LoginRequest): Promise<TokenResponse> {
  this.logout();
  
  console.log('Making login request...');
  
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }

  const tokenData = await response.json();
  console.log('Received token data:', tokenData);
  
  if (tokenData.access_token) {
    localStorage.setItem('access_token', tokenData.access_token);
    console.log('Token stored in localStorage:', localStorage.getItem('access_token'));
  } else {
    console.error('No access_token in response:', tokenData);
    throw new Error('No access token received');
  }
  
  return tokenData;
}

 private getValidToken(): string | null {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  
  if (this.isTokenExpired(token)) {
    console.error('Token expired');
    this.logout();
    return null;
  }
  
  return token;
}

  logout(): void {
    localStorage.removeItem('access_token');
  }

  isAuthenticated(): boolean {
    const token = this.getValidToken();
    if (!token) return false;

    try {
      const parts = token.split('.');
      return parts.length === 3;
    } catch {
      return false;
    }
  }

  async getProfile(): Promise<User> {
    return this.request<User>('/api/users/profile');
  }

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    return this.request<User>('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

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

  async getAllUploads(): Promise<UploadWithStatus[]> {
    return this.request<UploadWithStatus[]>('/api/uploads/');
  }

  async getUploadById(id: string): Promise<UploadWithStatus> {
    return this.request<UploadWithStatus>(`/api/uploads/${id}`);
  }

  async processFile(data: ProcessFileRequest): Promise<FileProcessingResponse> {
    return this.request<FileProcessingResponse>('/api/uploads/process', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteUpload(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/uploads/${id}`, {
      method: 'DELETE',
    });
  }

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