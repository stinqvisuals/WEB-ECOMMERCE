"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { IoMenu, IoClose } from "react-icons/io5";
import Image from "next/image";
import CartIcon from "./CartIcon";
import MobileMenu from "./MobileMenu";
import Link from "next/link";

const RightSection = () => {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);

    return (
        <div className="relative flex items-center gap-4 text-white">

            {/* CART (ALL SCREEN IF LOGIN) */}
            <CartIcon />

            {/* DESKTOP PROFILE + SIGNOUT */}
            {session?.user && (
                <>
                    <Image
                        src={session.user.image || "/user.svg"}
                        width={32}
                        height={32}
                        alt="avatar"
                        className="hidden lg:block rounded-full border"
                    />

                    <button
                        onClick={() => signOut()}
                        className="hidden lg:block bg-red-600 px-4 py-2 rounded text-sm font-bold hover:bg-red-700 transition"
                    >
                        Sign Out
                    </button>

                </>
            )}

            {!session?.user && (
                <Link
                    href="/signin"
                    className="hidden lg:block bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded text-sm font-bold"
                >
                    Sign In
                </Link>
            )}

            {/* HAMBURGER (MOBILE ONLY) */}
            <button
                onClick={() => setOpen(!open)}
                className="lg:hidden"
            >
                {open ? <IoClose size={28} /> : <IoMenu size={28} />}
            </button>

            <MobileMenu open={open} setOpen={setOpen} />
        </div>
    );
};

export default RightSection;