import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { forkJoin } from 'rxjs';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { WorkItemService } from '../../core/services/work-item.service';
import { WorkItemDto, WorkItemFilter, UpdateWorkItem } from '../../core/models/work-item.model';
import { WorkitemDialogComponent } from './workitem-dialog/workitem-dialog.component';

@Component({
  selector: 'app-Workitems',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatCheckboxModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatPaginatorModule, MatDialogModule, MatSnackBarModule
  ],
  templateUrl: './workitems.component.html',
  styleUrls: ['./workitems.component.scss'] // Use o mesmo estilo global de crud-container
})
export class WorkitemsComponent implements OnInit {
  displayedColumns: string[] = [
    'select', 'id', 'azureId', 'itsmId', 'product', 'azureWorkItemType', 
    'azureState', 'azureBoardColumn', 'azureAssignedTo', 'itsmClient', 'status'
  ];
  
  dataSource = new MatTableDataSource<WorkItemDto>([]);
  selection = new SelectionModel<WorkItemDto>(true, []);

  totalItems = 0;
  pageSize = 20;
  pageIndex = 0;
  isLoading = false;

  // Filtros locais
  filterItsmId: string = '';
  filterAzureId: number | null = null;

  constructor(
    private workItemService: WorkItemService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    
    const filter: WorkItemFilter = {
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
      itsmId: this.filterItsmId || undefined,
      azureId: this.filterAzureId || undefined
    };

    this.workItemService.getWorkItems(filter).subscribe({
      next: (res) => {
        this.dataSource.data = res.data;
        this.totalItems = res.totalCount;
        this.selection.clear();
        this.isLoading = false;
      },
      error: () => {
        this.showMessage('Erro ao carregar chamados');
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.pageIndex = 0; // Volta para a primeira página
    this.loadData();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  openSetProductDialog(): void {
    const dialogRef = this.dialog.open(WorkitemDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(productId => {
      if (productId) {
        this.updateSelectedProducts(productId);
      }
    });
  }

  private updateSelectedProducts(newProductId: number): void {
    const selectedItems = this.selection.selected;
    
    const updateRequests = selectedItems.map(item => {
      const updateData: UpdateWorkItem = {
        productId: newProductId
      };
      return this.workItemService.updateWorkItem(item.id, updateData);
    });

    this.isLoading = true;
    forkJoin(updateRequests).subscribe({
      next: () => {
        this.showMessage(`${selectedItems.length} chamado(s) atualizado(s) com sucesso!`);
        this.loadData(); 
      },
      error: (err) => {
        this.showMessage('Ocorreu um erro ao atualizar os chamados.');
        this.isLoading = false;
      }
    });
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', { duration: 3000, horizontalPosition: 'center' });
  }
}