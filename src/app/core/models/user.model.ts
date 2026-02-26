export interface User {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: string;
    lastLogin?: string;
    role: number | string;
  }
  
  export interface CreateUserDto {
    name: string;
    email: string;
    password?: string;
    role: number | string;
  }
  
  export interface UpdateUserDto {
    name: string;
    email: string;
    isActive: boolean;
    password?: string;
  }