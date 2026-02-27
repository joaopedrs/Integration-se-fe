import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SystemLog } from '../../../core/models/system-log.model';

@Component({
  selector: 'app-system-log-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Detalhes do Log (#{{ data.id }})</h2>
    <mat-dialog-content class="log-details">
      <p><strong>Usuário ID:</strong> {{ data.userId }}</p>
      <p><strong>Data/Hora:</strong> {{ data.actionDate | date:'dd/MM/yyyy HH:mm:ss' }}</p>
      <p><strong>Ação:</strong> {{ data.actionTypeName }}</p>
      <p><strong>Aplicação:</strong> {{ data.applicationName }}</p>
      <p><strong>Nível:</strong> <span [class]="'level-' + data.logLevelName.toLowerCase()">{{ data.logLevelName }}</span></p>
      <p><strong>IP:</strong> {{ data.ipAddress }}</p>
      <div class="desc-box">
        <strong>Descrição:</strong><br/>
        {{ data.description }}
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Fechar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .log-details p { margin-bottom: 8px; }
    .desc-box { margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px; word-break: break-all; }
    .level-error { color: red; font-weight: bold; }
    .level-warning { color: orange; font-weight: bold; }
    .level-info { color: blue; font-weight: bold; }
  `]
})
export class SystemLogDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SystemLogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SystemLog
  ) {}
}