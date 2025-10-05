export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UploadResponse {
  id: string;
  original_filename: string;
  file_size: number;
  created_at: string;
}

export interface ProcessRequest {
  text?: string;
  upload_id?: string;
  model_name?: string;
}

export interface AuditResult {
  id: string;
  input_text?: string;
  result_json: {
    status: string;
    analysis?: string;
    suggestions?: string[];
    quality_score?: number;
    model_used?: string;
  };
  status: string;
  created_at: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  email?: string;
  password?: string;
}