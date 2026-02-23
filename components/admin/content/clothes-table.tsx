import { getClothes } from "@/lib/data";
import Image from "next/image";
import { DeleteButton, EditButton } from "@/components/admin/content/button";

interface ClothesItem {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    quantity: number;
    createdAt: Date;
}

const ClothesTable = async () => {
    const clothes = (await getClothes()) as unknown as ClothesItem[];

    if (!clothes || clothes.length === 0) {
        return <p className="text-white p-5">No Clothes Found</p>;
    }

    return (
        <div className="bg-black p-4 mt-5 shadow-sm overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 w-32 text-sm font-bold text-white uppercase text-left">Image</th>
                        <th className="px-6 py-3 text-sm font-bold text-white uppercase text-left">Clothes Name</th>
                        <th className="px-6 py-3 text-sm font-bold text-white uppercase text-left">Price</th>
                        <th className="px-6 py-3 text-sm font-bold text-white uppercase text-left">Created At</th>
                        <th className="px-6 py-3 text-sm font-bold text-white uppercase">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {clothes.map((item) => {
                        // FIX HARGA: Pastikan dikonversi ke Number agar tidak NaN
                        const priceValue = typeof item.price === 'number' ? item.price : Number(item.price) || 0;

                        return (
                            <tr key={item.id}>
                                <td className="px-6 py-4">
                                    <div className="relative h-16 w-16 bg-gray-800 rounded overflow-hidden">
                                        <Image
                                            src={item.image}
                                            fill
                                            sizes="64px"
                                            alt={item.name}
                                            className="object-cover"
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-white font-medium">{item.name}</td>
                                <td className="px-6 py-4 text-white">
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        maximumFractionDigits: 0
                                    }).format(priceValue)}
                                </td>
                                <td className="px-6 py-4 text-white text-sm">
                                    {new Date(item.createdAt).toLocaleDateString("id-ID")}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-center gap-1">
                                        <EditButton id={item.id} />
                                        <DeleteButton id={item.id} image={item.image} />
                                    </div>

                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ClothesTable;