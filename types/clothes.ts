import { Prisma } from "@prisma/client";

export type ClothesProps = Prisma.ClothesGetPayload<{
    include: { ClothesAmenities: { select: { amenitiesId: true } } }
}>