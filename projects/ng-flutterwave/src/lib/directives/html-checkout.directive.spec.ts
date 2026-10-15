import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  FLUTTERWAVE_HOSTED_CHECKOUT_URL,
  HtmlCheckoutDirective,
} from './html-checkout.directive';
import { FlutterwaveHtmlCheckoutRequest } from '../models/html-checkout-request';
import { provideFlutterwave } from '../config';

@Component({
  template: `<form [flwHtmlCheckout]="data"><button type="submit">Pay</button></form>`,
})
class HostComponent {
  data: FlutterwaveHtmlCheckoutRequest = {
    tx_ref: 'test-ref',
    amount: 100,
    currency: 'NGN',
    redirect_url: 'https://example.com/done',
    customer: { email: 'customer@mail.com', name: 'Jane' },
    configurations: { session_duration: 10, max_retry_attempt: 5 },
  };
}

describe('HtmlCheckoutDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let form: HTMLFormElement;

  const fields = () =>
    Array.from(form.querySelectorAll<HTMLInputElement>('input[type=hidden]')).reduce(
      (acc, input) => ({ ...acc, [input.name]: input.value }),
      {} as Record<string, string>
    );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HtmlCheckoutDirective],
      declarations: [HostComponent],
      providers: [provideFlutterwave({ publicKey: 'FLWPUBK_TEST-config-X' })],
    });

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    form = fixture.nativeElement.querySelector('form');
  });

  it('posts to the Flutterwave hosted checkout', () => {
    expect(form.getAttribute('method')).toBe('POST');
    expect(form.getAttribute('action')).toBe(FLUTTERWAVE_HOSTED_CHECKOUT_URL);
  });

  it('renders the payment data as bracketed hidden inputs', () => {
    expect(fields()).toEqual({
      public_key: 'FLWPUBK_TEST-config-X',
      tx_ref: 'test-ref',
      amount: '100',
      currency: 'NGN',
      redirect_url: 'https://example.com/done',
      'customer[email]': 'customer@mail.com',
      'customer[name]': 'Jane',
      'configurations[session_duration]': '10',
      'configurations[max_retry_attempt]': '5',
    });
  });

  it('puts public_key first, like the Flutterwave docs', () => {
    expect(form.querySelector('input')!.name).toBe('public_key');
  });

  it('keeps the existing form content', () => {
    expect(form.querySelector('button[type=submit]')).toBeTruthy();
  });

  it('renders no fields until the data is set', () => {
    fixture.componentInstance.data = undefined as any;
    fixture.detectChanges();

    expect(fields()).toEqual({});
  });

  it('replaces the fields when the data changes', () => {
    fixture.componentInstance.data = {
      tx_ref: 'other-ref',
      amount: 200,
      redirect_url: 'https://example.com/done',
      customer: { email: 'other@mail.com' },
      public_key: 'FLWPUBK_TEST-data-X',
    };
    fixture.detectChanges();

    expect(fields()).toEqual({
      tx_ref: 'other-ref',
      amount: '200',
      redirect_url: 'https://example.com/done',
      'customer[email]': 'other@mail.com',
      public_key: 'FLWPUBK_TEST-data-X',
    });
  });
});
