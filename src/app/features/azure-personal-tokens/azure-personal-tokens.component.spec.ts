import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AzurePersonalTokensComponent } from './azure-personal-tokens.component';

describe('AzurePersonalTokensComponent', () => {
  let component: AzurePersonalTokensComponent;
  let fixture: ComponentFixture<AzurePersonalTokensComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AzurePersonalTokensComponent]
    });
    fixture = TestBed.createComponent(AzurePersonalTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
