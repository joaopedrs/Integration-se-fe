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
    itsmId?: string;
    azureId?: number;
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
  productId?: number;
  productName: string;
  businessUnitId?: number;
  businessUnitName: string;
  WorkItemTypeId?: number;
  WorkItemTypeName: string;
  itsmProvider: string;
  azureWorkItemType: string;
  azureState: string;
  azureBoardColumn: string;
  azureAssignedTo: string;
  azureCreatedDate: Date;
  azureClosedDate?: Date;
  azureClassification: string;
  azureConclusion: string;
  itsmClient: string;
  itsmProduct: string;
  itsmAnalystId: string;
  itsmAnalyst: string;
  itsmCriticality: string;
  itsmProblem: string;
  itsmAnalystProblem: string;
  itsmCreatedDate?: Date;
  itsmStatus: string;
  itsmSLAStart: string;
  itsmSLA: string;
  itsmSLAEnd: string;
  totalTimeSpend: string;
  retry: number;
  status: string;
}

export interface UpdateWorkItem {
  productId?: number;
  workItemTypeId?: number;
  itsmProvider?: string | number;
  azureWorkItemType?: string;
  azureState?: string;
  azureBoardColumn?: string;
  azureAssignedTo?: string;
  azureCreatedDate?: Date;
  azureClosedDate?: Date;
  azureClassification?: string;
  azureConclusion?: string;
  itsmClient?: string;
  itsmProduct?: string;
  itsmAnalystId?: string;
  itsmAnalyst?: string;
  itsmCriticality?: string | number;
  itsmProblem?: string;
  itsmAnalystProblem?: string;
  itsmCreatedDate?: Date;
  itsmStatus?: string;
  itsmSLAStart?: string;
  itsmSLA?: string;
  itsmSLAEnd?: string;
  totalTimeSpend?: string;
  retry?: number;
  status?: string | number;
}