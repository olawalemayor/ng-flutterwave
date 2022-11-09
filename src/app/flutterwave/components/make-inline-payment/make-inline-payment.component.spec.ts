import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeInlinePaymentComponent } from './make-inline-payment.component';

describe('MakeInlinePaymentComponent', () => {
  let component: MakeInlinePaymentComponent;
  let fixture: ComponentFixture<MakeInlinePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MakeInlinePaymentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeInlinePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
