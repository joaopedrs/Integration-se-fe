import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

import { UserService } from '../../core/services/user.service';
import { User, CreateUserDto, UpdateUserDto } from '../../core/models/user.model';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatCheckboxModule,
    MatButtonModule, MatIconModule, MatDialogModule, 
    MatSnackBarModule, MatChipsModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'] // Pode usar exatamente os mesmos estilos que a gente criou pro Parâmetros!
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['select', 'id', 'name', 'email', 'role', 'isActive', 'lastLogin'];
  dataSource = new MatTableDataSource<User>([]);
  selection = new SelectionModel<User>(true, []);

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.selection.clear();
      },
      error: () => this.showMessage('Erro ao carregar usuários')
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
    const dialogRef = this.dialog.open(UserDialogComponent, { 
      width: '95%', 
      maxWidth: '450px' 
    });

    dialogRef.afterClosed().subscribe((result: CreateUserDto) => {
      if (result) {
        this.userService.create(result).subscribe({
          next: () => {
            this.showMessage('Usuário criado com sucesso!');
            this.loadUsers();
          },
          error: (err) => this.showMessage(err.error?.message || err.error || 'Erro ao criar')
        });
      }
    });
  }

  onEdit(): void {
    const selected = this.selection.selected[0];
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '95%',
      maxWidth: '450px',
      data: selected
    });

    dialogRef.afterClosed().subscribe((result: UpdateUserDto) => {
      if (result) {
        this.userService.update(selected.id, result).subscribe({
          next: () => {
            this.showMessage('Usuário atualizado com sucesso!');
            this.loadUsers();
          },
          error: (err) => this.showMessage(err.error?.message || err.error || 'Erro ao atualizar')
        });
      }
    });
  }

  onDelete(): void {
    const idsToDelete = this.selection.selected.map(item => item.id);
    
    if(confirm(`Tem certeza que deseja inativar/excluir ${idsToDelete.length} usuário(s)?`)) {
      this.userService.delete(idsToDelete).subscribe({
        next: () => {
          this.showMessage('Usuário(s) inativado(s) com sucesso!');
          this.loadUsers();
        },
        error: (err) => this.showMessage(err.error?.message || err.error || 'Erro ao excluir')
      });
    }
  }

  getRoleName(roleValue: number | string): string {
    const roleId = Number(roleValue); 
    
    switch (roleId) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Usuário Padrão';
      case 3:
        return 'Usuário de Serviço';
      default:
        return 'Desconhecido';
    }
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', { duration: 3000, horizontalPosition: 'center' });
  }
}