import { PackageStatus } from '../models/speedtrack.models';

// 1. User-Friendly Labels
export const STATUS_LABELS: Record<PackageStatus, string> = {
  // Initial Stages
  [PackageStatus.WAITING_ASSIGNMENT]: 'Chegou ao centro de distribuição',
  [PackageStatus.WAITING_WITHDRAWAL]: 'Pronto para coleta',
  
  // Forward Logistics (Going to customer)
  [PackageStatus.WITH_COURIER]: 'Coletado pelo entregador',
  [PackageStatus.OUT_FOR_DELIVERY]: 'Saiu para entrega',
  [PackageStatus.DELIVERED]: 'Entregue',
  
  // Issues & Reverse Logistics
  [PackageStatus.DELIVERY_ISSUES]: 'Insucesso na entrega', // NEW
  [PackageStatus.RETURN_TO_WAREHOUSE_PENDING]: 'Retornando ao centro de distribuição', // NEW
  [PackageStatus.RETURNED_WAREHOUSE]: 'Devolvido ao centro de distribuição',
  [PackageStatus.RETURNED_SENDER]: 'Devolvido ao remetente'
};

// 2. CSS Classes (Colors)
export const STATUS_CLASSES: Record<PackageStatus, string> = {
  // Yellow/Orange (Waiting)
  [PackageStatus.WAITING_ASSIGNMENT]: 'status-waiting',
  [PackageStatus.WAITING_WITHDRAWAL]: 'status-waiting',
  [PackageStatus.RETURN_TO_WAREHOUSE_PENDING]: 'status-waiting', // Reuse waiting style
  
  // Blue (In Motion)
  [PackageStatus.WITH_COURIER]: 'status-in-transit',
  [PackageStatus.OUT_FOR_DELIVERY]: 'status-in-transit',
  
  // Green (Success)
  [PackageStatus.DELIVERED]: 'status-delivered',
  
  // Red (Issues/Returns)
  [PackageStatus.DELIVERY_ISSUES]: 'status-returned', // Reuse red style
  [PackageStatus.RETURNED_WAREHOUSE]: 'status-returned',
  [PackageStatus.RETURNED_SENDER]: 'status-returned'
};