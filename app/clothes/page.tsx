import { Metadata } from "next";
import { Suspense } from "react";
import HeaderSection from "@/components/Header-Section";
import Main from "@/components/Main";
import ClothesSkeleton from "@/components/skeletons/clothes-skeleton";

export const metadata: Metadata = {
    title: "Clothes & Rates",
    description: "Choose your best clothes"
}

const ClothesPage = () => {
    return (
        <div>
            <HeaderSection title="Stinq Clothes" subTitle="Lorem ipsum dolor sit amet." />
            <div className="mt-10 px-4">
                <Suspense fallback={<ClothesSkeleton />}>
                    <Main />
                </Suspense>

            </div>
        </div>
    )
}

export default ClothesPage