import Link from "next/link";
import Image from "next/image";
import Navlink from "@/components/Navbar/Navlink";
import RightSection from "@/components/Navbar/RightSection";

const Navbar = () => {
    return (
        <div className="fixed top-0 w-full bg-black z-50">
            <div className="max-w-screen-xl mx-auto px-4">

                <div className="flex items-center justify-between h-20">

                    {/* LEFT */}
                    <Link href="/">
                        <Image
                            src="/STINQ LOGO CHROME BLACK.png"
                            width={120}
                            height={45}
                            alt="logo"
                            priority
                        />
                    </Link>

                    {/* CENTER (DESKTOP ONLY) */}
                    <div className="hidden lg:flex">
                        <Navlink />
                    </div>

                    {/* RIGHT */}
                    <RightSection />

                </div>
            </div>
        </div>
    );
};

export default Navbar;