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
                Payment: true,
                user: {
                    select: {
                        name: true,
                        email: true
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
        console.log('=== EXACT REVENUE DASHBOARD ===');

        const revenueResult = await prisma.payment.aggregate({
            where: { status: "paid" },
            _sum: { amount: true }
        });

        const revenue = Number(revenueResult._sum.amount || 0);
        console.log('Payment SUM = Rp', revenue);

        const totalOrders = await prisma.cart.count();
        const completedOrders = await prisma.payment.count({ where: { status: "paid" } });

        const paidPayments = await prisma.payment.findMany({
            where: { status: "paid" },
            include: {
                cart: {
                    select: {
                        userId: true
                    }
                }
            }
        });

        const uniqueUserIds = new Set(paidPayments.map(p => p.cart?.userId).filter(id => id != null));
        const totalCustomers = uniqueUserIds.size;

        console.log('Stats: revenue=', revenue, 'customers=', totalCustomers);

        return {
            revenue,
            totalOrders,
            totalCustomers,
            completedOrders,
            pendingOrders: await prisma.payment.count({ where: { status: "pending" } }),
            newOrders: totalOrders - completedOrders,
            failedOrders: await prisma.payment.count({ where: { status: "failure" } }),
            allCustomers: await prisma.user.count()
        };
    } catch (error) {
        console.error('Dashboard error:', error);
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

export const getRecentOrders = async (limit: number = 5): Promise<any[]> => {
    try {
        console.log('Fetching recent orders...');

        const recentCarts = await prisma.cart.findMany({
            orderBy: {
                createdAt: "desc"
            },
            take: limit * 2,
            include: {
                clothes: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        price: true
                    }
                },
                Payment: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        console.log('Recent carts count:', recentCarts.length);
        if (recentCarts.length === 0) return [];

        // Group by user + minute (order detection)
        const groups: Record<string, typeof recentCarts> = {};

        recentCarts.forEach(cart => {
            const minuteKey = Math.floor(new Date(cart.createdAt).getTime() / 60000);
            const key = `${cart.userId}-${minuteKey}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(cart);
        });

        const recentOrders = Object.values(groups)
            .sort((a, b) => new Date(b[0].createdAt).getTime() - new Date(a[0].createdAt).getTime())
            .slice(0, limit);

        console.log('Recent orders first:', recentOrders[0]?.length ? recentOrders[0][0].clothes.name : 'empty');
        return recentOrders;
    } catch (error) {
        console.error('Recent orders error:', error);
        return [];
    }
};

// Safe functions without complex relations
export const getRevenueAndClothes = async () => {
    try {
        const paidPayments = await prisma.payment.findMany({
            where: { status: "paid" }
        });
        const revenue = paidPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        return { revenue, clothes: paidPayments.length };
    } catch (error) {
        console.log(error);
        return { revenue: 0, clothes: 0 };
    }
};

export const getTotalCustomers = async () => {
    try {
        const paidPayments = await prisma.payment.findMany({
            where: { status: "paid" }
        });
        return paidPayments.length;
    } catch (error) {
        console.log(error);
        return 0;
    }
};

export const getUserCart = async (userId: string) => {
    try {
        const cartItems = await prisma.cart.findMany({
            where: { userId },
            include: {
                clothes: { select: { id: true, name: true, image: true, price: true } },
                Payment: true,
                user: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: "desc" }
        });
        return cartItems;
    } catch (error) {
        console.log(error);
        return [];
    }
}

