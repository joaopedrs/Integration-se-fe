import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  isExpanded = true;
  isDashboardExpanded = false;

  toggleSidenav(): void {
    this.isExpanded = !this.isExpanded;
    
    if (!this.isExpanded) {
      this.isDashboardExpanded = false;
    }
  }

  toggleDashboard(): void {
    if (!this.isExpanded) {
      this.isExpanded = true;
      this.isDashboardExpanded = true;
    } else {
      this.isDashboardExpanded = !this.isDashboardExpanded;
    }
  }
}