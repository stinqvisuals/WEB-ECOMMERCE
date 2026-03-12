"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const Navlink = () => {
    const { data: session } = useSession();

    return (
        <ul className="flex items-center gap-8 font-semibold text-sm uppercase text-white">
            <li><Link href="/" className="hover:text-gray-400 transition">Home</Link></li>
            <li><Link href="/about" className="hover:text-gray-400 transition">About</Link></li>
            <li><Link href="/clothes" className="hover:text-gray-400 transition">Clothes</Link></li>
            <li><Link href="/contact" className="hover:text-gray-400 transition">Contact</Link></li>

            {session?.user?.role === "admin" && (
                <>
                    <li><Link href="/admin/clothes" className="hover:text-gray-400 transition">Manage</Link></li>
                    <li><Link href="/admin/dashboard" className="hover:text-gray-400 transition">Dashboard</Link></li>
                </>
            )}
        </ul>
    );
};

export default Navlink;