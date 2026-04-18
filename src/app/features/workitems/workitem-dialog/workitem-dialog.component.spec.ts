import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkitemDialogComponent } from './workitem-dialog.component';

describe('WorkitemDialogComponent', () => {
  let component: WorkitemDialogComponent;
  let fixture: ComponentFixture<WorkitemDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WorkitemDialogComponent]
    });
    fixture = TestBed.createComponent(WorkitemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
