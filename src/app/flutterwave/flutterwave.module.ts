import { NgModule, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FlutterwaveInlineService } from './services/inline.service';
import { MakeInlinePaymentComponent } from './components/make-inline-payment/make-inline-payment.component';

@NgModule({
  imports: [CommonModule],
  exports: [MakeInlinePaymentComponent],
  declarations: [MakeInlinePaymentComponent],
  providers: [FlutterwaveInlineService],
})
export class FluttterWaveModule {
  constructor(@Inject(DOCUMENT) private document: Document) {
    const inlineSDK = 'https://checkout.flutterwave.com/v3.js';

    const inlineScript = document.createElement('script');

    inlineScript.src = inlineSDK;

    if (!document.querySelector(`[src="${inlineSDK}"]`))
      document.body.appendChild(inlineScript);
  }
}
