
export interface Machine {
  id: string;
  name: string;
  capacity: number; // kg per batch
  status: 'available' | 'roasting' | 'maintenance';
}

export interface Order {
  id: string;
  clientName: string;
  weight: number; // kg
  beanType: string;
  machineId: string;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'in-progress' | 'completed';
}

export type ViewType = 'dashboard' | 'machines' | 'orders' | 'gantt';
