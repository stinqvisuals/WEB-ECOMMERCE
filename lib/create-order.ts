import { prisma } from "@/lib/prisma";

export async function createOrder(userId: string, cartItems: any[]) {

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const order = await prisma.order.create({
        data: {
            userId,
            totalAmount,
            status: "PENDING",
            items: {
                create: cartItems.map((item) => ({
                    productId: item.clothesId,
                    quantity: item.quantity,
                    price: item.price
                }))
            }
        }
    });

    return order;
}