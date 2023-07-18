export interface Hotel{
  name: string,
  refid: string,
  id: number
}

export interface HotelPaymentSession {
  status: number
  id: number
  distribution_channel_id: number
  session_id: string
  service_requestor_id: number
  itinerary_number: number
  profile_id: number
  room_confirmation_number: string
  status_1: number
  provider_code: string
  provider_response_text: string
  provider_response_reason: string
  provider_response_datetime: number
  payment_amount: number
  payment_allocation_amount: string
  payment_context: number
  payment_currency: string
  payment_currency_digits: number
  create_datetime: number
  update_datetime: number
  update_user_account_id: number
  create_user_account_id: number
  payment_transaction_refid: string
  waiting_provider_notify: number,
  MerchantReference?: string,
  EventDate?: Date,
  Reason?: string,
  output_sql?: string,
  verify_status: 'success' | 'failed',
  verify_errors: string[],
  adyenResponse: AdyenResponse,
  update_provider_response_text?: string,
  updateAdyenResponse?: AdyenResponse
}

export interface AdyenResponse{
  Live: 'true' | 'false',
  NotificationItems: AdyenNotificationItem[]
}



export interface AdyenNotificationItem{
  NotificationRequestItem: AdyenNotificationRequestItem
}

export interface AdyenNotificationRequestItem{
  AdditionalData: {
    ExpiryDate: string,
    AuthCode: string,
    CardBin: string,
    CardSummary: string,
    CheckoutSessionId: string
  },
  Amount: {
    Currency: string,
    Value: number,
  },
  EventCode: AdyenEventCode,
  EventDate: string,
  PaymentMethod: string,
  MerchantAccountCode: string,
  MerchantReference: string,
  PspReference: string,
  Reason: string,
  Operations: any,
  Success: 'true' | 'false'
}

export type AdyenEventCode =  'AUTHORISATION' | 'REPORT_AVAILABLE' | 'REFUND' | 'CANCELLATION' | 'CANCEL_OR_REFUND' | 'CHARGEBACK' | 'CHARGEBACK_REVERSED' | 'OFFER_CLOSED' | 'CAPTURE';