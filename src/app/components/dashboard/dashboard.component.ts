import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PackageService } from '../../services/package.service';
import { DashboardStats, Package } from '../../models/speedtrack.models';
import { map, Observable } from 'rxjs';
import { StatusNamePipe, StatusClassPipe } from '../../pipes/status.pipes';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusNamePipe, StatusClassPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats$!: Observable<DashboardStats>;
  recentPackages$!: Observable<Package[]>;

  constructor(private packageService: PackageService) {}

  ngOnInit(): void {
    // We just assign the stream, we don't subscribe manually
    this.stats$ = this.packageService.getDashboardStats();
    
    // For sorting, we can pipe the result
    this.recentPackages$ = this.packageService.getPackages().pipe(
      map(packages => packages
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
      )
    );
  }

}