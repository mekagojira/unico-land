/**
 * API Client for UI
 * Handles all API requests to the backend
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://unico-land-service.uni-co-group.com";

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
  orderIndex: number;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  type: string;
  status: string;
  featuredImage?: string;
  authorId: string;
  author?: { id: string; email?: string; username?: string };
  locale: string;
  publishedAt?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogListResponse {
  data: BlogPost[];
  pagination: { page: number; limit: number; total: number; pages: number };
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
      // Let the browser handle HTTP caching based on API Cache-Control headers
      cache: "default",
    });

    const json = await response.json();
    if (!response.ok) {
      const msg =
        (json && typeof json.message === "string" ? json.message : null) ||
        response.statusText;
      throw new Error(msg || `API request failed: ${response.status}`);
    }
    return json as ApiResponse<T>;
  }

  /**
   * Get company information
   */
  async getCompanyInfo(): Promise<CompanyInfo> {
    const response = await this.request<CompanyInfo>("/api/company");
    return response.data;
  }

  /**
   * Get all services
   * @param active - Only return active services
   * @param locale - Locale for localized fields (jp or vi)
   */
  async getServices(
    active: boolean = true,
    locale: string = "jp"
  ): Promise<Service[]> {
    const params = new URLSearchParams();
    if (active) {
      params.append("active", "true");
    }
    params.append("locale", locale);

    const response = await this.request<Service[]>(
      `/api/services?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Get a single service by ID
   * @param id - Service ID
   * @param locale - Locale for localized fields (jp or vi)
   */
  async getService(id: string, locale: string = "jp"): Promise<Service> {
    const params = new URLSearchParams();
    params.append("locale", locale);

    const response = await this.request<Service>(
      `/api/services/${id}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Get published blog posts (public)
   */
  async getBlogPosts(params?: {
    locale?: string;
    page?: number;
    limit?: number;
  }): Promise<BlogListResponse> {
    const search = new URLSearchParams();
    if (params?.locale) search.set("locale", params.locale);
    if (params?.page) search.set("page", String(params.page));
    if (params?.limit) search.set("limit", String(params.limit));
    const q = search.toString();
    const url = `${this.baseUrl}/api/blog${q ? `?${q}` : ""}`;
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      cache: "default",
    });
    const json = await res.json();
    if (!res.ok) {
      const msg =
        (json && typeof json.message === "string" ? json.message : null) ||
        res.statusText;
      throw new Error(msg || `API request failed: ${res.status}`);
    }
    return {
      data: json.data ?? [],
      pagination: json.pagination ?? {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
    };
  }

  /**
   * Get a single published blog post by slug (public)
   */
  async getBlogPost(slug: string, locale?: string): Promise<BlogPost> {
    const search = new URLSearchParams();
    if (locale) search.set("locale", locale);
    const q = search.toString();
    const response = await this.request<BlogPost>(
      `/api/blog/${encodeURIComponent(slug)}${q ? `?${q}` : ""}`
    );
    return response.data;
  }

  /**
   * Send contact message to admin (public)
   */
  async sendContactMessage(body: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }): Promise<{ id: string }> {
    const response = await this.request<{ id: string }>("/api/contact", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return response.data;
  }
}

// Export singleton instance
export const api = new ApiClient();

// Export default for convenience
export default api;
