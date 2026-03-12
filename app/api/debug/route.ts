import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Check database connection
        await prisma.$connect();

        // Get all carts with payment info
        const carts = await prisma.cart.findMany({
            include: {
                payments: true,
            },
        });

        // Get count
        const totalCarts = await prisma.cart.count();

        // Get completed orders
        const completedOrders = await prisma.cart.count({
            where: {
                payments: {
                    some: {
                        status: "paid"
                    }
                }
            }
        });

        // Get payments
        const payments = await prisma.payment.findMany();

        // Get all users
        const users = await prisma.user.findMany();

        return NextResponse.json({
            message: "Debug data",
            databaseConnected: true,
            totalCarts,
            completedOrders,
            totalPayments: payments.length,
            totalUsers: users.length,
            carts: carts.map(c => ({
                id: c.id,
                userId: c.userId,
                clothesId: c.clothesId,
                price: c.price,
                quantity: c.quantity,
                payments: c.payments
            })),
            payments: payments.map(p => ({
                id: p.id,
                cartId: p.cartId,
                status: p.status,
                amount: p.amount
            }))
        });
    } catch (error) {
        console.error("Debug error:", error);
        return NextResponse.json({
            error: "Debug failed",
            details: String(error)
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, cartId, price, quantity, userId, clothesId } = body;

        await prisma.$connect();

        if (action === "create_test_data") {
            // Get first user
            const user = await prisma.user.findFirst();
            if (!user) {
                return NextResponse.json({ error: "No users found" }, { status: 400 });
            }

            // Get first clothes
            const clothes = await prisma.clothes.findFirst();
            if (!clothes) {
                return NextResponse.json({ error: "No clothes found" }, { status: 400 });
            }

            // Create test cart
            const testCart = await prisma.cart.create({
                data: {
                    userId: user.id,
                    clothesId: clothes.id,
                    price: Number(price) || 100000,
                    quantity: Number(quantity) || 1,
                }
            });

            // Create payment with status "paid"
            const payment = await prisma.payment.create({
                data: {
                    cartId: testCart.id,
                    amount: Number(price) || 100000,
                    status: "paid",
                    method: "credit_card"
                }
            });

            return NextResponse.json({
                message: "Test data created",
                cart: testCart,
                payment: payment
            });
        }

        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    } catch (error) {
        console.error("Debug POST error:", error);
        return NextResponse.json({
            error: "Debug failed",
            details: String(error)
        }, { status: 500 });
    }
}

