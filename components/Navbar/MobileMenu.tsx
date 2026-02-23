"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";

interface MobileMenuProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const MobileMenu = ({ open, setOpen }: MobileMenuProps) => {
    const { data: session } = useSession();

    if (!open) return null;

    return (
        <div className="absolute top-15 right-0 w-64 bg-black border border-zinc-800 rounded-lg p-6 lg:hidden shadow-lg">

            <ul className="flex flex-col gap-4 text-white font-semibold uppercase text-sm">

                <li>
                    <Link href="/" onClick={() => setOpen(false)}>Home</Link>
                </li>
                <li>
                    <Link href="/about" onClick={() => setOpen(false)}>About</Link>
                </li>
                <li>
                    <Link href="/clothes" onClick={() => setOpen(false)}>Clothes</Link>
                </li>
                <li>
                    <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
                </li>

                {session?.user?.role === "admin" && (
                    <>
                        <li>
                            <Link href="/admin/clothes" onClick={() => setOpen(false)}>Manage</Link>
                        </li>
                        <li>
                            <Link href="/admin/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                        </li>
                    </>
                )}

                {!session?.user && (
                    <li>
                        <Link
                            href="/signin"
                            onClick={() => setOpen(false)}
                            className="bg-red-600 text-white hover:bg   -red-700 transition px-4 py-2 rounded font-bold text-center block mt-4"
                        >
                            Sign In
                        </Link>
                    </li>
                )}

                {session?.user && (
                    <button
                        onClick={() => {
                            signOut();
                            setOpen(false);
                        }}
                        className="bg-red-600 px-4 py-2 rounded font-bold mt-4"
                    >
                        Sign Out
                    </button>
                )}
            </ul>
        </div>
    );
};

export default MobileMenu;