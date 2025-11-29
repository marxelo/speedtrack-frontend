import { PackageStatus } from '../models/speedtrack.models';

// 1. Text Labels (Portuguese)
export const STATUS_LABELS: Record<PackageStatus, string> = {
    [PackageStatus.WAITING_ASSIGNMENT]: 'Aguardando Atribuição',
    [PackageStatus.WAITING_WITHDRAWAL]: 'Aguardando Retirada',
    [PackageStatus.WITH_COURIER]: 'Com Entregador',
    [PackageStatus.OUT_FOR_DELIVERY]: 'Saiu para Entrega',
    [PackageStatus.DELIVERED]: 'Entregue',
    [PackageStatus.RETURNED_WAREHOUSE]: 'Devolvida ao Armazém',
    [PackageStatus.RETURNED_SENDER]: 'Devolvida ao Contratante',
    [PackageStatus.RETURN_TO_WAREHOUSE_PENDING]: 'Devolução ao Armazém Pendente'
};

// 2. CSS Classes
export const STATUS_CLASSES: Record<PackageStatus, string> = {
    [PackageStatus.WAITING_ASSIGNMENT]: 'status-waiting',
    [PackageStatus.WAITING_WITHDRAWAL]: 'status-waiting',
    [PackageStatus.WITH_COURIER]: 'status-in-transit',
    [PackageStatus.OUT_FOR_DELIVERY]: 'status-in-transit',
    [PackageStatus.DELIVERED]: 'status-delivered',
    [PackageStatus.RETURNED_WAREHOUSE]: 'status-returned',
    [PackageStatus.RETURNED_SENDER]: 'status-returned',
    [PackageStatus.RETURN_TO_WAREHOUSE_PENDING]: 'status-returned'
};