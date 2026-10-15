import { FlutterwaveSuccessResponse } from '../models/payment-success';

export interface FlutterwaveInlineRequest {
  /** Defaults to the `publicKey` passed to `FlutterwaveModule.forRoot()`. */
  public_key?: string;
  /** @deprecated No longer used; handle results through the component outputs. */
  callbackContext?: any;
  tx_ref: string;
  amount: number;
  payment_options?: string;
  authorization?: object | string;
  currency?: string;
  redirect_url?: string;
  meta?: Record<string, unknown>;
  customer: {
    email: string;
    phone_number?: string;
    name?: string;
  };
  customizations?: {
    title?: string;
    description?: string;
    logo?: string;
  };
  configurations?: {
    /** Session timeout in minutes (max 1440). */
    session_duration?: number;
    max_retry_attempt?: number;
  };
  payment_plan?: string | number;
  callback?: (response: FlutterwaveSuccessResponse) => void;
  /** `incomplete` is `true` when the modal closed before payment completed. */
  onclose?: (incomplete: boolean) => void;
  subaccounts?: any;
  integrity_hash?: any;
}
