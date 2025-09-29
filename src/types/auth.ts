// User types
export interface User {
  id: number;
  email: string;
  full_name?: string;
  user_name?: string;
  created_at?: string;
  updated_at?: string;
}

// Authentication API response types
export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  full_name: string;
  user_name: string;
}

export interface SignUpResponse {
  id: number;
  email: string;
  created_at: string;
}

export interface LoginRequest {
  username: string; // FastAPI OAuth2 uses 'username' for email
  password: string;
  grant_type?: string;
  scope?: string;
  client_id?: string | null;
  client_secret?: string | null;
}

// Form state types
export interface AuthFormState {
  errors?: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    full_name?: string;
    username?: string;
    general?: string;
  };
  message?: string;
  success?: boolean;
  email?: string; // For OTP verification redirect
}

// API error response
export interface ApiError {
  detail: string | Array<{ loc: string[]; msg: string; type: string }>;
}

// Session data
export interface SessionData {
  token: string;
  user: User;
  expiresAt: number;
}
