import { FlutterwaveSuccessResponse } from '../models/payment-success';

export interface FlutterwaveInlineRequest {
  public_key: string;
  callbackContext?: any;
  tx_ref: string;
  amount: number;
  payment_options?: string;
  authorization?: object | string;
  currency?: string;
  redirect_url?: string;
  meta: {
    consumer_id: number | string;
    consumer_mac: string;
  };
  customer: {
    email: string;
    phone_number: string;
    name: string;
  };
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
  payment_plan?: string | number;
  callback?: (response: FlutterwaveSuccessResponse) => void;
  onclose?: () => void;
  subaccounts?: any;
  integrity_hash?: any;
}
