import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Get cart item by ID
        const cart = await prisma.cart.findUnique({
            where: { id },
            include: {
                clothes: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        price: true
                    }
                },
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });

        if (!cart) {
            return NextResponse.json(
                { message: "Cart item not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(cart);
    } catch (error) {
        console.error("Error fetching cart:", error);
        return NextResponse.json(
            { message: "Failed to fetch cart" },
            { status: 500 }
        );
    }
}

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
