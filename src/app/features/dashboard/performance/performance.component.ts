import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType, registerables, Chart } from 'chart.js';

import { PerformanceService } from '../../../core/services/performance.service';
import { PerformanceFilter, PerformanceFilterOptions, PerformanceChartResult } from '../../../core/models/performance.model';

Chart.register(...registerables);

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatIconModule, MatRippleModule,
    MatSelectModule, MatButtonToggleModule, NgChartsModule
  ],
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss']
})
export class PerformanceComponent implements OnInit {
  options: PerformanceFilterOptions = { users: [], squads: [] };
  isLoading = true;

  // Estado do Filtro
  filter: PerformanceFilter = {
    startDate: '',
    endDate: '',
    viewType: 'month',
    userIds: [],
    squadIds: []
  };

  // Configuração do Gráfico
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: { line: { tension: 0.3 } }, // Linhas curvas e suaves
    plugins: { legend: { position: 'top' } }
  };

  constructor(private performanceService: PerformanceService) {}

  ngOnInit(): void {
    this.setDefaultDates('month');
    this.loadFilters();
  }

  setDefaultDates(viewType: 'month' | 'week'): void {
    const today = new Date();
    this.filter.viewType = viewType;

    if (viewType === 'month') {
      // Últimos 3 meses
      const start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
      this.filter.startDate = start.toISOString();
      this.filter.endDate = today.toISOString();
    } else {
      // Mês atual inteiro
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      this.filter.startDate = start.toISOString();
      this.filter.endDate = today.toISOString();
    }
  }

  onViewTypeChange(value: 'month' | 'week'): void {
    this.setDefaultDates(value);
    this.loadChart();
  }

  loadFilters(): void {
    this.performanceService.getFilterOptions().subscribe({
      next: (res) => {
        this.options = res;
        this.isLoading = false;
        // Não carregamos o gráfico de cara se não houver ninguém selecionado, 
        // ou podemos carregar vazio.
        this.loadChart();
      },
      error: () => this.isLoading = false
    });
  }

  toggleSquad(squadId: number): void {
    const idx = this.filter.squadIds.indexOf(squadId);
    if (idx > -1) {
      this.filter.squadIds.splice(idx, 1);
    } else {
      this.filter.squadIds.push(squadId);
    }
    this.loadChart();
  }

  onUserSelectionChange(): void {
    this.loadChart();
  }

  loadChart(): void {
    // Se não tem ninguém selecionado, limpa o gráfico e aborta requisição
    if (this.filter.squadIds.length === 0 && this.filter.userIds.length === 0) {
      this.lineChartData = { labels: [], datasets: [] };
      return;
    }

    this.isLoading = true;
    this.performanceService.getChartData(this.filter).subscribe({
      next: (res: PerformanceChartResult) => {
        this.lineChartData = {
          labels: res.labels,
          datasets: res.datasets.map(d => ({
            data: d.data,
            label: d.label,
            borderColor: d.borderColor,
            backgroundColor: d.backgroundColor,
            fill: false
          }))
        };
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
}