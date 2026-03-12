import { Metadata } from "next";
import DashboardCards from "@/components/admin/dashboard-cards";
import RecentOrders from "@/components/admin/content/recent-orders";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
    title: "Dashboard"
};

const DashboardPage = () => {
    return <div className="max-w-screen-xl px-10 py-16 mt-15 mx-auto">
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <Suspense fallback={<p>Loading cards...</p>}>
            <DashboardCards />
        </Suspense>
        <Suspense fallback={<p className="text-white mt-10">Loading orders...</p>}>
            <RecentOrders />
        </Suspense>
    </div>
};

export default DashboardPage
