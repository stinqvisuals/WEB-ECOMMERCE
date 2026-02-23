"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const Navlink = () => {
    const { data: session } = useSession();

    return (
        <ul className="flex items-center gap-8 font-semibold text-sm uppercase text-white">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/clothes">Clothes</Link></li>
            <li><Link href="/contact">Contact</Link></li>

            {session?.user?.role === "admin" && (
                <>
                    <li><Link href="/admin/clothes">Manage</Link></li>
                    <li><Link href="/admin/dashboard">Dashboard</Link></li>
                </>
            )}
        </ul>
    );
};

export default Navlink;