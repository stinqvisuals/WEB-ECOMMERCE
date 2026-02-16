import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const getAmenities = async () => {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("Unauthorized Access");
    }
    try {
        const result = await prisma.amenities.findMany();
        return result;
    } catch (error) {
        console.log(error);
    }
}

export const getClothes = async () => {
    try {
        const clothes = await prisma.clothes.findMany({
            orderBy: { createdAt: "desc" },
        });
        return clothes;
    } catch (error) {
        console.log(error);
    }
}

export const getClothesById = async (clothesId: string) => {
    try {
        const clothes = await prisma.clothes.findUnique({
            where: { id: clothesId },
            include: { ClothesAmenities: { select: { amenitiesId: true } } },
        });
        return clothes;
    } catch (error) {
        console.log(error);
    }
}