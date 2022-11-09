export interface FlutterwaveSuccessResponse {
  amount?: number;
  currency?: string;
  customer?: object;
  flw_ref?: string;
  status?: string;
  transaction_id?: number;
  tx_ref?: string;
  payment_plan?: string | number;
}
