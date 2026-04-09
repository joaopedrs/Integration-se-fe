import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core'; 
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { forkJoin } from 'rxjs';
import { WorkItemService } from '../../core/services/work-item.service';
import { WorkItemCountByBu, WorkItemCountByProduct, WorkItemCountByColumn, WorkItemFilter, WorkItemDto } from '../../core/models/work-item.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MatRippleModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  businessUnits: WorkItemCountByBu[] = [];
  allProducts: WorkItemCountByProduct[] = [];
  filteredProducts: WorkItemCountByProduct[] = [];
  boardColumns: WorkItemCountByColumn[] = [];
  agedItemsCount: number = 0;
  
  // Estado Global dos Filtros
  globalFilter: WorkItemFilter = {
    statuses: [2, 3, 4] ,
    providers: [1, 2, 3, 4, 5, 6]
  };

  selectedBuId: number | null = null;
  selectedProductId: number | null = null;
  selectedColumn: string | null = null;
  selectedAged: boolean = false;
  
  isLoading = true;

  // Estado da Tabela
  workItems: WorkItemDto[] = [];
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  isTableLoading = false;
  displayedColumns: string[] = [
    'id', 'azureId', 'itsmId', 'product', 'azureWorkItemType', 
    'azureState', 'azureBoardColumn', 'azureAssignedTo', 'azureCreatedDate', 
    'itsmClient', 'itsmAnalyst', 'itsmCriticality', 'itsmProblem', 
    'itsmSLAStart', 'itsmSLA', 'totalTimeSpend', 'retry'
  ];

  constructor(private workItemService: WorkItemService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  // MÉTODO QUE ATUALIZA OS GRÁFICOS (Regra da Cascata)
  loadDashboardData(): void {
    this.isLoading = true;
    
    // 1. Filtro do Topo: Só sabe dos status e de si mesmo. (NUNCA recebe BU ou Produto)
    const topFilter: WorkItemFilter = {
      statuses: this.globalFilter.statuses,
      boardColumns: this.globalFilter.boardColumns,
      olderThanDays: this.globalFilter.olderThanDays
    };

    // Ajuste para as colunas não sumirem ao clicar nelas próprias
    const columnFilter = { ...topFilter, boardColumns: undefined };

    // 2. Filtro da BU: Sabe do Topo, mas NUNCA sabe qual a BU nem o Produto clicado
    const buFilter: WorkItemFilter = {
      statuses: this.globalFilter.statuses,
      boardColumns: this.globalFilter.boardColumns,
      olderThanDays: this.globalFilter.olderThanDays
    };

    // 3. Filtro de Produtos: Sabe do Topo e da BU, mas NUNCA sabe o Produto clicado
    const productFilter: WorkItemFilter = {
      statuses: this.globalFilter.statuses,
      boardColumns: this.globalFilter.boardColumns,
      olderThanDays: this.globalFilter.olderThanDays,
      businessUnitIds: this.globalFilter.businessUnitIds // Recebe a BU para filtrar a base correta
    };

    forkJoin({
      bus: this.workItemService.getCountByBu(buFilter),
      products: this.workItemService.getCountByProduct(productFilter),
      columns: this.workItemService.getCountByColumn(columnFilter),
      aged: this.workItemService.getAgedCount(5, topFilter)
    }).subscribe({
      next: (res) => {
        this.businessUnits = res.bus;
        this.allProducts = res.products;
        this.boardColumns = res.columns;
        this.agedItemsCount = res.aged;
        
        this.updateProductsView();
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });

    // Como estamos a recarregar o Dashboard, recarregamos também a tabela
    this.loadTableData();
  }

  // MÉTODO ISOLADO PARA A TABELA (Sabe de TODOS os filtros)
  loadTableData(): void {
    this.isTableLoading = true;
    this.globalFilter.pageNumber = this.pageIndex + 1;
    this.globalFilter.pageSize = this.pageSize;

    this.workItemService.getWorkItems(this.globalFilter).subscribe({
      next: (res) => {
        this.workItems = res.data;
        this.totalItems = res.totalCount;
        this.isTableLoading = false;
      },
      error: () => this.isTableLoading = false
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTableData(); // Mudança de página SÓ recarrega a tabela
  }

  updateProductsView(): void {
    if (this.selectedBuId !== null) {
      this.filteredProducts = this.allProducts.filter(p => p.businessUnitId === this.selectedBuId);
    } else {
      this.filteredProducts = [];
    }
  }

  selectColumn(column: string): void {
    this.selectedColumn = this.selectedColumn === column ? null : column;
    this.globalFilter.boardColumns = this.selectedColumn ? [this.selectedColumn] : undefined;
    
    // Nível Topo mudou -> Afeta tudo, recarrega Dashboard
    this.resetPaginationAndReload();
  }

  toggleAgedFilter(): void {
    this.selectedAged = !this.selectedAged;
    this.globalFilter.olderThanDays = this.selectedAged ? 5 : undefined;
    
    // Nível Topo mudou -> Afeta tudo, recarrega Dashboard
    this.resetPaginationAndReload();
  }

  selectBu(buId: number): void {
    this.selectedBuId = this.selectedBuId === buId ? null : buId;
    this.globalFilter.businessUnitIds = this.selectedBuId ? [this.selectedBuId] : undefined;
    
    // Limpa o produto caso exista
    this.selectedProductId = null;
    this.globalFilter.productIds = undefined;

    // Nível Meio mudou -> Afeta os produtos, recarrega Dashboard
    this.resetPaginationAndReload();
  }

  selectProduct(productId: number): void {
    this.selectedProductId = this.selectedProductId === productId ? null : productId;
    this.globalFilter.productIds = this.selectedProductId ? [this.selectedProductId] : undefined;
    
    // Nível Base mudou -> Resetamos a página para 1...
    this.pageIndex = 0;
    this.globalFilter.pageNumber = 1;
    
    // A GRANDE MUDANÇA ESTÁ AQUI:
    // Chamamos APENAS a tabela. As BUs e as Colunas não sofrem requisição e ficam blindadas!
    this.loadTableData();
  }

  private resetPaginationAndReload(): void {
    this.pageIndex = 0;
    this.globalFilter.pageNumber = 1;
    this.loadDashboardData();
  }
}