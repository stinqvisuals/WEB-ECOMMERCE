import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {

    const body = await req.json();

    const orderId = body.order_id;
    const transactionStatus = body.transaction_status;

    console.log("MIDTRANS:", body);

    if (
        transactionStatus === "settlement" ||
        transactionStatus === "capture"
    ) {

        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: "PAID",
                midtransId: body.transaction_id
            }
        });

        console.log("ORDER SUCCESS:", orderId);
    }

    if (
        transactionStatus === "cancel" ||
        transactionStatus === "expire"
    ) {

        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: "CANCELLED"
            }
        });

    }

    return NextResponse.json({ success: true });
}