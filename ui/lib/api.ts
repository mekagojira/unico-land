/**
 * API Client for UI
 * Handles all API requests to the backend with localStorage caching
 */

import { getCachedData, setCachedData, CacheKeys } from "./cache";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://land-api.uni-co-group.com";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CompanyInfo {
  id: string;
  name: string;
  nameEn: string;
  address: string;
  address2?: string;
  established: string;
  representative: string;
  license: string;
  organization?: string;
  phone: string;
  email: string;
  hours: string;
  closed?: string;
  logoUrl?: string;
  greeting?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  titleJp: string;
  titleVi: string;
  description: string;
  descriptionJp: string;
  descriptionVi: string;
  content?: string;
  contentJp?: string;
  contentVi?: string;
  images: string[];
  icon?: string;
  orderIndex: number;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      // Client-side fetch - no cache for dynamic data
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get company information
   */
  async getCompanyInfo(useCache: boolean = true): Promise<CompanyInfo> {
    const cacheKey = CacheKeys.COMPANY_INFO;

    // Check cache first
    if (useCache) {
      const cached = getCachedData<CompanyInfo>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Fetch from API
    const response = await this.request<CompanyInfo>("/api/company");
    const data = response.data;

    // Cache the result
    if (useCache) {
      setCachedData(cacheKey, data, CACHE_DURATION);
    }

    return data;
  }

  /**
   * Get all services
   * @param active - Only return active services
   * @param locale - Locale for localized fields (jp or vi)
   * @param useCache - Whether to use cache (default: true)
   */
  async getServices(
    active: boolean = true,
    locale: string = "jp",
    useCache: boolean = true
  ): Promise<Service[]> {
    const cacheKey = CacheKeys.SERVICES(locale, active);

    // Check cache first
    if (useCache) {
      const cached = getCachedData<Service[]>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Fetch from API
    const params = new URLSearchParams();
    if (active) {
      params.append("active", "true");
    }
    params.append("locale", locale);

    const response = await this.request<Service[]>(
      `/api/services?${params.toString()}`
    );
    const data = response.data;

    // Cache the result
    if (useCache) {
      setCachedData(cacheKey, data, CACHE_DURATION);
    }

    return data;
  }

  /**
   * Get a single service by ID
   * @param id - Service ID
   * @param locale - Locale for localized fields (jp or vi)
   * @param useCache - Whether to use cache (default: true)
   */
  async getService(
    id: string,
    locale: string = "jp",
    useCache: boolean = true
  ): Promise<Service> {
    const cacheKey = CacheKeys.SERVICE(id, locale);

    // Check cache first
    if (useCache) {
      const cached = getCachedData<Service>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Fetch from API
    const params = new URLSearchParams();
    params.append("locale", locale);

    const response = await this.request<Service>(
      `/api/services/${id}?${params.toString()}`
    );
    const data = response.data;

    // Cache the result
    if (useCache) {
      setCachedData(cacheKey, data, CACHE_DURATION);
    }

    return data;
  }
}

// Export singleton instance
export const api = new ApiClient();

// Export default for convenience
export default api;
