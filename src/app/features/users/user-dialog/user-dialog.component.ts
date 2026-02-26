import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatSelectModule, MatSlideToggleModule
  ],
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data;
    const initialRole = this.data?.role ?? 2; 
    
    const loggedUserId = this.authService.getLoggedUserId();
    
    const isSelf = this.isEditMode && this.data?.id === loggedUserId;

    this.form = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      password: ['', []], 
      role: [{ value: initialRole, disabled: isSelf }, Validators.required],
      isActive: [this.data ? this.data.isActive : true] 
    });

    this.atualizarRegraSenha(Number(initialRole));

    this.form.get('role')?.valueChanges.subscribe(roleValue => {
      this.atualizarRegraSenha(Number(roleValue));
    });
  }

  private atualizarRegraSenha(roleValue: number): void {
    const passwordControl = this.form.get('password');
    
    if (roleValue === 3) {
      passwordControl?.clearValidators();
      passwordControl?.setValue('');
    } else {
      if (!this.isEditMode) {
        passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
      } else {
        passwordControl?.clearValidators();
      }
    }
    
    passwordControl?.updateValueAndValidity();
  }

  onSave(): void {
    if (this.form.valid) {
      const formData = { ...this.form.getRawValue() };
      
      if (this.isEditMode && !formData.password) {
        delete formData.password;
      }
      this.dialogRef.close(formData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}