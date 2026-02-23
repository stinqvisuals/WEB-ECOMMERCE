import { deleteClothes } from "@/lib/actions";
import { IoTrashOutline, IoPencil } from "react-icons/io5";
import Link from "next/link";

export const EditButton = ({ id }: { id: string }) => {
    return (
        <Link href={`/admin/clothes/edit/${id}`} className="p-2 text-white hover:bg-gray-500/10 rounded-md transition disabled:opacity-50">
            <IoPencil className="size-5" />
        </Link>
    )
}

export const DeleteButton = ({ id, image }: { id: string, image: string }) => {
    const DeleteClothesWithId = deleteClothes.bind(null, id, image);
    return (
        <form action={DeleteClothesWithId}>
            <button type="submit" className="p-2 text-red-500 hover:bg-red-500/10 rounded-md transition disabled:opacity-50">
                <IoTrashOutline className="size-5" />
            </button>
        </form>
    )
}