import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!
});

export async function createMidtransTransaction(order: any) {

    const parameter: any = {
        transaction_details: {
            order_id: order.id,
            gross_amount: order.totalAmount
        },

        customer_details: {
            first_name: order.user?.name || "Customer",
            email: order.user?.email
        }
    };

    const transaction = await (snap as any).createTransaction(parameter);

    return transaction;
}