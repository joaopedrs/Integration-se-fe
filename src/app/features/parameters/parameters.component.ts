import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ParameterService } from '../../core/services/parameter.service';
import { Parameter, ParameterDto } from '../../core/models/parameter.model';
import { ParameterDialogComponent } from './parameter-dialog/parameter-dialog.component';

@Component({
  selector: 'app-parameters',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatCheckboxModule,
    MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule
  ],
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss']
})
export class ParametersComponent implements OnInit {
  displayedColumns: string[] = ['select', 'id', 'description', 'value'];
  dataSource = new MatTableDataSource<Parameter>([]);
  selection = new SelectionModel<Parameter>(true, []);

  constructor(
    private parameterService: ParameterService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadParameters();
  }

  loadParameters(): void {
    this.parameterService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.selection.clear(); // Limpa a seleção após recarregar
      },
      error: () => this.showMessage('Erro ao carregar parâmetros')
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
    const dialogRef = this.dialog.open(ParameterDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result: ParameterDto) => {
      if (result) {
        this.parameterService.create(result).subscribe({
          next: () => {
            this.showMessage('Parâmetro criado com sucesso!');
            this.loadParameters();
          },
          error: (err) => this.showMessage(err.error?.message || 'Erro ao criar')
        });
      }
    });
  }

  onEdit(): void {
    const selected = this.selection.selected[0];
    const dialogRef = this.dialog.open(ParameterDialogComponent, {
      width: '400px',
      data: selected // Passa o registro selecionado para preencher o formulário
    });

    dialogRef.afterClosed().subscribe((result: ParameterDto) => {
      if (result) {
        this.parameterService.update(selected.id, result).subscribe({
          next: () => {
            this.showMessage('Parâmetro atualizado com sucesso!');
            this.loadParameters();
          },
          error: (err) => this.showMessage(err.error?.message || 'Erro ao atualizar')
        });
      }
    });
  }

  onDelete(): void {
    const idsToDelete = this.selection.selected.map(item => item.id);
    
    if(confirm(`Tem certeza que deseja excluir ${idsToDelete.length} parâmetro(s)?`)) {
      this.parameterService.delete(idsToDelete).subscribe({
        next: () => {
          this.showMessage('Parâmetro(s) excluído(s) com sucesso!');
          this.loadParameters();
        },
        error: (err) => this.showMessage(err.error?.message || 'Erro ao excluir')
      });
    }
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', { duration: 3000, horizontalPosition: 'center' });
  }
}