export interface FlutterwavePaymentRequest {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency?: string;
  country?: string;
  authorization?: object | string;
  payment_options?: string;
  meta?: any;
  customer?: object;
  customizations?: object;
  payment_plan?: string | number;
  subaccounts?: any;
  integrity_hash?: any;
}
