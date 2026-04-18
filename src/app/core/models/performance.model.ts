export interface PerformanceUser {
    id: number;
    name: string;
  }
  
  export interface PerformanceSquad {
    id: number;
    description: string;
  }
  
  export interface PerformanceFilterOptions {
    users: PerformanceUser[];
    squads: PerformanceSquad[];
  }
  
  export interface PerformanceFilter {
    startDate: string; // ISO string
    endDate: string;
    viewType: 'month' | 'week';
    userIds: number[];
    squadIds: number[];
  }
  
  export interface PerformanceDataset {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }
  
  export interface PerformanceChartResult {
    labels: string[];
    datasets: PerformanceDataset[];
  }