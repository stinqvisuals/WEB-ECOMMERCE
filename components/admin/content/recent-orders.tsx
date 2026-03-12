import { getRecentOrders } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";

// Type for grouped order (array of cart items from same user/order)
type OrderGroup = {
    id: string;
    clothesId: string;
    quantity: number;
    price: number;
    userId: string;
    createdAt: Date;
    clothes: {
        id: string;
        name: string;
        image: string;
        price: number;
    };
    payments: {
        id: string;
        status: string;
        amount: number;
    }[];
    user: {
        id: string;
        name: string | null;
        email: string;
    };
}[];

const RecentOrders = async () => {
    const orders = await getRecentOrders(5);

    if (!orders || orders.length === 0) {
        return (
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">Recent Orders</h2>
                <div className="bg-black p-8 rounded-md">
                    <p className="text-white text-center">No orders yet</p>
                </div>
            </div>
        );
    }

    const getStatusBadge = (payments: any) => {
        if (!Array.isArray(payments)) {
            return <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold">New</span>;
        }
        // Check if any payment is "paid" - then order is completed
        const hasPaidPayment = payments.some((p: any) => p.status === "paid");
        const hasPendingPayment = payments.some((p: any) => p.status === "pending");

        if (hasPaidPayment) {
            return <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Completed</span>;
        }
        if (hasPendingPayment) {
            return <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Pending</span>;
        }
        return <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold">New</span>;
    };

    // Calculate total price for an order group
    const calculateTotal = (orderGroup: OrderGroup) => {
        return orderGroup.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    // Calculate total quantity for an order group
    const calculateTotalQuantity = (orderGroup: OrderGroup) => {
        return orderGroup.reduce((sum, item) => sum + item.quantity, 0);
    };

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-bold text-white mb-4">Recent Orders</h2>
            <div className="bg-black rounded-md overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-800">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Items</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {orders.map((orderGroup, index) => {
                                // Each orderGroup is an array of cart items
                                const firstItem = orderGroup[0];
                                const paymentStatus = firstItem.payments;
                                const totalPrice = calculateTotal(orderGroup);
                                const totalQuantity = calculateTotalQuantity(orderGroup);
                                const itemCount = orderGroup.length;

                                return (
                                    <tr key={`${firstItem.userId}-${index}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-white text-sm font-mono">
                                                #{firstItem.id.slice(-8).toUpperCase()}
                                            </span>
                                            {itemCount > 1 && (
                                                <span className="ml-2 text-xs text-gray-400">
                                                    +{itemCount - 1} more
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white font-medium">{firstItem.user.name || "Guest"}</div>
                                            <div className="text-gray-400 text-xs">{firstItem.user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                {orderGroup.slice(0, 2).map((item, idx) => (
                                                    <div key={idx} className="flex items-center">
                                                        <div className="relative h-10 w-10 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                                                            <Image
                                                                src={item.clothes.image}
                                                                fill
                                                                sizes="40px"
                                                                alt={item.clothes.name}
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="ml-3">
                                                            <span className="text-white text-sm block line-clamp-1">
                                                                {item.clothes.name}
                                                            </span>
                                                            <span className="text-gray-400 text-xs">
                                                                x{item.quantity}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {itemCount > 2 && (
                                                    <span className="text-gray-400 text-xs ml-1">
                                                        +{itemCount - 2} more items
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-white font-semibold">{formatCurrency(totalPrice)}</span>
                                            <div className="text-gray-400 text-xs">
                                                {totalQuantity} item(s)
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(paymentStatus)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-gray-400 text-sm">
                                                {new Date(firstItem.createdAt).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RecentOrders;

