import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized - Please login first" },
                { status: 401 }
            );
        }

        const body = await req.json();

        const { clothesId, quantity, price } = body;

        if (!clothesId || !quantity || !price) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if item already exists in cart for this user
        const existingCartItem = await prisma.cart.findFirst({
            where: {
                clothesId,
                userId: session.user.id,
            },
        });

        if (existingCartItem) {
            // Update quantity instead of creating new item
            const cart = await prisma.cart.update({
                where: { id: existingCartItem.id },
                data: {
                    quantity: existingCartItem.quantity + quantity,
                },
            });
            return NextResponse.json(cart);
        }

        const cart = await prisma.cart.create({
            data: {
                clothesId,
                quantity: Number(quantity),
                price: Number(price),
                userId: session.user.id,
            },
        });

        return NextResponse.json(cart);
    } catch (error) {
        console.error("Error adding to cart:", error);

        return NextResponse.json(
            { message: "Failed to add cart" },
            { status: 500 }
        );
    }
}
