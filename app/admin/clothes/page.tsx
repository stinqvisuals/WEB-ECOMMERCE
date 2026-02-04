import Link from "next/link";
import ClothesTable from "@/components/admin/content/clothes-table";
import { Suspense } from "react";

const ClothesPage = () => {
    return (
        <div className="max-w-screen-xl px-4 py-16 mt-10 mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-white">Clothes List</h1>
                <Link href="/admin/content/create" className="bg-red-600 px-6 py-2.5 hover:bg-red-700 text-white font-bold">Create New</Link>
            </div>
            <Suspense fallback={<p>Loading Data...</p>}>
                <ClothesTable />
            </Suspense>
        </div>
    )
}

export default ClothesPage