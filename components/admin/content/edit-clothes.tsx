import CreateForm from "@/components/admin/content/create-form";
import EditForm from "@/components/admin/content/edit-form";
import { getAmenities, getClothesById } from "@/lib/data";
import { notFound } from "next/navigation";

const EditContent = async ({ clothesId }: { clothesId: string }) => {
    const [amenities, clothes] = await Promise.all([getAmenities(), getClothesById(clothesId)]);
    if (!amenities || !clothes) return notFound();

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-4 mt-4">Edit Content</h1>
            <EditForm amenities={amenities} clothes={clothes} />
        </div>
    );
};

export default EditContent;