import Image from "next/image";
import Link from "next/link";


const Hero = () => {
    return (
        <div className="relative h-screen text-white overflow-hidden">
            <div className="absolute inset-0">
                <Image src="/bg1.png" alt="hero image" fill className="object-cover object-center 
                w-full h-full"/>
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            <div className="relative flex flex-col justify-center items-center h-full text-center">
                <h1 className="text-7xl font-extrabold leading-tight mb-3 capitalize">Order Now</h1>
                <p className="text-xl text-gray-300 mb-8">Get Special Offer Just For You Today</p>
                <div className="flex gap-5">
                    <Link href="/clothes" className="bg-red-600 text-white hover:bg-red-700 py-2.5 px-6 md:px-10 text-lg font-semibold hover:scale-105
                    hover:shadow-lg">Order Now</Link>
                    <Link href="/contact" className="bg-transparent border border-red-600 text-white hover:bg-red-700 py-2.5 px-6 md:px-10 text-lg font-semibold hover:scale-105
                    hover:shadow-lg">Contact Us</Link>
                </div>
            </div>
        </div>
    )
}

export default Hero 