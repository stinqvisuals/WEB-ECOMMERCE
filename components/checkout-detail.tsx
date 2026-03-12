"use client";

import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import PaymentButton from "@/components/payment-button";
import { checkoutData, CartItemData } from "@/types/checkout";
import { useEffect, useState } from "react";
import { DefaultSession } from "next-auth";

type Props = {
    id?: string;
    cartItems?: CartItemData[];
    user?: DefaultSession["user"];
};

const CheckoutDetail = ({ id, cartItems: passedCartItems, user }: Props) => {
    const [cartItems, setCartItems] = useState<CartItemData[] | null>(passedCartItems || null);
    const [loading, setLoading] = useState(!passedCartItems && !!id);
    const [isMultiItemCheckout, setIsMultiItemCheckout] = useState(!!(passedCartItems && passedCartItems.length > 0));

    useEffect(() => {
        // If no passed cart items and we have an id, fetch the cart data on client side
        if (!passedCartItems && id) {
            const fetchCartData = async () => {
                try {
                    const response = await fetch(`/api/cart/${id}`);

                    if (response.ok) {
                        const cart = await response.json();
                        if (cart && cart.clothes) {
                            setCartItems([{
                                id: cart.id,
                                quantity: cart.quantity,
                                price: cart.price,
                                clothes: {
                                    id: cart.clothes.id,
                                    name: cart.clothes.name,
                                    image: cart.clothes.image,
                                    price: cart.clothes.price
                                }
                            }]);
                            setIsMultiItemCheckout(false);
                        }
                    } else {
                        // Try as direct buy (clothes id)
                        const clothesResponse = await fetch(`/api/clothes/${id}`);
                        if (clothesResponse.ok) {
                            const clothes = await clothesResponse.json();
                            setCartItems([{
                                id: id,
                                quantity: 1,
                                price: clothes.price,
                                clothes: {
                                    id: clothes.id,
                                    name: clothes.name,
                                    image: clothes.image,
                                    price: clothes.price
                                }
                            }]);
                            setIsMultiItemCheckout(false);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching cart data:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchCartData();
        }
    }, [id, passedCartItems]);

    // Use passed cart items if available
    useEffect(() => {
        if (passedCartItems && passedCartItems.length > 0) {
            setCartItems(passedCartItems);
            setIsMultiItemCheckout(true);
        }
    }, [passedCartItems]);

    // Debug logging - Updated for new logic (temporarily disabled totalPrice dep to avoid hoisting issue)
    useEffect(() => {
        console.log("=== CHECKOUT DEBUG ===");
        console.log("Cart Items Count:", cartItems?.length || 0);
        console.log("Cart Items:", cartItems);
    }, [cartItems]);

    // Early return for loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    // Early return for empty cart
    if (!cartItems || cartItems.length === 0) {
        return <h1 className="text-white">No Product Found</h1>;
    }

    // Calculate totals
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Helper for cart details
    const cartDetails = cartItems.map(item => ({
        name: item.clothes.name,
        image: item.clothes.image,
        price: item.clothes.price
    }));

    // Prepare checkout data for payment
    const checkoutData: checkoutData = {
        id: cartItems[0]?.id || id || "",
        price: totalPrice,
        quantity: totalQuantity,
        user: user ? {
            name: user.name,
            email: user.email,
            phone: "phone" in user ? user.phone : undefined
        } : null,
        clothes: cartItems.length === 1 ? cartDetails[0] : null,
        payments: null,
        cartItems: cartItems
    };

    return (
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 items-start">

            {/* LEFT SIDE */}
            <div className="space-y-6">

                {/* ORDER SUMMARY */}
                <div className="px-6 py-6 mt-10 bg-black rounded-sm min-h-[360px]">

                    <h2 className="text-xl font-semibold mb-6 text-white">
                        Order Summary
                    </h2>

                    {/* Customer Info */}
                    {user && (
                        <div className="mb-6 pb-4 border-b border-gray-800">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Customer</h3>
                            <p className="text-white font-medium">{user.name || "Guest"}</p>
                            <p className="text-gray-400 text-sm">{user.email || "No email"}</p>
                        </div>
                    )}

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Quantity</span>
                            <span className="text-white">{totalQuantity}</span>
                        </div>
                        <div className="flex justify-between pt-4 border-t border-gray-800 text-lg font-semibold">
                            <span>Total</span>
                            <span>{formatCurrency(totalPrice)}</span>
                        </div>
                    </div>
                </div>

                {/* SHIPPING ADDRESS */}
                <div className="px-6 py-6 bg-black rounded-sm">

                    <h2 className="text-xl font-semibold mb-4 text-white">
                        Shipping Address
                    </h2>

                    <form id="shipping-form" className="w-full text-sm">

                        <div className="mt-4">
                            <label className="text-sm text-gray-400">
                                Full Address
                            </label>
                            <textarea
                                name="address"
                                id="address"
                                rows={3}
                                className="w-full mt-1 p-3 bg-transparent border border-gray-700 rounded-sm text-white"
                                placeholder="Street, house number, district..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="text-sm text-gray-400">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    id="city"
                                    className="w-full mt-1 p-3 bg-transparent border border-gray-700 rounded-sm text-white"
                                    placeholder="City"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-400">
                                    Postal Code
                                </label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    id="postalCode"
                                    className="w-full mt-1 p-3 bg-transparent border border-gray-700 rounded-sm text-white"
                                    placeholder="Postal Code"
                                />
                            </div>
                        </div>

                        <div className="mt-5">
                            <label className="text-sm text-gray-400">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                className="w-full mt-1 p-3 bg-transparent border border-gray-700 rounded-sm text-white"
                                placeholder="08xxxxxxxxxx"
                            />
                        </div>

                        <PaymentButton checkoutData={checkoutData} />

                    </form>
                </div>
            </div>

            {/* RIGHT SIDE PRODUCTS - CONDITIONAL SINGLE vs MULTI */}
            <div className="lg:col-span-1 pt-4 lg:pt-0">
                {cartItems.length === 1 ? (
                    // SINGLE ITEM: Large image
                    <>
                        <div className="block relative mt-15 aspect-square w-full mx-auto">
                            <Image
                                src={cartItems[0].clothes.image}
                                alt={cartItems[0].clothes.name}
                                fill
                                className="object-cover rounded-sm"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                            />
                        </div>

                        <div className="pt-4 text-left">
                            <h4 className="text-3xl lg:text-5xl font-bold text-white">
                                {cartItems[0].clothes.name}
                            </h4>
                            <div className="mt-2">
                                <span className="text-xl lg:text-3xl font-semibold text-gray-300">
                                    {formatCurrency(cartItems[0].clothes.price)}
                                </span>
                                <span className="text-lg text-gray-400 ml-4">x {cartItems[0].quantity}</span>
                            </div>
                        </div>
                    </>
                ) : (
                    // MULTI ITEMS: Small grid like cart
                    <div className="space-y-4 mt-15">
                        <h3 className="text-xl font-semibold text-white">Products ({cartItems.length})</h3>
                        {cartItems.map((item, index) => (
                            <div key={item.id || index} className="bg-neutral-900 rounded-xl p-4 flex gap-4 items-center">
                                {/* Small image */}
                                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-black">
                                    <Image
                                        src={item.clothes.image}
                                        alt={item.clothes.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-lg truncate">{item.clothes.name}</h4>
                                    <p className="text-gray-400 text-sm">{formatCurrency(item.price)} / piece</p>
                                </div>

                                {/* Price & Qty */}
                                <div className="flex flex-col items-end gap-1 text-right">
                                    <p className="font-semibold text-lg">{formatCurrency(item.price * item.quantity)}</p>
                                    <span className="text-sm text-gray-400">x{item.quantity}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default CheckoutDetail;

