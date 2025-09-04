import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => config, // For client-side requests, session is handled by server-side API routes
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.warn('API error response:', error.response);
    // Return a more user-friendly error format
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.message || 
                        error.message || 
                        'An unexpected error occurred';
    
    return Promise.reject(new Error(errorMessage));
  }
);

// API methods
export const api = {
  // GET request
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get(url, config);
    return response.data;
  },

  // POST request
  post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post(url, data, config);
    return response.data;
  },

  // PUT request
  put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put(url, data, config);
    return response.data;
  },

  // PATCH request
  patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch(url, data, config);
    return response.data;
  },

  // DELETE request
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete(url, config);
    return response.data;
  },

  // Form data POST (for OAuth2 login)
  postForm: async <T>(url: string, data: URLSearchParams, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post(url, data, {
      ...config,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...config?.headers,
      },
    });
    return response.data;
  },
};

// Server-side API methods (for server actions)
export const serverApi = {
  // Server-side requests with custom token
  get: async <T>(url: string, token?: string): Promise<T> => {
    const config: AxiosRequestConfig = {};
    
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    
    const response = await apiClient.get(url, config);
    return response.data;
  },

  post: async <T>(url: string, data?: unknown, token?: string): Promise<T> => {
    const config: AxiosRequestConfig = {};
    
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    
    const response = await apiClient.post(url, data, config);
    return response.data;
  },

  postForm: async <T>(url: string, data: URLSearchParams): Promise<T> => {
    const response = await apiClient.post(url, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
};

export default apiClient;
