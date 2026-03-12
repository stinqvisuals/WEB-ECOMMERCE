declare module 'midtrans-client' {
    export class Snap {
        constructor(config: SnapConfig);
        createTransactionToken(parameter: TransactionParameter): Promise<string>;
        createTransactionRedirectUrl(parameter: TransactionParameter): Promise<string>;
    }

    export interface SnapConfig {
        isProduction: boolean;
        serverKey: string | undefined;
        clientKey: string | undefined;
    }

    export interface TransactionParameter {
        transaction_detail: TransactionDetail;
        credit_card?: CreditCard;
        customer_details?: CustomerDetails;
        item_details?: ItemDetail[];
        callbacks?: CallbackOptions;
        [key: string]: unknown;
    }

    export interface TransactionDetail {
        order_id: string;
        gross_amount: number;
    }

    export interface CreditCard {
        secure: boolean;
        token_id?: string;
        channel?: string;
    }

    export interface CustomerDetails {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
        billing_address?: Address;
        shipping_address?: Address;
    }

    export interface Address {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
        address?: string;
        city?: string;
        country_code?: string;
        postal_code?: string;
    }

    export interface ItemDetail {
        id: string;
        name: string;
        price: number;
        quantity: number;
        brand?: string;
        category?: string;
        merchant_id?: string;
    }

    // Snap payment result type
    export interface SnapPaymentResult {
        order_id?: string;
        transaction_id?: string;
        transaction_status?: string;
        gross_amount?: string;
        payment_type?: string;
        signature_key?: string;
        status_code?: string;
        status_message?: string;
    }

    export interface CallbackOptions {
        onSuccess?: (result: SnapPaymentResult) => void;
        onPending?: (result: SnapPaymentResult) => void;
        onError?: (result: SnapPaymentResult) => void;
        onClose?: () => void;
    }
}
