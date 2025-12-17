export type Role = 'CUSTOMER' | 'ADMIN' | 'WORKER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Fabric {
  id: string;
  name: string;
  pricePerMeter: number;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isCustomizable: boolean;
  fabrics?: string[]; // IDs of available fabrics
}

export interface Measurement {
  neck?: number;
  chest?: number;
  waist?: number;
  shoulder?: number;
  sleeveLength?: number;
  length?: number;
  inseam?: number;
  hip?: number;
  specialInstructions?: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'READY' | 'DELIVERED';
export type WorkflowStage = 'CUTTING' | 'SEWING' | 'FINISHING' | 'PRESSING' | 'DONE';

export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  isCustom: boolean;
  selectedFabric?: string;
  selectedSize?: string;
  measurements?: Measurement;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  advanceAmount: number;
  dueAmount: number;
  status: OrderStatus;
  workflowStage?: WorkflowStage;
  date: string;
  assignedWorkerId?: string;
}

export interface Worker {
  id: string;
  name: string;
  role: 'TAILOR' | 'CUTTER' | 'FINISHER' | 'PRESSER';
  activeOrders: number;
  performanceRating?: number;
}
