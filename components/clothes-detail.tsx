import Image from "next/image";
import { getClothesDetailById } from "@/lib/data";
import { notFound } from "next/navigation";
import { IoCheckmark, IoShirtOutline } from "react-icons/io5";
import { formatCurrency } from "@/lib/utils";
import CartForm from "@/components/cart-form";
import { auth } from "@/auth";
import Link from "next/link";

const ClothesDetail = async ({ clothesId }: { clothesId: string }) => {
    const clothes = await getClothesDetailById(clothesId);
    const session = await auth();
    const userId = session?.user?.id || null;

    if (!clothes) return notFound();

    return (
        <div className="max-w-7xl mx-auto px-6 py-16">

            <div className="grid lg:grid-cols-2 gap-16 items-start">

                {/* LEFT SIDE - IMAGE */}
                <div className="w-full">
                    <div className="relative aspect-square w-full bg-neutral-900 rounded-xl overflow-hidden">
                        <Image
                            src={clothes.image}
                            alt={clothes.name}
                            fill
                            className="object-contain"
                            priority
                            quality={100}
                        />
                    </div>
                </div>

                {/* RIGHT SIDE - PRODUCT INFO */}
                <div className="flex flex-col space-y-6">

                    {/* NAME */}
                    <h1 className="text-2xl font-bold tracking-tight">
                        {clothes.name}
                    </h1>

                    {/* PRICE */}
                    <div className="text-1xl font-semibold">
                        {formatCurrency(clothes.price)}
                        <span className="text-gray-400 text-base ml-2"></span>
                    </div>

                    {/* STOCK */}
                    <div className="flex items-center gap-2 text-gray-500">
                        <IoShirtOutline className="size-5" />
                        <span>{clothes.quantity} Pieces</span>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="border-t border-neutral-800 pt-6">
                        <p className="text-gray-400 leading-8 break-words">
                            {clothes.description}
                        </p>
                    </div>

                    {/* AMENITIES */}
                    <div>
                        <h5 className="font-semibold mb-3">Features</h5>
                        <div className="flex flex-wrap gap-3">
                            {clothes.ClothesAmenities.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-2 bg-neutral-900 px-4 py-2 rounded-full text-sm"
                                >
                                    <IoCheckmark className="text-green-500" />
                                    <span>{item.Amenities.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ADD TO CART */}
                    <div className="pt-6">
                        <CartForm
                            clothesId={clothes.id}
                            price={clothes.price}
                            userId={userId}
                            stock={clothes.quantity}
                        />

                        <Link href={`/checkout?clothesId=${clothes.id}`}
                            className="block w-full text-center border border-white mt-4 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition">
                            Buy Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ClothesDetail