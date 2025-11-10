import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { ApiResponse, LetoConfig } from '../types';

/**
 * Custom error class for LETO API errors
 */
export class LetoApiError extends Error {
  public readonly code: string;
  public readonly timestamp: string;
  public readonly data: any;
  public readonly success: boolean;
  public readonly statusCode?: number;

  constructor(response: ApiResponse<any>, statusCode?: number) {
    super(response.message);
    this.name = 'LetoApiError';
    this.code = response.code;
    this.timestamp = response.timestamp;
    this.data = response.data;
    this.success = response.success;
    this.statusCode = statusCode;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LetoApiError);
    }
  }
}

/**
 * HTTP Client for LETO API
 */
export class HttpClient {
  private readonly client: AxiosInstance;
  private readonly config: LetoConfig;

  constructor(config: LetoConfig) {
    this.config = {
      baseUrl: 'https://api.leto.kr',
      timeout: 30000,
      retries: 3,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': this.config.tenantId,
        'X-Service-Token': this.config.serviceToken,
      },
    });

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse<any>>) => {
        if (error.response?.data) {
          // API returned an error response
          throw new LetoApiError(error.response.data, error.response.status);
        }
        // Network error or other non-API error
        throw error;
      }
    );
  }

  /**
   * Perform a GET request
   */
  async get<T = any>(
    path: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(path, {
      params,
      ...config,
    });
    return response.data;
  }

  /**
   * Perform a POST request
   */
  async post<T = any>(
    path: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(path, data, config);
    return response.data;
  }

  /**
   * Perform a PUT request
   */
  async put<T = any>(
    path: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(path, data, config);
    return response.data;
  }

  /**
   * Perform a DELETE request
   */
  async delete<T = any>(
    path: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(path, config);
    return response.data;
  }

  /**
   * Perform a PATCH request
   */
  async patch<T = any>(
    path: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(path, data, config);
    return response.data;
  }
}
