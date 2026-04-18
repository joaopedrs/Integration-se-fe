export interface Product {
    id: number;
    description: string;
    nickname: string;
    businessUnitId: number;
    businessUnitName?: string;
  }
  
  export interface CreateUpdateProduct {
    description: string;
    nickname: string;
    businessUnitId: number;
  }