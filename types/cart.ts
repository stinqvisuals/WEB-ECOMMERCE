import { Prisma } from "@prisma/client";

export type cartProps = Prisma.CartGetPayload<{
    include: {
        clothes: {
            select: {
                name: true,
                image: true,
                price: true
            }
        }
        user: {
            select: {
                name: true,
                phone: true,
                email: true
            }
        }
        payments: true;
    }
}>
