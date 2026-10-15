# NgFlutterwave

This is a library for making payments with Flutterwave compatible with Angular 16 and above

## To install the library

Use `npm i ng-flutterwave` to add the package to your dependencies

### Standalone apps

Provide your Flutterwave public key when bootstrapping, then import the directive you need into your component:

```typescript
import { provideFlutterwave } from 'ng-flutterwave';

bootstrapApplication(AppComponent, {
  providers: [provideFlutterwave({ publicKey: 'FLWPUBK-XXXXX-X' })],
});
```

```typescript
import { InlineCheckoutDirective, HtmlCheckoutDirective } from 'ng-flutterwave';

@Component({
  standalone: true,
  imports: [InlineCheckoutDirective, HtmlCheckoutDirective],
  // ...
})
export class CheckoutComponent {}
```

### NgModule apps

Add `FlutterwaveModule` to your NgModule imports and pass your public key:

```typescript
import { FlutterwaveModule } from 'ng-flutterwave';

@NgModule({
  imports: [FlutterwaveModule.forRoot({ publicKey: 'FLWPUBK-XXXXX-X' })],
})
export class AppModule {}
```

The key is used when `public_key` isn't set on the payment data.

## Using the services

Add the inline payment service by using

```javascript
import { FlutterwaveInlineService } from "ng-flutterwave";
```

## Models

There are several models including inline payment requests, payment success response and the normal payment request models

to import the models

```javascript
import {
  FlutterwaveInlineRequest,
  FlutterwaveSuccessResponse,
  FlutterwavePaymentRequest,
} from "ng-flutterwave";
```

## Inline checkout

Add the `flwInlineCheckout` directive to any element. Clicking it opens the Flutterwave payment modal on your page:

```html
<button
  [flwInlineCheckout]="paymentData"
  [flwCloseOnCallback]="true"
  (flwCallback)="makePaymentCallback($event)"
  (flwClose)="cancelledPayment($event)"
>
  Pay now
</button>
```

| Input / output       | Description                                                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| `flwInlineCheckout`  | A `FlutterwaveInlineRequest` (see below)                                     |
| `flwCloseOnCallback` | Close the payment modal right after `flwCallback` emits. Defaults to `false` |
| `(flwCallback)`      | Emits a `FlutterwaveSuccessResponse` when a payment is made                  |
| `(flwClose)`         | Emits `true` if the modal was closed before the payment completed            |

## HTML (hosted) checkout

Add the `flwHtmlCheckout` directive to a `<form>`. It sets the form to POST to Flutterwave's hosted payment page and adds the payment data as hidden fields (nested values become `customer[email]`, `configurations[session_duration]` and so on). Your own submit button and markup are kept:

```html
<form [flwHtmlCheckout]="checkoutData">
  <button type="submit">Pay now</button>
</form>
```

`checkoutData` is a `FlutterwaveHtmlCheckoutRequest`: the same fields as below, with `redirect_url` required and no callbacks. After payment Flutterwave redirects to `redirect_url` with `status` (`successful` or `cancelled`), `tx_ref` and, on success, `transaction_id`. Verify the transaction on your server before giving value. See the [HTML checkout docs](https://developer.flutterwave.com/docs/html-checkout).

### Payment data

```typescript
paymentData: FlutterwaveInlineRequest = {
  tx_ref: "unique-ref-123", // unique per transaction, ideally generated on your server
  amount: 9000,
  currency: "NGN",
  payment_options: "card,ussd", // optional
  redirect_url: "https://example.com/done", // optional for Inline, takes precedence over (flwCallback)
  customer: {
    email: "customer@mail.com",
    name: "Jane Doe",
    phone_number: "0800000000",
  },
  customizations: {
    title: "My Store",
    description: "Order #123",
    logo: "https://example.com/logo.png",
  }, // optional
  meta: { order_id: 123 }, // optional, any extra data
  configurations: { session_duration: 10, max_retry_attempt: 5 }, // optional, session_duration in minutes (max 1440)
};
```

`public_key` is optional when you configure it with `FlutterwaveModule.forRoot()`.

## How it behaves

- `(flwCallback)` fires while the payment modal is **still open**. Set `flwCloseOnCallback` (or call `close()` on the modal returned by `FlutterwaveInlineService.makePayment()`) to close it.
- Closing the modal that way does **not** emit `(flwClose)`.
- If both `redirect_url` and `(flwCallback)` are set, the redirect wins. Flutterwave appends `tx_ref`, `transaction_id` and `status` to the URL.
- Failed attempts keep the modal open so the customer can retry, up to `configurations.max_retry_attempt`.
- When `configurations.session_duration` expires, the modal closes and incomplete transactions are marked failed.
- If the customer closes the modal while a payment is processing, it's marked cancelled but **not aborted**, so it can still succeed. Rely on [webhooks](https://developer.flutterwave.com/docs/webhooks) (`charge.completed`) and server verification, not on `(flwClose)`.
- Generate `tx_ref` on your server so you can detect duplicates.
- The Flutterwave Inline script is loaded the first time a `flwInlineCheckout` element is created, and only in the browser (it's skipped during server-side rendering). `flwHtmlCheckout` doesn't need it. Clicking pay before the script has loaded throws a clear error.

## Security

- Only ever use your **public** key (`FLWPUBK...`) in the browser. Never put your secret key in Angular code.
- **Verify every payment on your server** before giving value. A `status: 'successful'` in `(flwCallback)` or the redirect URL comes from the browser and can be tampered with. Use your secret key on the server to call the [transaction verification API](https://developer.flutterwave.com/docs/transaction-verification) and check the amount, currency and `tx_ref`.

## Testing

Use your test public key (`FLWPUBK_TEST-...`) while your Flutterwave account is in test mode. Test cards and bank accounts are listed on Flutterwave's [Testing page](https://developer.flutterwave.com/docs/testing).

## What to expect in the future

There will be additions of more functionalities and schematic support to ease installation and initialization of the package in your project

## Flutterwave references

<https://developer.flutterwave.com/docs> - Developer documentation  
<https://developer.flutterwave.com/docs/inline> - Flutterwave Inline Payment documentation  
<https://developer.flutterwave.com/docs/webhooks> - Webhooks  
<https://app.flutterwave.com> - Flutterwave Dashboard

## Development

This repo is an Angular workspace. The library lives in `projects/ng-flutterwave` and a demo app lives in `src`.

1. Copy `src/environments/environment.local.example.ts` to `src/environments/environment.local.ts` and add your Flutterwave **public test** key. The file is gitignored.
2. `npm run build`: build the library into `dist/ng-flutterwave`
3. `npm start`: serve the demo app (build the library first)
4. `npm test`: run the library tests

## Deployment

Two GitHub Actions workflows live in `.github/workflows`:

- **deploy-demo.yml** runs the tests on every pull request. It only deploys from `master`: on pushes to `master` (or a manual run on `master`) it builds the demo with your public key and deploys it to GitHub Pages.
- **publish.yml** runs on every push to `master`. If the version in `projects/ng-flutterwave/package.json` isn't on npm yet, it tests, builds and publishes the library, then tags the commit (`v0.3.0`). To release, bump that version and merge to `master`.

One-time setup in the GitHub repo settings:

- **Settings → Secrets and variables → Actions**: add `FLUTTERWAVE_PUBLIC_KEY` (your `FLWPUBK...` key, never the secret key).
- **npmjs.com → ng-flutterwave → Settings → Trusted Publisher**: add a GitHub Actions publisher for this repository with the workflow filename `publish.yml`. Publishing uses this instead of an npm token.
- **Settings → Pages**: set Source to **GitHub Actions**.

## Contact the author

Email: olawalemayor90@gmail.com  
Github: <https://github.com/olawalemayor>  
LinkedIn: <https://linkedin.com/in/olawale-mayor>
