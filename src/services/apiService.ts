/* eslint-disable @typescript-eslint/no-explicit-any */

interface ApiRequestConfig {
    url: string;
    method: 'GET' | 'POST';
    body?: any;
    headers?: Record<string, string>;
}

interface ApiResponse<T = any> {
    data: T | null;
    status: number;
    success: boolean;
    message?: string;
}

class ApiService {
    // private baseURL: string; DEFINED THE PROXY IN vite.config.js
    private defaultHeaders: Record<string, string>;

    // constructor(baseURL: string = '') {
    // this.baseURL = baseURL;

    constructor() {
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    async apiCall<T = any>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
        try {
            const { url, method, body, headers } = config;
            const requestConfig: RequestInit = {
                method,
                headers: {
                    ...this.defaultHeaders,
                    ...headers,
                },
            };

            if (body && method !== 'GET') {
                requestConfig.body = JSON.stringify(body);
            }

            const response = await fetch(url, requestConfig);

            let responseData;
            const contentType = response.headers.get('Content-Type');

            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            } else {
                responseData = await response.text();
            }

            if (response.ok) {
                return {
                    data: responseData,
                    status: response.status,
                    success: true,
                    message: 'Request successful'
                };
            } else {
                return {
                    data: responseData,
                    status: response.status,
                    success: false,
                    message: responseData
                };
            }
        } catch (error) {
            console.error('API call failed:', error);
            return {
                data: null,
                status: 0,
                success: false,
                message: error instanceof Error ? error.message : 'Network error occurred'
            };
        }
    }

    async get<T = any>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.apiCall<T>({ url, method: 'GET', headers });
    }

    async post<T = any>(url: string, body?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.apiCall<T>({ url, method: 'POST', body, headers });
    }
}

// 'http://localhost:8860'
const apiService = new ApiService();

export default apiService;
export { ApiService };