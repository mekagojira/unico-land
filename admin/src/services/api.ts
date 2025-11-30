import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // If sending FormData, remove Content-Type header to let axios set it automatically with boundary
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Content {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  type: "page" | "post" | "news" | "announcement";
  status: "draft" | "published" | "archived";
  featuredImage?: string;
  authorId: string;
  author?: User;
  locale: "jp" | "vi";
  metadata?: Record<string, any>;
  publishedAt?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>("/api/auth/me");
    return response.data;
  },
};

// Content API
export const contentAPI = {
  getAll: async (params?: {
    type?: string;
    status?: string;
    locale?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Content>> => {
    const response = await api.get<PaginatedResponse<Content>>("/api/content", {
      params,
    });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Content>> => {
    const response = await api.get<ApiResponse<Content>>(`/api/content/${id}`);
    return response.data;
  },

  getBySlug: async (
    slug: string,
    locale?: string
  ): Promise<ApiResponse<Content>> => {
    const response = await api.get<ApiResponse<Content>>(
      `/api/content/slug/${slug}`,
      {
        params: { locale },
      }
    );
    return response.data;
  },

  create: async (data: Partial<Content>): Promise<ApiResponse<Content>> => {
    const response = await api.post<ApiResponse<Content>>("/api/content", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<Content>
  ): Promise<ApiResponse<Content>> => {
    const response = await api.put<ApiResponse<Content>>(
      `/api/content/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/api/content/${id}`);
    return response.data;
  },
};

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
  titleJp: string;
  titleVi: string;
  descriptionJp: string;
  descriptionVi: string;
  contentJp?: string;
  contentVi?: string;
  images: string[];
  icon?: string;
  orderIndex: number;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

// Company API
export const companyAPI = {
  get: async (): Promise<ApiResponse<CompanyInfo>> => {
    const response = await api.get<ApiResponse<CompanyInfo>>("/api/company");
    return response.data;
  },

  update: async (
    data: Partial<CompanyInfo>
  ): Promise<ApiResponse<CompanyInfo>> => {
    const response = await api.put<ApiResponse<CompanyInfo>>(
      "/api/company",
      data
    );
    return response.data;
  },
};

// Services API
export const servicesAPI = {
  getAll: async (params?: {
    active?: boolean;
    locale?: string;
  }): Promise<ApiResponse<Service[]>> => {
    const response = await api.get<ApiResponse<Service[]>>("/api/services", {
      params,
    });
    return response.data;
  },

  getById: async (
    id: string,
    locale?: string
  ): Promise<ApiResponse<Service>> => {
    const response = await api.get<ApiResponse<Service>>(
      `/api/services/${id}`,
      {
        params: { locale },
      }
    );
    return response.data;
  },

  create: async (data: Partial<Service>): Promise<ApiResponse<Service>> => {
    const response = await api.post<ApiResponse<Service>>(
      "/api/services",
      data
    );
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<Service>
  ): Promise<ApiResponse<Service>> => {
    const response = await api.put<ApiResponse<Service>>(
      `/api/services/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/api/services/${id}`);
    return response.data;
  },
};

// Upload API
export const uploadAPI = {
  // Upload file through backend (backend handles R2 upload)
  // Returns key (for storage) and presignedUrl (for immediate preview)
  upload: async (
    file: File,
    folder?: string
  ): Promise<
    ApiResponse<{
      key: string;
      presignedUrl?: string; // Temporary presigned URL for immediate preview
      fileName: string;
      originalName: string;
      size: number;
      mimetype: string;
      folder: string;
    }>
  > => {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) {
      formData.append("folder", folder);
    }
    // Don't set Content-Type header - axios will set it automatically with boundary for FormData
    const response = await api.post<
      ApiResponse<{
        key: string;
        presignedUrl?: string;
        fileName: string;
        originalName: string;
        size: number;
        mimetype: string;
        folder: string;
      }>
    >("/api/upload", formData);
    return response.data;
  },

  uploadMultiple: async (
    files: File[],
    folder?: string
  ): Promise<
    ApiResponse<
      Array<{
        key: string;
        presignedUrl?: string; // Temporary presigned URL for immediate preview
        fileName: string;
        originalName: string;
        size: number;
        mimetype: string;
        folder: string;
      }>
    >
  > => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    if (folder) {
      formData.append("folder", folder);
    }
    // Don't set Content-Type header - axios will set it automatically with boundary for FormData
    const response = await api.post<
      ApiResponse<
        Array<{
          key: string;
          presignedUrl?: string;
          fileName: string;
          originalName: string;
          size: number;
          mimetype: string;
          folder: string;
        }>
      >
    >("/api/upload/multiple", formData);
    return response.data;
  },

  delete: async (key: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(
      `/api/upload/${encodeURIComponent(key)}`
    );
    return response.data;
  },
};

export default api;
