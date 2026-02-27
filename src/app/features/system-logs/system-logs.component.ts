import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { SystemLogService } from '../../core/services/system-log.service';
import { UserService } from '../../core/services/user.service';
import { SystemLog, LogFilter } from '../../core/models/system-log.model';
import { User } from '../../core/models/user.model';
import { SystemLogDialogComponent } from './system-log-dialog/system-log-dialog.component';

@Component({
  selector: 'app-system-logs',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTableModule,
    MatButtonModule, MatIconModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule, MatDialogModule, MatSnackBarModule
  ],
  templateUrl: './system-logs.component.html',
  styleUrls: ['./system-logs.component.scss']
})
export class SystemLogsComponent implements OnInit {
  displayedColumns: string[] = ['actionDate', 'userId', 'actionTypeName', 'applicationName', 'logLevelName', 'ipAddress'];
  dataSource = new MatTableDataSource<SystemLog>([]);
  
  filterForm!: FormGroup;
  users: User[] = [];
  
  // Controle de paginação e Scroll
  isLoading = false;
  hasMorePages = true;
  currentPage = 1;
  pageSize = 50;

  // Mock dos enums (Ajuste os valores numéricos e textos conforme seus Enums no C#)
  actionTypes = [{ value: 1, label: 'Create' }, { value: 2, label: 'Update' }, { value: 3, label: 'Delete' }, { value: 4, label: 'Login' }];
  applications = [{ value: 1, label: 'UserController' }, { value: 2, label: 'AuthController' }];
  logLevels = [{ value: 1, label: 'Info' }, { value: 2, label: 'Warning' }, { value: 3, label: 'Error' }];

  constructor(
    private fb: FormBuilder,
    private logService: SystemLogService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
    this.loadLogs(true); // true = primeira carga (reseta tabela)
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      userId: [null],
      startDate: [null],
      endDate: [null],
      actionType: [null],
      application: [null],
      logLevel: [null],
      description: [''],
      ipAddress: ['']
    });
  }

  loadUsers(): void {
    this.userService.getAll().subscribe(data => this.users = data);
  }

  applyFilter(): void {
    this.loadLogs(true); // Ao filtrar, reseta a paginação e limpa a tabela
  }

  clearFilter(): void {
    this.filterForm.reset();
    this.loadLogs(true);
  }

  loadLogs(reset: boolean = false): void {
    if (this.isLoading) return;

    if (reset) {
      this.currentPage = 1;
      this.hasMorePages = true;
      this.dataSource.data = []; // Limpa a tabela
    }

    if (!this.hasMorePages) return;

    this.isLoading = true;
    
    // Pega os valores do form e formata as datas se existirem
    const formValues = this.filterForm.value;
    const filter: LogFilter = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      userId: formValues.userId,
      actionType: formValues.actionType,
      application: formValues.application,
      logLevel: formValues.logLevel,
      description: formValues.description,
      ipAddress: formValues.ipAddress,
      startDate: formValues.startDate ? new Date(formValues.startDate).toISOString() : undefined,
      endDate: formValues.endDate ? new Date(formValues.endDate).toISOString() : undefined,
    };

    this.logService.getLogs(filter).subscribe({
      next: (response) => {
        const currentData = this.dataSource.data;
        this.dataSource.data = [...currentData, ...response.data];
        
        this.hasMorePages = this.currentPage < response.totalPages;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar logs', 'Fechar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onTableScroll(event: any): void {
    const element = event.target;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 50) {
      if (!this.isLoading && this.hasMorePages) {
        this.currentPage++;
        this.loadLogs(false); 
      }
    }
  }

  openDetails(log: SystemLog): void {
    this.dialog.open(SystemLogDialogComponent, {
      width: '600px',
      data: log
    });
  }
}