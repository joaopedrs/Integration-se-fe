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

import { AzurePersonalTokenService } from '../../core/services/azure-personal-token.service';
import { AzurePersonalToken, CreateAzurePersonalTokenDto, UpdateAzurePersonalTokenDto } from '../../core/models/azure-personal-token.model';
import { AzurePersoanlTokenDialogComponent } from './azure-personal-token-dialog/azure-personal-token-dialog.component';

@Component({
  selector: 'app-azure-tokens',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatCheckboxModule,
    MatButtonModule, MatIconModule, MatDialogModule, 
    MatSnackBarModule, MatChipsModule
  ],
  templateUrl: './azure-personal-tokens.component.html',
  styleUrls: ['./azure-personal-tokens.component.scss']
})
export class AzurePersonalTokensComponent implements OnInit {
  displayedColumns: string[] = ['select', 'id', 'name', 'expirationAt', 'active'];
  dataSource = new MatTableDataSource<AzurePersonalToken>([]);
  selection = new SelectionModel<AzurePersonalToken>(true, []);

  constructor(
    private AzurePersonalTokenService: AzurePersonalTokenService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTokens();
  }

  loadTokens(): void {
    this.AzurePersonalTokenService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.selection.clear();
      },
      error: () => this.showMessage('Erro ao carregar os tokens do Azure')
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
    const dialogRef = this.dialog.open(AzurePersoanlTokenDialogComponent, { width: '95%', maxWidth: '450px' });

    dialogRef.afterClosed().subscribe((result: CreateAzurePersonalTokenDto) => {
      if (result) {
        this.AzurePersonalTokenService.create(result).subscribe({
          next: () => {
            this.showMessage('Token adicionado com sucesso!');
            this.loadTokens();
          },
          error: (err) => this.showMessage(err.error?.message || 'Erro ao criar')
        });
      }
    });
  }

  onEdit(): void {
    const selected = this.selection.selected[0];
    const dialogRef = this.dialog.open(AzurePersoanlTokenDialogComponent, {
      width: '95%', maxWidth: '450px',
      data: selected
    });

    dialogRef.afterClosed().subscribe((result: UpdateAzurePersonalTokenDto) => {
      if (result) {
        this.AzurePersonalTokenService.update(selected.id, result).subscribe({
          next: () => {
            this.showMessage('Token atualizado com sucesso!');
            this.loadTokens();
          },
          error: (err) => this.showMessage(err.error?.message || 'Erro ao atualizar')
        });
      }
    });
  }

  onDelete(): void {
    const idsToDelete = this.selection.selected.map(item => item.id);
    
    if(confirm(`Tem certeza que deseja excluir ${idsToDelete.length} token(s)?`)) {
      this.AzurePersonalTokenService.delete(idsToDelete).subscribe({
        next: () => {
          this.showMessage('Token(s) excluído(s) com sucesso!');
          this.loadTokens();
        },
        error: (err) => this.showMessage(err.error?.message || 'Erro ao excluir')
      });
    }
  }

  isExpired(dateString: string): boolean {
    return new Date(dateString) < new Date();
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', { duration: 3000, horizontalPosition: 'center' });
  }
}