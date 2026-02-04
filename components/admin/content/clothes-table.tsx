import { getClothes } from "@/lib/data";
import Image from "next/image";

// Interface disesuaikan persis dengan schema.prisma kamu
interface ClothesItem {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

const ClothesTable = async () => {
    // Ambil data dan cast ke tipe ClothesItem[]
    // Jika masih ada garis merah tipis, gunakan: as unknown as ClothesItem[]
    const clothes = (await getClothes()) as unknown as ClothesItem[];

    if (!clothes || clothes.length === 0) {
        return <p className="text-white p-5">No Clothes Found</p>;
    }

    return (
        <div className="bg-black p-4 mt-5 shadow-sm overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
                <thead>
                    <tr className="relative">
                        <th className="px-6 py-3 w-32 text-sm font-bold text-white uppercase text-left">Image</th>
                        <th className="px-6 py-3 text-sm font-bold text-white uppercase text-left">Clothes Name</th>
                        <th className="px-6 py-3 text-sm font-bold text-white uppercase text-left">Price</th>
                        <th className="px-6 py-3 text-sm font-bold text-white uppercase text-left">Created At</th>
                        <th className="px-6 py-3 text-sm font-bold text-white uppercase">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {clothes.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-800">
                            <td className="px-6 py-4">
                                <div className="relative h-16 w-16">
                                    <Image
                                        src={item.image}
                                        fill
                                        sizes="20vw"
                                        alt={item.name}
                                        className="object-cover rounded"
                                    />
                                </div>
                            </td>
                            <td className="px-6 py-4 text-white font-medium">{item.name}</td>
                            <td className="px-6 py-4 text-white">
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    maximumFractionDigits: 0
                                }).format(item.price)}
                            </td>
                            <td className="px-6 py-4 text-white text-sm">
                                {new Date(item.createdAt).toLocaleDateString("id-ID")}
                            </td>
                            <td className="px-6 py-4 text-right">
                                {/* Tombol aksi bisa ditaruh di sini nanti */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClothesTable;