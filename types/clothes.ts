import { Prisma } from "@prisma/client";

export type ClothesProps = Prisma.ClothesGetPayload<{
    include: { ClothesAmenities: { select: { amenitiesId: true } } }
}>

export type ClothesDetailProps = Prisma.ClothesGetPayload<{
    include: {
        ClothesAmenities: {
            include: {
                Amenities: {
                    select: {
                        name: true,
                    }
                }
            }
        }
    },
}>
