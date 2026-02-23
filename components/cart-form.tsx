"use client";

import { useState } from "react";

type Props = {
    clothesId: string;
    price: number;
    userId: string | null;
    stock?: number;
};

const CartForm = ({ clothesId, price, userId, stock = 99 }: Props) => {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= stock) {
            setQuantity(newQuantity);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if user is logged in
        if (!userId) {
            setMessage("Please login first to add to cart");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    clothesId,
                    quantity,
                    price,
                    userId,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setMessage("✅ Added to cart successfully!");
            setQuantity(1);
        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* QUANTITY SELECTOR */}
            <div>
                <label className="block mb-2 text-sm font-medium">
                    Quantity
                </label>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-700 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        -
                    </button>
                    <span className="text-lg font-semibold w-12 text-center">
                        {quantity}
                    </span>
                    <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= stock}
                        className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-700 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* MESSAGE */}
            {message && (
                <p className={`text-sm ${message.includes("✅") ? "text-green-400" : "text-red-400"}`}>
                    {message}
                </p>
            )}

            {/* BUTTON */}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-600 rounded-md font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
                {loading ? "Adding..." : "Add to Cart"}
            </button>
        </form>
    );
};

export default CartForm;
