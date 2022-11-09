import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { FlutterwaveSuccessResponse } from '../../models/payment-success';
import { FlutterwaveInlineRequest } from '../../models/inline-request';
import { FlutterwaveInlineService } from '../../services/inline.service';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'make-inline-payment',
  templateUrl: 'make-inline-payment.component.html',
})
export class MakeInlinePaymentComponent implements OnInit {
  constructor(private inlineService: FlutterwaveInlineService) {}

  @Input() data!: FlutterwaveInlineRequest;

  @Input() text!: string;

  @Input() style!: any;

  @Input() className!: string;

  @Output() callback: EventEmitter<FlutterwaveSuccessResponse> =
    new EventEmitter<FlutterwaveSuccessResponse>();

  @Output() close: EventEmitter<any> = new EventEmitter();

  arrangeData() {
    const newData: FlutterwaveInlineRequest = {
      ...this.data,

      callback: (res) => {
        this.callback.emit(res);
      },

      onclose: () => {
        this.close.emit();
      },
    };

    if (this.data.payment_plan) newData.payment_plan = this.data.payment_plan;

    if (this.data.subaccounts) newData.subaccounts = this.data.subaccounts;

    if (this.data.integrity_hash)
      newData.integrity_hash = this.data.integrity_hash;

    return newData;
  }

  handlePayment() {
    const data = this.arrangeData();

    this.inlineService.makePayment(
      data,
      (res) => {
        data.callback && data.callbackContext[data.callback.name](res);
      },
      () => {
        data.onclose && data.callbackContext[data.onclose.name]();
      }
    );
  }

  ngOnInit() {
    this.data = {
      public_key: environment.flutterwaveApiKey,
      amount: this.data.amount || 0,
      customer: this.data.customer || { email: '', name: '', phonenumber: '' },
      customizations: this.data.customizations || {
        description: '',
        logo: '',
        title: '',
      },
      meta: this.data.meta || { consumer_id: 0, consumer_mac: '' },
      tx_ref: this.data.tx_ref || '',
    };

    this.text = this.text || 'Pay';
  }
}
