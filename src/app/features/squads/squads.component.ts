import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { forkJoin, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

import { SquadService } from '../../core/services/squad.service';
import { Squad } from '../../core/models/squad.model';
import { SquadDialogComponent } from './squad-dialog/squad-dialog.component';

@Component({
  selector: 'app-squads',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatCheckboxModule,
    MatButtonModule, MatIconModule, MatDialogModule, 
    MatSnackBarModule, MatChipsModule
  ],
  templateUrl: './squads.component.html',
  styleUrls: ['./squads.component.scss']
})
export class SquadsComponent implements OnInit {
  displayedColumns: string[] = ['select', 'id', 'description', 'isActive'];
  dataSource = new MatTableDataSource<Squad>([]);
  selection = new SelectionModel<Squad>(true, []);

  constructor(
    private squadService: SquadService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSquads();
  }

  loadSquads(): void {
    this.squadService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.selection.clear();
      },
      error: () => this.showMessage('Erro ao carregar squads')
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

  // Substitua as funções onAdd() e onEdit() no seu squads.component.ts

  onAdd(): void {
    const dialogRef = this.dialog.open(SquadDialogComponent, { 
      width: '95%', 
      maxWidth: '450px' 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Envia o result completo (incluindo result.productIds) em uma única requisição
        this.squadService.create(result).subscribe({
          next: () => {
            this.showMessage('Squad criada com sucesso!');
            this.loadSquads();
          },
          error: (err) => this.showMessage(err.error?.message || 'Erro ao criar squad')
        });
      }
    });
  }

  onEdit(): void {
    const selected = this.selection.selected[0];
    const dialogRef = this.dialog.open(SquadDialogComponent, {
      width: '95%',
      maxWidth: '450px',
      data: selected
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Envia a atualização completa (incluindo result.productIds) em uma única requisição
        this.squadService.update(selected.id, result).subscribe({
          next: () => {
            this.showMessage('Squad atualizada com sucesso!');
            this.loadSquads();
          },
          error: (err) => this.showMessage(err.error?.message || 'Erro ao atualizar squad')
        });
      }
    });
  }

  onDelete(): void {
    const squadsToDelete = this.selection.selected;
    
    if(confirm(`Tem certeza que deseja excluir ${squadsToDelete.length} squad(s)?`)) {
      const deleteRequests = squadsToDelete.map(squad => this.squadService.delete(squad.id));
      
      forkJoin(deleteRequests).subscribe({
        next: () => {
          this.showMessage('Squad(s) excluída(s) com sucesso!');
          this.loadSquads();
        },
        error: (err) => this.showMessage('Erro ao excluir squad(s)')
      });
    }
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', { duration: 3000, horizontalPosition: 'center' });
  }
}