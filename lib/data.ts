import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Amenities, Clothes, Cart } from '@prisma/client';

export const getAmenities = async (): Promise<Amenities[]> => {
    const session = await auth();
    if (!session || !session.user) {
        return [];
    }
    try {
        const result = await prisma.amenities.findMany();
        return result;
    } catch (error) {
        console.error("Error in getAmenities:", error);
        return [];
    }
};

export const getClothes = async (): Promise<Clothes[]> => {
    try {
        const clothes = await prisma.clothes.findMany({
            orderBy: { createdAt: "desc" },
        });
        return clothes;
    } catch (error) {
        console.error("Error in getClothes:", error);
        throw error;
    }
    return [];
}

export const getClothesById = async (clothesId: string): Promise<Clothes | null> => {
    try {
        const clothes = await prisma.clothes.findUnique({
            where: { id: clothesId },
            include: { ClothesAmenities: { select: { amenitiesId: true } } },
        });
        return clothes;
    } catch (error) {
        console.error("Error in getClothesById:", error);
        throw error;
    }
    return null;
}

export const getClothesDetailById = async (clothesId: string) => {
    try {
        const clothes = await prisma.clothes.findUnique({
            where: { id: clothesId },
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
        });
        return clothes;
    } catch (error) {
        console.log(error);
    }
}

export const getCartById = async (id: string) => {
    try {
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
                payments: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    }
                },
            },
        });
        return cart;
    } catch (error) {
        console.log(error);
    }
}

export const getCartItems = async (userId: string) => {
    try {
        const cartItems = await prisma.cart.findMany({
            where: { userId },
            include: {
                clothes: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return cartItems || [];
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const getRevenueAndClothes = async () => {
    try {
        // Get carts with successful payments (paid status)
        const carts = await prisma.cart.findMany({
            where: {
                payments: {
                    some: {
                        status: "paid",
                    },
                },
            },
            include: {
                payments: {
                    where: { status: "paid" }
                },
            },
        });

        // Calculate revenue by multiplying price with quantity for each cart item
        const revenue = carts.reduce((sum, cart) => sum + (cart.price * cart.quantity), 0);

        return {
            revenue: revenue,
            clothes: carts.length,
        };
    } catch (error) {
        console.log(error);
    }
}

export const getTotalCustomers = async () => {
    try {
        // Get unique users with successful payments
        const result = await prisma.cart.findMany({
            distinct: ["userId"],
            where: {
                payments: {
                    some: {
                        status: "paid",
                    },
                },
            },
            select: { userId: true }
        });
        return result;
    } catch (error) {
        console.log(error);
    }
}

export interface DashboardStats {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    newOrders: number;
    failedOrders: number;
    revenue: number;
    totalCustomers: number;
    allCustomers: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    try {
        const result = await prisma.$queryRaw`
            SELECT 
              (SELECT COUNT(*)::int FROM "Cart") as "totalOrders",
              COALESCE((SELECT COUNT(*)::int FROM "Cart" c WHERE EXISTS (SELECT 1 FROM "Payment" p WHERE p."cartId" = c.id AND p."status" = 'paid')), 0) as "completedOrders",
              COALESCE((SELECT COUNT(*)::int FROM "Cart" c WHERE EXISTS (SELECT 1 FROM "Payment" p WHERE p."cartId" = c.id AND p."status" = 'pending')), 0) as "pendingOrders",
              COALESCE((SELECT COUNT(*)::int FROM "Cart" c WHERE NOT EXISTS (SELECT 1 FROM "Payment" p WHERE p."cartId" = c.id)), 0) as "newOrders",
              COALESCE((SELECT COUNT(*)::int FROM "Cart" c WHERE EXISTS (SELECT 1 FROM "Payment" p WHERE p."cartId" = c.id AND p."status" = 'failure')), 0) as "failedOrders",
              COALESCE((SELECT SUM("price"::int * "quantity") FROM "Cart"), 0) as "revenue",
              COALESCE((SELECT COUNT(DISTINCT c."userId")::int FROM "Cart" c WHERE EXISTS (SELECT 1 FROM "Payment" p WHERE p."cartId" = c.id AND p."status" = 'paid')), 0) as "totalCustomers",
              (SELECT COUNT(DISTINCT "userId")::int FROM "Cart") as "allCustomers"
        ` as DashboardStats[];

        return result[0];

    } catch (error) {
        console.error('Dashboard stats error:', error);
        return {
            totalOrders: 0,
            pendingOrders: 0,
            completedOrders: 0,
            newOrders: 0,
            failedOrders: 0,
            revenue: 0,
            totalCustomers: 0,
            allCustomers: 0
        };
    }
};

export const getUserCart = async (userId: string) => {
    try {
        const cartItems = await prisma.cart.findMany({
            where: { userId },
            include: {
                clothes: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        price: true
                    }
                },
                payments: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    }
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return cartItems;
    } catch (error) {
        console.log(error);
    }
}

export const getRecentOrders = async (limit: number = 5) => {
    try {
        // Get all cart items
        const orders = await prisma.cart.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                clothes: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        price: true
                    }
                },
                payments: {
                    select: {
                        id: true,
                        status: true,
                        amount: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
        });

        // Group cart items by user and time (within a few minutes window = same order)
        const groupedOrders: Record<string, typeof orders> = {};

        orders.forEach((order) => {
            const userId = order.userId;
            // Use userId + createdAt minute as group key
            // This groups items added within the same minute as one order
            const timeKey = new Date(order.createdAt).getTime();
            const groupKey = `${userId}-${Math.floor(timeKey / (1000 * 60))}`;

            if (!groupedOrders[groupKey]) {
                groupedOrders[groupKey] = [];
            }
            groupedOrders[groupKey].push(order);
        });

        // Convert grouped orders to array and sort by most recent
        const result = Object.values(groupedOrders)
            .sort((a, b) => {
                const aDate = new Date(a[0].createdAt).getTime();
                const bDate = new Date(b[0].createdAt).getTime();
                return bDate - aDate;
            })
            .slice(0, limit);

        return result;
    } catch (error) {
        console.log(error);
    }
}
