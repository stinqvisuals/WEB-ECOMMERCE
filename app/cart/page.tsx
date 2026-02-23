import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCartItems } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import CartItem from "@/components/cart-item";
import Link from "next/link";

const CartPage = async () => {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/signin");
    }

    const cartItems = await getCartItems(session.user.id) || [];

    const totalPrice = cartItems.reduce((total, item) => {
        return total + ((item.price || 0) * (item.quantity || 1));
    }, 0);

    return (
        <div className="py-20 mt-10 max-w-7xl mx-auto px-6">
            <h1 className="text-3xl font-bold mb-8">My Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-lg">Your cart is empty</p>
                    <a href="/clothes" className="inline-block mt-4 px-6 py-3 bg-red-700 rounded-md font-semibold hover:bg-red-600 transition">
                        Browse Clothes
                    </a>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* CART ITEMS */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                            />
                        ))}
                    </div>

                    {/* SUMMARY */}
                    <div className="lg:col-span-1">
                        <div className="bg-neutral-900 rounded-xl p-6 sticky top-24">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                            <div className="space-y-3 border-b border-gray-700 pb-4 mb-4">
                                <div className="flex justify-between text-gray-400">
                                    <span>Items ({cartItems.length})</span>
                                    <span>{formatCurrency(totalPrice)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-lg font-semibold mb-6">
                                <span>Total</span>
                                <span>{formatCurrency(totalPrice)}</span>
                            </div>

                            <Link href="/checkout" className="w-full py-3 px-3 bg-red-600 rounded-md font-semibold hover:bg-red-700 transition">
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
