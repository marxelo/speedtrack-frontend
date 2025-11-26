import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <--- 1. Import this

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule], // <--- 2. Add to imports array
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  // No logic needed here for now
}