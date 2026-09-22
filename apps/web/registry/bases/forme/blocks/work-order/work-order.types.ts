export type WorkOrderPriority = "Low" | "Medium" | "High" | "Urgent";

export interface WorkOrderCustomer {
  name: string;
  address: string;
  phone: string;
  email?: string;
  accountNumber?: string;
}

export type WorkOrderJobType =
  | "Repair"
  | "Installation"
  | "Maintenance"
  | "Inspection"
  | string;

export interface WorkOrderEquipment {
  description: string;
  makeModel?: string;
  serialNumber?: string;
  location?: string;
}

export interface WorkOrderPart {
  partNumber: string;
  description: string;
  qty: number;
  unitPrice: number;
}

export interface WorkOrderLabor {
  description: string;
  technician: string;
  hours: number;
  rate: number;
}

export interface WorkOrderData {
  companyName: string;
  companyLogo?: string;
  workOrderNumber: string;
  date: string;
  priority: WorkOrderPriority;
  customer: WorkOrderCustomer;
  technician: string;
  jobType: WorkOrderJobType;
  equipment: WorkOrderEquipment;
  parts: WorkOrderPart[];
  labor: WorkOrderLabor[];
  taxRate?: number;
  technicianNotes?: string;
  customerNotes?: string;
  warrantyInfo?: string;
  accentColor?: string;
  renderingBase?: "takumi" | "forme";
}
