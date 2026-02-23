import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await req.json();
        const { quantity } = body;

        if (!quantity || quantity < 1) {
            return NextResponse.json(
                { message: "Invalid quantity" },
                { status: 400 }
            );
        }

        const cartItem = await prisma.cart.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (!cartItem) {
            return NextResponse.json(
                { message: "Cart item not found" },
                { status: 404 }
            );
        }

        const updatedCart = await prisma.cart.update({
            where: { id },
            data: { quantity },
        });

        return NextResponse.json(updatedCart);
    } catch (error) {
        console.error("Error updating cart:", error);
        return NextResponse.json(
            { message: "Failed to update cart" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const cartItem = await prisma.cart.findFirst({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (!cartItem) {
            return NextResponse.json(
                { message: "Cart item not found" },
                { status: 404 }
            );
        }

        await prisma.cart.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Item removed from cart" });
    } catch (error) {
        console.error("Error deleting cart item:", error);
        return NextResponse.json(
            { message: "Failed to delete cart item" },
            { status: 500 }
        );
    }
}
