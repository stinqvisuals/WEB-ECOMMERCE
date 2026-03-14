import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@prisma/client";

export const POST = async (request: Request) => {
    const body = await request.json();

    const orderId = body.order_id;
    const transactionStatus = body.transaction_status;
    const grossAmount = Number(body.gross_amount) || 0;
    const paymentType = body.payment_type || "unknown";

    console.log("=== PAYMENT NOTIFICATION ===");
    console.log({ orderId, transactionStatus, grossAmount, paymentType });

    if (transactionStatus === "settlement" || transactionStatus === "capture") {
        try {
            // 1. Update Order (multi-cart flow)
            const order = await prisma.order.findUnique({
                where: { id: orderId }
            });

            if (order) {
                await prisma.order.update({
                    where: { id: orderId },
                    data: { status: "PAID" as OrderStatus }
                });
                console.log("✅ Order PAID:", orderId);
            }

            // 2. **ONLY** create Payment - NO dummy carts for admin!
            const cart = await prisma.cart.findUnique({
                where: { id: orderId }
            });

            if (cart) {
                // Real cart exists - record payment
                await prisma.payment.upsert({
                    where: { cartId: cart.id },
                    update: {
                        status: "paid",
                        amount: grossAmount,
                        method: paymentType
                    },
                    create: {
                        cartId: cart.id,
                        status: "paid",
                        amount: grossAmount,
                        method: paymentType
                    }
                });
                console.log("✅ Payment recorded for real cart:", grossAmount, "cart:", cart.id, "clothes:", cart.clothesId);
            } else {
                console.log("⚠️ No matching cart for", orderId, "- tracking only");
                // No dummy cart creation = NO admin cart pollution
            }

        } catch (error) {
            console.error("Notification error:", error);
        }
    }

    return NextResponse.json({ received: true });
};

