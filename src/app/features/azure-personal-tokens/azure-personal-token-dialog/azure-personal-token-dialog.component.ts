import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AzurePersonalToken } from '../../../core/models/azure-personal-token.model';

@Component({
  selector: 'app-azure-token-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSlideToggleModule, MatDatepickerModule, MatNativeDateModule
  ],
  templateUrl: './azure-personal-token-dialog.component.html',
  styleUrls: ['./azure-personal-token-dialog.component.scss']
})
export class AzurePersoanlTokenDialogComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AzurePersoanlTokenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AzurePersonalToken | null
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data;

    this.form = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      value: [this.data?.value || '', Validators.required],
      expirationAt: [this.data?.expirationAt ? new Date(this.data.expirationAt) : '', Validators.required],
      active: [this.data ? this.data.active : true]
    });
  }

  onSave(): void {
    if (this.form.valid) {
      const formData = { ...this.form.getRawValue() };
      
      if (formData.expirationAt instanceof Date) {
        formData.expirationAt = formData.expirationAt.toISOString();
      }
      
      this.dialogRef.close(formData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}