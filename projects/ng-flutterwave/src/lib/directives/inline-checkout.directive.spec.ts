import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineCheckoutDirective } from './inline-checkout.directive';
import { FlutterwaveInlineService } from '../services/inline.service';
import { FlutterwaveInlineRequest } from '../models/inline-request';
import { FlutterwaveSuccessResponse } from '../models/payment-success';
import { provideFlutterwave } from '../config';

@Component({
  template: `
    <button
      [flwInlineCheckout]="data"
      [flwCloseOnCallback]="closeOnCallback"
      (flwCallback)="responses.push($event)"
      (flwClose)="closed.push($event)"
    >
      Pay
    </button>
  `,
})
class HostComponent {
  data: FlutterwaveInlineRequest = {
    tx_ref: 'test-ref',
    amount: 100,
    currency: 'NGN',
    customer: { email: 'customer@mail.com' },
  };
  closeOnCallback = false;
  responses: FlutterwaveSuccessResponse[] = [];
  closed: boolean[] = [];
}

describe('InlineCheckoutDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let button: HTMLButtonElement;
  let checkout: jasmine.Spy;
  let modal: { close: jasmine.Spy };
  let loadScript: jasmine.Spy;

  const lastCall = (): FlutterwaveInlineRequest =>
    checkout.calls.mostRecent().args[0];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InlineCheckoutDirective],
      declarations: [HostComponent],
      providers: [provideFlutterwave({ publicKey: 'FLWPUBK_TEST-config-X' })],
    });

    loadScript = spyOn(FlutterwaveInlineService.prototype, 'loadScript');
    modal = { close: jasmine.createSpy('close') };
    checkout = jasmine.createSpy('FlutterwaveCheckout').and.returnValue(modal);
    (window as any).FlutterwaveCheckout = checkout;

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('button');
  });

  afterEach(() => delete (window as any).FlutterwaveCheckout);

  it('loads the Flutterwave script when created', () => {
    expect(loadScript).toHaveBeenCalled();
  });

  it('opens checkout with the payment data on click', () => {
    button.click();

    expect(lastCall()).toEqual(
      jasmine.objectContaining({
        public_key: 'FLWPUBK_TEST-config-X',
        tx_ref: 'test-ref',
        currency: 'NGN',
      })
    );
  });

  it('emits flwClose with the incomplete flag', () => {
    button.click();
    lastCall().onclose!(true);

    expect(host.closed).toEqual([true]);
  });

  it('emits flwCallback and closes the modal when flwCloseOnCallback is set', () => {
    host.closeOnCallback = true;
    fixture.detectChanges();

    button.click();
    lastCall().callback!({ status: 'successful', transaction_id: 1 });

    expect(host.responses.length).toBe(1);
    expect(modal.close).toHaveBeenCalledTimes(1);
  });

  it('prefers public_key on the payment data', () => {
    host.data = { ...host.data, public_key: 'FLWPUBK_TEST-data-X' };
    fixture.detectChanges();
    button.click();

    expect(lastCall().public_key).toBe('FLWPUBK_TEST-data-X');
  });

  it('throws a clear error when the Flutterwave script has not loaded', () => {
    delete (window as any).FlutterwaveCheckout;
    const directive = fixture.debugElement
      .query((el) => el.name === 'button')
      .injector.get(InlineCheckoutDirective);

    expect(() => directive.handlePayment()).toThrowError(/has not loaded yet/);
  });
});
