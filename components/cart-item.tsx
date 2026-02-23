"use client";

import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { IoTrashOutline, IoAdd, IoRemove } from "react-icons/io5";
import { useState } from "react";

type CartItemProps = {
    item: {
        id: string;
        clothesId: string;
        quantity: number;
        price: number;
        clothes: {
            id: string;
            name: string;
            image: string;
            price: number;
        };
    };
};

const CartItem = ({ item }: CartItemProps) => {
    const [quantity, setQuantity] = useState(item.quantity);
    const [loading, setLoading] = useState(false);

    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity < 1) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/cart/${item.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            if (res.ok) {
                setQuantity(newQuantity);
                window.location.reload();
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/cart/${item.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error("Error removing item:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-neutral-900 rounded-xl p-4 flex gap-4 items-center">
            {/* IMAGE */}
            <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-black">
                <Image
                    src={item.clothes.image}
                    alt={item.clothes.name}
                    fill
                    className="object-contain"
                />
            </div>

            {/* INFO */}
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">
                    {item.clothes.name}
                </h3>
                <p className="text-gray-400 text-sm">
                    {formatCurrency(item.price || 0)} / piece
                </p>

                {/* QUANTITY CONTROLS */}
                <div className="flex items-center gap-3 mt-2">
                    <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={loading || quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-700 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <IoRemove className="size-4" />
                    </button>
                    <span className="font-semibold w-8 text-center">
                        {quantity}
                    </span>
                    <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={loading}
                        className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-700 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <IoAdd className="size-4" />
                    </button>
                </div>
            </div>

            {/* PRICE & REMOVE */}
            <div className="flex flex-col items-end gap-2">
                <p className="font-semibold text-lg">
                    {formatCurrency((item.price || 0) * quantity)}
                </p>
                <button
                    onClick={handleRemove}
                    disabled={loading}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-md transition disabled:opacity-50"
                >
                    <IoTrashOutline className="size-5" />
                </button>
            </div>
        </div>
    );
};

export default CartItem;