import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { setupMockApi } from './mockApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// Error response interface
export interface ApiErrorResponse {
  error?: {
    code?: string;
    message?: string;
    details?: Array<{
      field?: string;
      message?: string;
    }>;
    timestamp?: string;
    path?: string;
  };
  message?: string;
}

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: Array<{ field?: string; message?: string }>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and automatic logout on 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: any) => {
    // Check if this is a mock API response
    if (error.__isMockResponse && error.response) {
      return Promise.resolve(error.response);
    }

    // Handle 401 Unauthorized - automatic logout
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Transform error into a more usable format
    const errorResponse = error.response?.data;
    const statusCode = error.response?.status;
    
    let message = 'An unexpected error occurred';
    let code = 'UNKNOWN_ERROR';
    let details: Array<{ field?: string; message?: string }> | undefined;
    
    if (errorResponse?.error) {
      message = errorResponse.error.message || message;
      code = errorResponse.error.code || code;
      details = errorResponse.error.details;
    } else if (errorResponse?.message) {
      message = errorResponse.message;
    } else if (error.message) {
      message = error.message;
    }
    
    // Handle specific status codes
    if (statusCode === 400) {
      message = message || 'Invalid request. Please check your input.';
    } else if (statusCode === 403) {
      message = message || 'You do not have permission to perform this action.';
    } else if (statusCode === 404) {
      message = message || 'The requested resource was not found.';
    } else if (statusCode === 500) {
      message = message || 'A server error occurred. Please try again later.';
    } else if (error.code === 'ECONNABORTED') {
      message = 'Request timeout. Please check your connection and try again.';
    } else if (error.code === 'ERR_NETWORK') {
      message = 'Network error. Please check your internet connection.';
    }
    
    const apiError = new ApiError(message, statusCode, code, details);
    return Promise.reject(apiError);
  }
);

// Setup mock API if enabled
setupMockApi(api);

export default api;
