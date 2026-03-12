import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentProps } from "@/types/payment";
import crypto from "crypto";

export const POST = async (request: Request) => {
    const data: PaymentProps = await request.json();

    console.log("=== PAYMENT NOTIFICATION RECEIVED ===");
    console.log("Order ID:", data.order_id);
    console.log("Transaction Status:", data.transaction_status);
    console.log("Gross Amount:", data.gross_amount);

    // Extract the original cart ID from order_id (which may include timestamp)
    let cartId = data.order_id;
    if (cartId && cartId.includes('-')) {
        const parts = cartId.split('-');
        cartId = parts[0];
    }

    console.log("Processed Cart ID:", cartId);

    const transactionStatus = data.transaction_status;
    const paymentType = data.payment_type || null;
    const fraudStatus = data.fraud_status;
    const statusCode = data.status_code;
    const grossAmount = data.gross_amount;
    const signatureKey = data.signature_key;

    // Skip signature verification for frontend calls
    const isFrontendCall = !signatureKey || signatureKey === "" || signatureKey === "demo";

    if (!isFrontendCall) {
        const hash = crypto.createHash("sha512").update(`${cartId}${statusCode}${grossAmount}${process.env.MIDTRANS_SERVER_KEY}`).digest("hex");
        if (signatureKey !== hash) {
            console.error("Invalid signature key");
            return NextResponse.json({ error: "Invalid Signature Key" }, { status: 400 });
        }
    }

    // Determine payment status
    let paymentStatus = "pending";
    if (transactionStatus == "capture") {
        if (fraudStatus == "accept") {
            paymentStatus = "paid";
        }
    } else if (transactionStatus == "settlement") {
        paymentStatus = "paid";
    } else if (transactionStatus == "cancel" || transactionStatus == "deny" || transactionStatus == "expire") {
        paymentStatus = "failure";
    } else if (transactionStatus == "pending") {
        paymentStatus = "pending";
    }

    console.log("Payment Status:", paymentStatus);

    try {
        // Check if cart exists
        const existingCart = await prisma.cart.findUnique({
            where: { id: cartId }
        });

        console.log("Existing Cart:", existingCart);

        if (!existingCart) {
            console.log("Cart not found, trying to find by clothesId...");
            const cartByClothes = await prisma.cart.findFirst({
                where: { clothesId: cartId },
                orderBy: { createdAt: "desc" },
                take: 1
            });

            if (cartByClothes) {
                console.log("Found cart by clothesId:", cartByClothes.id);

                // Create payment directly
                const payment = await prisma.payment.create({
                    data: {
                        cartId: cartByClothes.id,
                        method: paymentType,
                        amount: Number(grossAmount) || cartByClothes.price * cartByClothes.quantity,
                        status: paymentStatus,
                    },
                });

                console.log("Payment created for cart by clothesId:", payment);
                return NextResponse.json({ success: true, payment }, { status: 200 });
            }

            return NextResponse.json({ error: "Cart not found" }, { status: 404 });
        }

        // Use upsert to create or update payment record
        const payment = await prisma.payment.upsert({
            where: { cartId: existingCart.id },
            update: {
                method: paymentType,
                status: paymentStatus,
                amount: Number(grossAmount) || existingCart.price * existingCart.quantity,
            },
            create: {
                cartId: existingCart.id,
                method: paymentType,
                amount: Number(grossAmount) || existingCart.price * existingCart.quantity,
                status: paymentStatus,
            },
        });

        console.log("Payment saved:", payment);
        return NextResponse.json({ success: true, payment }, { status: 200 });

    } catch (error) {
        console.error("Error saving payment:", error);
        return NextResponse.json({ error: "Failed to save payment" }, { status: 500 });
    }
};
