import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createMidtransTransaction } from "@/lib/midtrans";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {

    try {

        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const cartItems = await prisma.cart.findMany({
            where: {
                userId: user.id
            },
            include: {
                clothes: true
            }
        });

        if (cartItems.length === 0) {
            return NextResponse.json(
                { error: "Cart is empty" },
                { status: 400 }
            );
        }

        const totalAmount = cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const order = await prisma.order.create({
            data: {
                userId: user.id,
                totalAmount,
                status: "PENDING",
                items: {
                    create: cartItems.map((item) => ({
                        productId: item.clothesId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: {
                user: true
            }
        });

        const midtrans = await createMidtransTransaction(order);

        return NextResponse.json({
            token: midtrans.token,
            redirect_url: midtrans.redirect_url
        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { error: "Checkout failed" },
            { status: 500 }
        );

    }

}