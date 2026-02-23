import Image from "next/image";
import Link from "next/link";
import { IoShirtOutline } from "react-icons/io5";
import { Clothes } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";

const Card = ({ clothes }: { clothes: Clothes }) => {
    return (
        <div className="bg-transparent rounded-lg overflow-hidden transition duration-300">

            {/* Clickable Image Only */}
            <Link
                href={`/clothes/${clothes.id}`}
                className="block relative aspect-square w-full group"
            >
                <Image
                    src={clothes.image}
                    alt="clothes-image"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    className="object-cover transition duration-100 group-hover:scale-100"
                />

                {/* Optional subtle hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-100" />
            </Link>

            {/* Content (Not Clickable) */}
            <div className="pt-4 sm:pt-6">

                {/* Name */}
                <h4 className="text-lg sm:text-xl lg:text-2xl font-medium text-white">
                    {clothes.name}
                </h4>

                {/* Price */}
                <div className="mt-2 mb-4">
                    <span className="text-lg sm:text-xl font-semibold text-gray-300">
                        {formatCurrency(clothes.price)}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">/Pieces</span>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <IoShirtOutline />
                    <span>{clothes.quantity} Pieces</span>
                </div>

            </div>
        </div>
    );
};

export default Card;