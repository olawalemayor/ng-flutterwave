import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
} from '@angular/core';

import { FlutterwaveHtmlCheckoutRequest } from '../models/html-checkout-request';
import { FlutterwaveInlineService } from '../services/inline.service';

export const FLUTTERWAVE_HOSTED_CHECKOUT_URL =
  'https://checkout.flutterwave.com/v3/hosted/pay';

/**
 * Turns a form into a Flutterwave HTML checkout form. Submitting it sends the
 * customer to Flutterwave's hosted payment page, then back to `redirect_url`.
 *
 * <form [flwHtmlCheckout]="data"><button type="submit">Pay Now</button></form>
 */
@Directive({
  selector: 'form[flwHtmlCheckout]',
  standalone: true,
  host: { method: 'POST', action: FLUTTERWAVE_HOSTED_CHECKOUT_URL },
})
export class HtmlCheckoutDirective implements OnChanges {
  constructor(
    private el: ElementRef<HTMLFormElement>,
    private renderer: Renderer2,
    private inlineService: FlutterwaveInlineService
  ) {}

  @Input('flwHtmlCheckout') data!: FlutterwaveHtmlCheckoutRequest;

  private inputs: HTMLInputElement[] = [];

  ngOnChanges() {
    this.inputs.forEach((input) =>
      this.renderer.removeChild(this.el.nativeElement, input)
    );
    this.inputs = [];

    if (!this.data) return;

    const { public_key, ...data } = this.data;
    const fields = flatten({
      public_key: this.inlineService.resolvePublicKey({ public_key }),
      ...data,
    });

    this.inputs = fields.map(([name, value]) => {
      const input: HTMLInputElement = this.renderer.createElement('input');
      this.renderer.setAttribute(input, 'type', 'hidden');
      this.renderer.setAttribute(input, 'name', name);
      this.renderer.setAttribute(input, 'value', value);
      this.renderer.appendChild(this.el.nativeElement, input);
      return input;
    });
  }
}

/** `{ customer: { email: 'a' } }` -> `[['customer[email]', 'a']]` */
function flatten(value: unknown, prefix = ''): [string, string][] {
  if (value === null || value === undefined || typeof value === 'function')
    return [];

  if (typeof value !== 'object') return [[prefix, String(value)]];

  return Object.entries(value).flatMap(([key, child]) =>
    flatten(child, prefix ? `${prefix}[${key}]` : key)
  );
}
