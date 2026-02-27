export interface AzurePersonalToken {
    id: number;
    name: string;
    value: string;
    createdAt: string;
    expirationAt: string;
    active: boolean;
  }
  
  export interface CreateAzurePersonalTokenDto {
    name: string;
    value: string;
    expirationAt: string | Date;
    active: boolean;
  }
  
  export interface UpdateAzurePersonalTokenDto {
    name: string;
    value: string;
    expirationAt: string | Date;
    active: boolean;
  }