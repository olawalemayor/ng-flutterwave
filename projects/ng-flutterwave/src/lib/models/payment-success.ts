export interface FlutterwaveSuccessResponse {
  amount?: number;
  currency?: string;
  customer?: {
    name?: string;
    email: string;
    phone_number?: string;
  };
  flw_ref?: string;
  status?: string;
  transaction_id?: number;
  tx_ref?: string;
  payment_plan?: string | number;
  charge_response_code?: string;
  charge_response_message?: string;
}
