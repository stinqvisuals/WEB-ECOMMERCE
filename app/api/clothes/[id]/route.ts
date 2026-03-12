import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Get clothes item by ID
        const clothes = await prisma.clothes.findUnique({
            where: { id }
        });

        if (!clothes) {
            return NextResponse.json(
                { message: "Clothes not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(clothes);
    } catch (error) {
        console.error("Error fetching clothes:", error);
        return NextResponse.json(
            { message: "Failed to fetch clothes" },
            { status: 500 }
        );
    }
}

