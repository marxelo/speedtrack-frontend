import { Pipe, PipeTransform } from '@angular/core';
import { PackageStatus } from '../models/speedtrack.models';
import { STATUS_LABELS, STATUS_CLASSES } from '../utils/package-status.utils';

// Pipe 1: Converts Enum to Text (e.g., WAITING -> "Aguardando...")
@Pipe({
  name: 'statusName',
  standalone: true
})
export class StatusNamePipe implements PipeTransform {
  transform(value: PackageStatus | string): string {
    return STATUS_LABELS[value as PackageStatus] || value;
  }
}

// Pipe 2: Converts Enum to CSS Class (e.g., WAITING -> "status-waiting")
@Pipe({
  name: 'statusClass',
  standalone: true
})
export class StatusClassPipe implements PipeTransform {
  transform(value: PackageStatus | string): string {
    return STATUS_CLASSES[value as PackageStatus] || '';
  }
}