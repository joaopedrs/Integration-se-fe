export interface SystemLog {
  id: number;
  userId: number;
  actionDate: string;
  actionType: number;
  actionTypeName: string;
  application: number;
  applicationName: string;
  logLevel: number;
  logLevelName: string;
  description: string;
  ipAddress: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface LogFilter {
  pageNumber: number;
  pageSize: number;
  userId?: number;
  startDate?: string;
  endDate?: string;
  actionType?: number;
  application?: number;
  logLevel?: number;
  description?: string;
  ipAddress?: string;
}