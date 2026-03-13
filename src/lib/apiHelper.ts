/**
 * HTTP/API helper with built-in logging
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { logger, LogContext } from './logger';

export interface ApiRequestOptions extends AxiosRequestConfig {
  ctx?: LogContext;
}

export interface ApiResponse<T = any> {
  status: number;
  data: T;
  headers: Record<string, any>;
  duration: number;
}

export class ApiHelper {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(baseUrl: string = '', config?: AxiosRequestConfig) {
    this.baseUrl = baseUrl;
    this.client = axios.create({
      baseURL: baseUrl,
      ...config,
    });
  }

  /**
   * Make GET request with logging
   */
  async get<T = any>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const startTime = Date.now();
    const ctx = options?.ctx || { module: 'ApiHelper' };

    try {
      logger.debug(`GET ${url}`, ctx);
      const response = await this.client.get<T>(url, options);
      const duration = Date.now() - startTime;

      logger.logApiCall('GET', url, response.status, duration, ctx);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`GET ${url} failed`, error as Error, { ...ctx, duration });
      throw error;
    }
  }

  /**
   * Make POST request with logging
   */
  async post<T = any>(
    url: string,
    data?: any,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    const startTime = Date.now();
    const ctx = options?.ctx || { module: 'ApiHelper' };

    try {
      logger.debug(`POST ${url}`, ctx, { dataSize: JSON.stringify(data).length });
      const response = await this.client.post<T>(url, data, options);
      const duration = Date.now() - startTime;

      logger.logApiCall('POST', url, response.status, duration, ctx);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`POST ${url} failed`, error as Error, { ...ctx, duration });
      throw error;
    }
  }

  /**
   * Make PUT request with logging
   */
  async put<T = any>(
    url: string,
    data?: any,
    options?: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    const startTime = Date.now();
    const ctx = options?.ctx || { module: 'ApiHelper' };

    try {
      logger.debug(`PUT ${url}`, ctx);
      const response = await this.client.put<T>(url, data, options);
      const duration = Date.now() - startTime;

      logger.logApiCall('PUT', url, response.status, duration, ctx);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`PUT ${url} failed`, error as Error, { ...ctx, duration });
      throw error;
    }
  }

  /**
   * Make DELETE request with logging
   */
  async delete<T = any>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    const startTime = Date.now();
    const ctx = options?.ctx || { module: 'ApiHelper' };

    try {
      logger.debug(`DELETE ${url}`, ctx);
      const response = await this.client.delete<T>(url, options);
      const duration = Date.now() - startTime;

      logger.logApiCall('DELETE', url, response.status, duration, ctx);
      return {
        status: response.status,
        data: response.data,
        headers: response.headers,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`DELETE ${url} failed`, error as Error, { ...ctx, duration });
      throw error;
    }
  }

  /**
   * Set authorization header
   */
  setAuthorizationHeader(token: string, scheme: string = 'Bearer'): void {
    this.client.defaults.headers.common['Authorization'] = `${scheme} ${token}`;
    logger.debug(`Authorization header set`, { module: 'ApiHelper' });
  }

  /**
   * Set custom headers
   */
  setHeaders(headers: Record<string, string>): void {
    Object.assign(this.client.defaults.headers.common, headers);
    logger.debug(`Custom headers set`, { module: 'ApiHelper' }, { headerKeys: Object.keys(headers) });
  }

  /**
   * Get axios instance for advanced usage
   */
  getClient(): AxiosInstance {
    return this.client;
  }
}

export default ApiHelper;
