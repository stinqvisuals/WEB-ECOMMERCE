import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
    try {
        const session = await auth();

        console.log("=== CART API POST ===");
        console.log("Session:", session);

        if (!session?.user?.id) {
            console.log("Unauthorized - No session or user ID");
            return NextResponse.json(
                { message: "Unauthorized - Please login first" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { clothesId, quantity, price } = body;

        console.log("Cart data received:", { clothesId, quantity, price, userId: session.user.id });

        if (!clothesId || !quantity || !price) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        console.log("Creating new cart item (always new record for persistence)...");
        const cart = await prisma.cart.create({
            data: {
                clothesId,
                quantity: Number(quantity),
                price: Number(price),
                userId: session.user.id,
            },
        });

        console.log("Cart created successfully:", cart);
        return NextResponse.json(cart);
    } catch (error) {
        console.error("Error adding to cart:", error);

        return NextResponse.json(
            { message: "Failed to add cart" },
            { status: 500 }
        );
    }
}
