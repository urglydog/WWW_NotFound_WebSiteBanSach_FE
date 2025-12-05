/**
 * API Client Configuration
 * Base configuration for making HTTP requests to the backend
 */

// Get API URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Validate API URL in development
if (process.env.NODE_ENV === "development") {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.warn(
      "⚠️ NEXT_PUBLIC_API_URL is not set in .env file. Using default: http://localhost:8080/api"
    )
    console.warn("Please create a .env file with: NEXT_PUBLIC_API_URL=http://localhost:8080/api")
  } else {
    console.log("✅ API Base URL:", API_BASE_URL)
  }
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Get token from localStorage if exists
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", errorData);
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();

      // Unwrap Spring Boot response: {code, message, result}
      if (data && typeof data === "object" && "result" in data) {
        return data.result as T;
      }

      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network request failed");
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let queryString = "";
    if (params) {
      // Filter out undefined values
      const filteredParams = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      if (Object.keys(filteredParams).length > 0) {
        queryString = "?" + new URLSearchParams(filteredParams).toString();
      }
    }

    return this.request<T>(`${endpoint}${queryString}`, {
      method: "GET",
    });
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Upload failed");
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
