import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { forkJoin } from 'rxjs';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatCheckboxModule,
    MatButtonModule, MatIconModule, MatDialogModule, 
    MatSnackBarModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'] // Reutilize o seu .crud-container do SCSS global
})
export class ProductsComponent implements OnInit {
  displayedColumns: string[] = ['select', 'id', 'description', 'nickname', 'businessUnit'];
  dataSource = new MatTableDataSource<Product>([]);
  selection = new SelectionModel<Product>(true, []);

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.selection.clear();
      },
      error: () => this.showMessage('Erro ao carregar produtos')
    });
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

  onAdd(): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, { 
      width: '95%', 
      maxWidth: '450px' 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.create(result).subscribe({
          next: () => {
            this.showMessage('Produto criado com sucesso!');
            this.loadProducts();
          },
          error: (err) => this.showMessage(err.error?.message || 'Erro ao criar produto')
        });
      }
    });
  }

  onEdit(): void {
    const selected = this.selection.selected[0];
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '95%',
      maxWidth: '450px',
      data: selected
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.update(selected.id, result).subscribe({
          next: () => {
            this.showMessage('Produto atualizado com sucesso!');
            this.loadProducts();
          },
          error: (err) => this.showMessage(err.error?.message || 'Erro ao atualizar produto')
        });
      }
    });
  }

  onDelete(): void {
    const itemsToDelete = this.selection.selected;
    
    if(confirm(`Tem certeza que deseja excluir ${itemsToDelete.length} produto(s)?`)) {
      const deleteRequests = itemsToDelete.map(item => this.productService.delete(item.id));
      
      forkJoin(deleteRequests).subscribe({
        next: () => {
          this.showMessage('Produto(s) excluído(s) com sucesso!');
          this.loadProducts();
        },
        error: () => this.showMessage('Erro ao excluir produto(s)')
      });
    }
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', { duration: 3000, horizontalPosition: 'center' });
  }
}