import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Parameter } from '../../../core/models/parameter.model';

@Component({
  selector: 'app-parameter-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  templateUrl: './parameter-dialog.component.html',
  styleUrls: ['./parameter-dialog.component.scss']
})
export class ParameterDialogComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ParameterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Parameter | null 
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data; 

    this.form = this.fb.group({
      description: [this.data?.description || '', Validators.required],
      value: [this.data?.value || '', Validators.required]
    });
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}