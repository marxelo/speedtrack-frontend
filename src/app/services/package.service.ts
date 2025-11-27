import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Package,
  CreatePackageDTO,
  PackageStatus,
  DashboardStats,
  User,
} from '../models/speedtrack.models';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  private apiUrl = `${environment.apiUrl}/packages`;
  private dashboardUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  // --- Dashboard ---
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.dashboardUrl}/stats`);
  }

  // --- Packages ---
  getPackages(filters?: {
    status?: string;
    partner?: string;
    courierId?: number;
  }): Observable<Package[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.partner) params = params.set('partner', filters.partner);
      if (filters.courierId) params = params.set('courierId', filters.courierId);
    }

    return this.http.get<Package[]>(this.apiUrl, { params });
  }

  getPackageById(id: number): Observable<Package> {
    return this.http.get<Package>(`${this.apiUrl}/${id}`);
  }

  createPackage(dto: CreatePackageDTO): Observable<Package> {
    return this.http.post<Package>(this.apiUrl, dto);
  }

  // --- Actions ---
  // Update the signature to accept number | undefined
  updateStatus(id: number, newStatus: PackageStatus, notes?: string, courierId?: number): Observable<Package> {
    let params = new HttpParams().set('newStatus', newStatus);

    if (notes) params = params.set('notes', notes);
    if (courierId) params = params.set('courierId', courierId); // Send ID now

    return this.http.patch<Package>(`${this.apiUrl}/${id}/status`, {}, { params });
  }

  // Helper to get available couriers for the dropdown
  getCouriers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users/couriers`);
  }
}
