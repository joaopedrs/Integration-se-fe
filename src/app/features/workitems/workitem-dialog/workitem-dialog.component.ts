import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-workitem-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, 
    MatButtonModule, MatFormFieldModule, MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>Definir Produto</h2>
    <mat-dialog-content>
      <p class="mb-3">Selecione o produto que deseja aplicar aos chamados selecionados:</p>
      
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Produto</mat-label>
        <mat-select [(ngModel)]="selectedProductId">
          <mat-option *ngFor="let p of products" [value]="p.id">
            {{ p.description }} ({{ p.businessUnitName }})
          </mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="!selectedProductId" (click)="confirm()">Aplicar</button>
    </mat-dialog-actions>
  `
})
export class WorkitemDialogComponent implements OnInit {
  products: Product[] = [];
  selectedProductId: number | null = null;

  constructor(
    private dialogRef: MatDialogRef<WorkitemDialogComponent>,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe(res => this.products = res);
  }

  confirm(): void {
    this.dialogRef.close(this.selectedProductId);
  }
}