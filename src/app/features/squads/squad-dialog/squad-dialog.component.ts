import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Squad } from '../../../core/models/squad.model';
import { ProductService } from '../../../core/services/product.service'; 
import { Product } from '../../../core/models/product.model'; 

@Component({
  selector: 'app-squad-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSlideToggleModule, MatCheckboxModule
  ],
  templateUrl: './squad-dialog.component.html',
  styleUrls: ['./squad-dialog.component.scss']
})
export class SquadDialogComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  
  products: Product[] = []; 
  selectedProductIds: number[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SquadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Squad | null,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data;

    this.productService.getAll().subscribe({
      next: (res) => this.products = res,
      error: (err) => console.error('Erro ao carregar produtos', err)
    });

    this.selectedProductIds = this.data?.productIds || [];

    this.form = this.fb.group({
      description: [this.data?.description || '', Validators.required],
      isActive: [this.data ? this.data.isActive : true] 
    });
  }

  toggleProduct(productId: number, isChecked: boolean) {
    if (isChecked) {
      this.selectedProductIds.push(productId);
    } else {
      this.selectedProductIds = this.selectedProductIds.filter(id => id !== productId);
    }
  }

  onSave(): void {
    if (this.form.valid) {
      // Juntamos os dados do form de texto com o array de IDs dos checkboxes
      const result = {
        ...this.form.getRawValue(),
        productIds: this.selectedProductIds
      };
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}