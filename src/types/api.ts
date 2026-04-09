export interface ApiResponse<T = void> {
  data: T;
  message?: string;
}

export interface PaginatedMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
