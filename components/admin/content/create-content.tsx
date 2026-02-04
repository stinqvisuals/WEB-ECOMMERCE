import CreateForm from "@/components/admin/content/create-form";
import { getAmenities } from "@/lib/data";

const CreateContent = async () => {
    const amenities = await getAmenities();
    if (!amenities) return null;

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-4 mt-4">Create New Content</h1>
            <CreateForm amenities={amenities} />
        </div>
    );
};

export default CreateContent;