export interface WorkItemCountByBu {
    businessUnitId: number;
    businessUnit: string;
    total: number;
  }
    
  export interface WorkItemCountByProduct {
    productId: number;
    product: string;
    businessUnitId: number;
    businessUnit: string;
    total: number;
  }
  
  export interface WorkItemCountByColumn {
    boardColumn: string;
    total: number;
  }
    
  export interface WorkItemFilter {
    pageNumber?: number;
    pageSize?: number;
    productIds?: number[];
    businessUnitIds?: number[];
    statuses?: number[]; 
    providers?: number[]; 
    boardColumns?: string[];
    olderThanDays?: number;
  }

  export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface WorkItemDto {
  id: number;
  azureId?: number;
  itsmId: string;
  product: string;
  azureWorkItemType: string;
  azureState: string;
  azureBoardColumn: string;
  azureAssignedTo: string;
  azureCreatedDate: Date;
  itsmClient: string;
  itsmAnalyst: string;
  itsmCriticality: string;
  itsmProblem: string;
  itsmSLAStart: string;
  itsmSLA: string;
  totalTimeSpend: string;
  retry: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  }
  
  export interface WorkItemDto {
    id: number;
    azureId?: number;
    itsmId: string;
    product: string;
    azureWorkItemType: string;
    azureState: string;
    azureBoardColumn: string;
    azureAssignedTo: string;
    azureCreatedDate: Date;
    itsmClient: string;
    itsmAnalyst: string;
    itsmCriticality: string;
    itsmProblem: string;
    itsmSLAStart: string;
    itsmSLA: string;
    totalTimeSpend: string;
    retry: number;
  }