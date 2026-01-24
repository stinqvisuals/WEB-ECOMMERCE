import Image from "next/image";
import Link from "next/link";
import {IoPeopleOutline} from "react-icons/io5";

const Card = () => {
  return (
    <div className="bg-black shadow-lg rounded-sm transition duration-100 hover:shadow-sm">
        <div className="h-[260px] w-auto rounded-t-sm relative">
            <Image src="/bg1.png" width={384} height={256} alt="clothes image" className="w-full h-full object-over rounded-t-sm"/>
        </div>
        <div className="p-8">
            <h4 className="text-2xl font-medium">
                <Link href="#" className="hover:text-red-700 transition duration-150">Stinq Clothes</Link>
            </h4>
            <h4 className="text-2xl mb-7">
                <span className="font-semibold text-gray-300">Rp 120000</span>
                <span className="text-gray-400 text-sm">/Pieces</span>
            </h4>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <IoPeopleOutline/>
                    <span>1 Pieces</span>
                </div>
                <Link href="#" className="px-6 py-2.5 md:px-10 md:py-3 font-semibold text-white bg-red-500 rounded-sm
                hover:bg-red-700 transition duration-150">Order Now</Link>
            </div>
        </div>
    </div>
  )
}

export default Card