"use client";

import { useRouter } from "next/navigation";

type Props = {
    clothesId: string;
    price: number;
    userId: string | null;
};

const BuyNowButton = ({ clothesId, price, userId }: Props) => {
    const router = useRouter();

    const handleBuyNow = () => {
        // Check if user is logged in
        if (!userId) {
            alert("Please login first to buy");
            return;
        }

        // Direct to buy-now checkout (no cart DB entry)
        router.push(`/checkout/buy-now/${clothesId}`);
    };

    return (
        <button
            type="button"
            onClick={handleBuyNow}
            className="block w-full text-center border border-white mt-4 py-3 cursor-pointer rounded-lg font-semibold hover:bg-white hover:text-black transition"
        >
            Buy Now
        </button>
    );
};

export default BuyNowButton;
