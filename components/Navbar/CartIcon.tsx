"use client";

import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";

const CartIcon = () => {
    const { data: session } = useSession();
    if (!session?.user) return null;

    return (
        <Link href="/cart" className="text-white hover:text-gray-400 transition">
            <IoCartOutline className="size-7" />
        </Link>
    );
};

export default CartIcon;