export interface Squad {
  id: number;
  description: string;
  isActive: boolean;
  productIds: number[];
}

export interface CreateUpdateSquad {
  description: string;
  isActive: boolean;
  productIds: number[]; 
}
  
export interface ManageSquadLinks {
  squadId: number;
  productIds: number[];
  userIds: number[];
}