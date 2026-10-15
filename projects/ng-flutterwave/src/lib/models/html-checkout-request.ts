import { FlutterwaveInlineRequest } from './inline-request';

/**
 * Payment data for Flutterwave HTML (hosted) checkout. The customer leaves your
 * page, so there are no callbacks and `redirect_url` is required.
 */
export type FlutterwaveHtmlCheckoutRequest = Omit<
  FlutterwaveInlineRequest,
  'callback' | 'onclose' | 'callbackContext' | 'redirect_url'
> & { redirect_url: string };
