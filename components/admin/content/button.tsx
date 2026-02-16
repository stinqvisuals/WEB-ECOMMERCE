import { deleteClothes } from "@/lib/actions";
import { IoTrashOutline, IoPencil } from "react-icons/io5";
import Link from "next/link";

export const EditButton = ({ id }: { id: string }) => {
    return (
        <Link href={`/admin/clothes/edit/${id}`} className="rounded-sm p-1 hover:bg-red-600">
            <IoPencil className="size-5" />
        </Link>
    )
}

export const DeleteButton = ({ id, image }: { id: string, image: string }) => {
    const DeleteClothesWithId = deleteClothes.bind(null, id, image);
    return (
        <form action={DeleteClothesWithId}>
            <button type="submit" className="rounded-sm p-1 hover:bg-red-600 cursor-pointer">
                <IoTrashOutline className="size-5" />
            </button>
        </form>
    )
}