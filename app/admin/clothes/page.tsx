import Link from "next/link";
import ClothesTable from "@/components/admin/content/clothes-table";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const ClothesPage = () => {
    return (
        <div className="max-w-screen-xl px-4 py-16 mt-10 mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white mb-4 mt-4">Clothes List</h1>
                <Link
                    href="/admin/content/create"
                    className="bg-red-600 px-6 py-2.5 hover:bg-red-700 text-white font-bold transition-colors"
                >
                    Create New
                </Link>
            </div>

            {/* Suspense sangat bagus untuk UX saat proses fetching data */}
            <Suspense fallback={<p className="text-white p-10 text-center animate-pulse">Loading Data...</p>}>
                <ClothesTable />
            </Suspense>
        </div>
    )
}

export default ClothesPage;