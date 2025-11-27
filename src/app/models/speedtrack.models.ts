// Enums matching Java Enums
export enum PackageStatus {
  WAITING_ASSIGNMENT = 'WAITING_ASSIGNMENT',
  WAITING_WITHDRAWAL = 'WAITING_WITHDRAWAL',
  RETURN_TO_WAREHOUSE_PENDING = 'RETURN_TO_WAREHOUSE_PENDING',
  WITH_COURIER = 'WITH_COURIER',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  RETURNED_WAREHOUSE = 'RETURNED_WAREHOUSE',
  RETURNED_SENDER = 'RETURNED_SENDER',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  COURIER = 'COURIER',
}

// User Interface
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  token?: string; // JWT Token
}

// Package Item Interface
export interface PackageItem {
  id?: number;
  description: string;
  quantity: number;
}

// Package History Interface
export interface PackageHistory {
  id: number;
  actionDate: string; // ISO String
  actionType: string;
  statusSnapshot: PackageStatus;
  notes?: string;
}

// Main Package Interface
export interface Package {
  id: number;
  trackingCode: string;
  partnerCode: string;
  partnerName: string;
  recipientName: string;
  recipientAddress: string;
  recipientCity: string;
  recipientState: string;
  recipientPhone: string;
  currentStatus: PackageStatus;
  currentCourier?: User;
  createdAt: string;
  items: PackageItem[];
  history: PackageHistory[];
}

// DTO for Creating a Package
export interface CreatePackageDTO {
  partnerCode: string;
  partnerName: string;
  recipientName: string;
  recipientAddress: string;
  recipientCity: string;
  recipientState: string;
  recipientPhone: string;
  items: PackageItem[];
}

// Dashboard Stats Interface
export interface DashboardStats {
  waiting: number;
  transit: number;
  delivered: number;
  issues: number;
}
