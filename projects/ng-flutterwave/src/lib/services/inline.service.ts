import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { FlutterwaveInlineRequest } from '../models/inline-request';
import { FlutterwaveSuccessResponse } from '../models/payment-success';
import { FlutterwaveConfig, FLUTTERWAVE_CONFIG } from '../config';

export interface FlutterwaveModal {
  close(): void;
}

export const FLUTTERWAVE_INLINE_SCRIPT_URL =
  'https://checkout.flutterwave.com/v3.js';

declare function FlutterwaveCheckout(
  data: FlutterwaveInlineRequest
): FlutterwaveModal;

@Injectable({ providedIn: 'root' })
export class FlutterwaveInlineService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
    @Optional() @Inject(FLUTTERWAVE_CONFIG) private config?: FlutterwaveConfig
  ) {}

  /** Adds the Flutterwave Inline script to the page once. Does nothing outside the browser. */
  loadScript() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.document.querySelector(`script[src="${FLUTTERWAVE_INLINE_SCRIPT_URL}"]`))
      return;

    const script = this.document.createElement('script');
    script.src = FLUTTERWAVE_INLINE_SCRIPT_URL;
    script.async = true;
    this.document.head.appendChild(script);
  }

  /** Returns `data.public_key`, falling back to the key from `provideFlutterwave()` / `FlutterwaveModule.forRoot()`. */
  resolvePublicKey(data: { public_key?: string }): string {
    const publicKey = data.public_key ?? this.config?.publicKey;

    if (!publicKey)
      throw new Error(
        'ng-flutterwave: no public key. Set `public_key` on the payment data or use provideFlutterwave({ publicKey }) / FlutterwaveModule.forRoot({ publicKey }).'
      );

    return publicKey;
  }

  makePayment(
    paymentData: FlutterwaveInlineRequest,
    callback?: (res: FlutterwaveSuccessResponse) => void,
    onclose?: (incomplete: boolean) => void
  ): FlutterwaveModal {
    const data: FlutterwaveInlineRequest = {
      ...paymentData,
      public_key: this.resolvePublicKey(paymentData),
    };

    if (typeof FlutterwaveCheckout !== 'function')
      throw new Error(
        'ng-flutterwave: Flutterwave Inline script (checkout.flutterwave.com/v3.js) has not loaded yet.'
      );

    if (callback) data.callback = callback;
    if (onclose) data.onclose = onclose;

    return FlutterwaveCheckout(data);
  }
}
