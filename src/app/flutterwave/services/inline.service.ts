import { Injectable } from '@angular/core';
import { FlutterwaveInlineRequest } from '../models/inline-request';
import { FlutterwaveSuccessResponse } from '../models/payment-success';

declare function FlutterwaveCheckout(data: FlutterwaveInlineRequest): any;

@Injectable()
export class FlutterwaveInlineService {
  constructor() {}

  makePayment(
    paymentData: FlutterwaveInlineRequest,
    callback?: (res: any) => void,
    onclose?: () => void
  ) {
    const data: FlutterwaveInlineRequest = {
      ...paymentData,
      callback: callback && callback,
      onclose: () => {
        onclose && onclose;
      },
    };

    return FlutterwaveCheckout(data);
  }
}
