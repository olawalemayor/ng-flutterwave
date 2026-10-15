import { Component } from '@angular/core';
import {
  FlutterwaveHtmlCheckoutRequest,
  FlutterwaveInlineRequest,
  FlutterwaveSuccessResponse,
} from 'ng-flutterwave';

interface DemoEvent {
  time: Date;
  kind: 'callback' | 'close';
  title: string;
  detail: string;
}

interface CheckoutReturn {
  status: string;
  txRef: string | null;
  transactionId: string | null;
}

const customer = { name: 'Demo Customer', email: 'customer@mail.com' };

// tx_ref must be unique per transaction. In a real app, generate it on your server.
const newTxRef = (kind: string) => `demo-${kind}-${Date.now()}`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  readonly returnUrl = window.location.origin + window.location.pathname;

  paymentData: FlutterwaveInlineRequest = {
    tx_ref: newTxRef('inline'),
    amount: 9000,
    currency: 'NGN',
    payment_options: 'card,ussd',
    meta: { source: 'ng-flutterwave-demo' },
    customer,
    customizations: {
      title: 'ng-flutterwave demo',
      description: 'Inline checkout test payment',
      logo: 'https://flutterwave.com/images/logo-colored.svg',
    },
  };

  // Same fields as the HTML checkout example in Flutterwave's docs.
  htmlCheckoutData: FlutterwaveHtmlCheckoutRequest = {
    tx_ref: newTxRef('html'),
    amount: 2000,
    currency: 'NGN',
    redirect_url: this.returnUrl,
    meta: { source: 'ng-flutterwave-demo' },
    customer,
  };

  /** Set when Flutterwave redirects back here from hosted checkout. */
  checkoutReturn = this.readCheckoutReturn();

  events: DemoEvent[] = [];

  inlineSnippet = `<button
  [flwInlineCheckout]="paymentData"
  [flwCloseOnCallback]="true"
  (flwCallback)="onPaid($event)"
  (flwClose)="onClose($event)">
  Pay now
</button>`;

  htmlSnippet = `<form [flwHtmlCheckout]="checkoutData">
  <button type="submit">Pay now</button>
</form>`;

  makePaymentCallback(res: FlutterwaveSuccessResponse) {
    this.log('callback', `Payment ${res.status ?? 'received'}`, res);
    // Each attempt needs a fresh reference.
    this.paymentData = { ...this.paymentData, tx_ref: newTxRef('inline') };
  }

  cancelledPayment(incomplete: boolean) {
    this.log(
      'close',
      incomplete ? 'Modal closed before paying' : 'Modal closed',
      { incomplete }
    );
  }

  clearEvents() {
    this.events = [];
  }

  dismissReturn() {
    this.checkoutReturn = null;
    history.replaceState(null, '', this.returnUrl);
  }

  private log(kind: DemoEvent['kind'], title: string, payload: unknown) {
    this.events = [
      { time: new Date(), kind, title, detail: JSON.stringify(payload, null, 2) },
      ...this.events,
    ];
  }

  private readCheckoutReturn(): CheckoutReturn | null {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    if (!status) return null;

    return {
      status,
      txRef: params.get('tx_ref'),
      transactionId: params.get('transaction_id'),
    };
  }
}
