import { Metadata } from "next";
import { Suspense } from "react";
import ClothesDetail from "@/components/clothes-detail";

export const metadata: Metadata = {
    title: "Clothes Detail"
}

const ClothesDetailPage = async ({
    params
}: {
    params: Promise<{ clothesId: string }>
}) => {
    const clothesId = (await params).clothesId;

    return (
        <div className="mt-16">
            <Suspense fallback={<p>Loading...</p>}>
                <ClothesDetail clothesId={clothesId} />
            </Suspense>
        </div>
    )
}

export default ClothesDetailPage