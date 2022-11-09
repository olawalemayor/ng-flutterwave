import { Component } from '@angular/core';
import { FlutterwaveSuccessResponse } from './flutterwave/models/payment-success';
import { FlutterwaveInlineRequest } from './flutterwave/models/inline-request';
import { FlutterwaveInlineService } from './flutterwave/services/inline.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private inlineService: FlutterwaveInlineService) {}

  paymentData: FlutterwaveInlineRequest = {
    public_key: 'FLWPUBK_TEST-XXXXX-X',
    tx_ref: '8*********',
    amount: 9000,
    currency: 'NGN',
    payment_options: 'card,ussd',
    redirect_url: '',
    meta: {
      consumer_id: '7898',
      consumer_mac: 'kjs9s8ss7dd',
    },
    customer: {
      name: 'Demo Customer  Name',
      email: 'customer@mail.com',
      phone_number: '08184******',
    },
    customizations: {
      title: 'Customization Title',
      description: 'Customization Description',
      logo: 'https://flutterwave.com/images/logo-colored.svg',
    },
    callback: this.makePaymentCallback,
    onclose: this.cancelledPayment,
    callbackContext: this,
  };

  makePaymentCallback(res: FlutterwaveSuccessResponse) {
    console.log('Payment callback', res);
  }

  cancelledPayment() {
    console.log('Payment is closed!');
  }
}
