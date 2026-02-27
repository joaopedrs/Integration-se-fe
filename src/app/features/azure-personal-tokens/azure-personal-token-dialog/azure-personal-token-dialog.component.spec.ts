import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AzurePersonalTokenDialogComponent } from './azure-personal-token-dialog.component';

describe('AzurePersonalTokenDialogComponent', () => {
  let component: AzurePersonalTokenDialogComponent;
  let fixture: ComponentFixture<AzurePersonalTokenDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AzurePersonalTokenDialogComponent]
    });
    fixture = TestBed.createComponent(AzurePersonalTokenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
