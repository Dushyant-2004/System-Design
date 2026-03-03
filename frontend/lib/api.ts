const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Design {
  _id: string;
  title: string;
  prompt: string;
  status: 'generating' | 'completed' | 'failed';
  structuredAIResponse: StructuredAIResponse;
  generationTimeMs?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Microservice {
  name: string;
  description: string;
  responsibilities: string[];
  dependencies: string[];
  techStack: string[];
}

export interface DatabaseField {
  name: string;
  type: string;
  constraints: string;
}

export interface DatabaseTable {
  name: string;
  fields: DatabaseField[];
}

export interface DatabaseSchema {
  name: string;
  type: 'SQL' | 'NoSQL' | 'Graph' | 'TimeSeries' | 'Cache';
  tables: DatabaseTable[];
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  auth: boolean;
}

export interface ApiService {
  service: string;
  endpoints: ApiEndpoint[];
}

export interface CacheLayer {
  name: string;
  description: string;
  ttl: string;
}

export interface CachingStrategy {
  approach: string;
  tools: string[];
  layers: CacheLayer[];
}

export interface LoadBalancing {
  approach: string;
  algorithm: string;
  tools: string[];
  details: string;
}

export interface ScalingStrategy {
  horizontal: {
    description: string;
    services: string[];
    autoScalingRules: string[];
  };
  vertical: {
    description: string;
    services: string[];
  };
}

export interface InfraService {
  name: string;
  purpose: string;
}

export interface Infrastructure {
  cloudProvider: string;
  services: InfraService[];
  regions: string[];
  estimatedCost: string;
}

export interface FlowStep {
  step: number;
  action: string;
  from: string;
  to: string;
  description: string;
}

export interface SystemFlow {
  description: string;
  steps: FlowStep[];
}

export interface StructuredAIResponse {
  microservices: Microservice[];
  databaseSchema: DatabaseSchema[];
  apiEndpoints: ApiService[];
  cachingStrategy: CachingStrategy;
  loadBalancing: LoadBalancing;
  scalingStrategy: ScalingStrategy;
  infrastructure: Infrastructure;
  systemFlow: SystemFlow;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, any>;
  message?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || `Request failed with status ${response.status}`,
          response.status,
          data.details
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          'Unable to connect to the server. Please ensure the backend is running.',
          0
        );
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
        500
      );
    }
  }

  async generateDesign(prompt: string, title?: string): Promise<ApiResponse<Design>> {
    return this.request<ApiResponse<Design>>('/designs', {
      method: 'POST',
      body: JSON.stringify({ prompt, title }),
    });
  }

  async getDesigns(
    page = 1,
    limit = 12,
    search?: string
  ): Promise<ApiResponse<Design[]> & { meta: any }> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    return this.request(`/designs?${params.toString()}`);
  }

  async getDesign(id: string): Promise<ApiResponse<Design>> {
    return this.request<ApiResponse<Design>>(`/designs/${id}`);
  }

  async deleteDesign(id: string): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(`/designs/${id}`, { method: 'DELETE' });
  }

  async healthCheck(): Promise<any> {
    return this.request('/health');
  }
}

export class ApiError extends Error {
  status: number;
  details?: string[];

  constructor(message: string, status: number, details?: string[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export const api = new ApiClient(API_URL);
