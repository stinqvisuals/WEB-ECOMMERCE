import Image from "next/image";
import Link from "next/link";

const Hero = () => {
    return (
        <section className="relative w-full min-h-screen flex items-center justify-center text-white overflow-hidden">

            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/bg1.png"
                    alt="hero image"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Content */}
            <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center flex flex-col items-center">

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-4">
                    Order Now
                </h1>

                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-8 max-w-2xl">
                    Get Special Offer Just For You Today
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">

                    <Link
                        href="/clothes"
                        className="w-full sm:w-auto text-center bg-red-600 hover:bg-red-700 py-3 px-8 text-base md:text-lg font-semibold transition duration-300 hover:scale-105"
                    >
                        Order Now
                    </Link>

                    <Link
                        href="/contact"
                        className="w-full sm:w-auto text-center border border-red-600 hover:bg-red-700 py-3 px-8 text-base md:text-lg font-semibold transition duration-300 hover:scale-105"
                    >
                        Contact Us
                    </Link>

                </div>
            </div>
        </section>
    );
};

export default Hero;