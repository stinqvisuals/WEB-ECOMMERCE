import { prisma } from "./prisma";
import { DashboardStats } from './data';

export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        console.log('=== CALCULATING DASHBOARD STATS ===');

        // 1. Revenue: SUM(amount) from all PAID payments (ratusan → milyaran safe)
        const revenueResult = await prisma.payment.aggregate({
            where: {
                status: "paid"
            },
            _sum: {
                amount: true
            }
        });

        const revenue = Number(revenueResult._sum.amount || 0);
        console.log('Total revenue (paid payments):', revenue);

        // 2. Total orders = all carts
        const totalOrders = await prisma.cart.count();
        console.log('Total orders (carts):', totalOrders);

        // 3. Total customers = unique users with paid payments
        const paidCarts = await prisma.payment.findMany({
            where: { status: "paid" },
            include: {
                cart: {
                    select: {
                        userId: true
                    }
                }
            }
        });

        const totalCustomers = new Set(paidCarts.map(p => p.cart.userId)).size;
        console.log('Total customers (unique paid):', totalCustomers);

        // 4. Other stats
        const completedOrders = await prisma.payment.count({ where: { status: "paid" } });
        const pendingOrders = await prisma.payment.count({ where: { status: "pending" } });
        const failedOrders = await prisma.payment.count({ where: { status: "failure" } });
        const newOrders = totalOrders - completedOrders - pendingOrders - failedOrders;

        const stats = {
            revenue,
            totalOrders,
            totalCustomers,
            completedOrders,
            pendingOrders,
            newOrders,
            failedOrders,
            allCustomers: await prisma.user.count()
        };

        console.log('=== FINAL DASHBOARD STATS ===', stats);
        return stats;

    } catch (error) {
        console.error('Dashboard stats ERROR:', error);
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
}

