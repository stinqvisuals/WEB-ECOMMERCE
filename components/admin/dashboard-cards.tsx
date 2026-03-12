import { getDashboardStats } from "@/lib/data";
import { LuChartArea, LuShoppingCart, LuUsers, LuTrash2 } from "react-icons/lu";
import { formatCurrency } from "@/lib/utils";
import { notFound } from "next/navigation";
import { deleteTestData } from "@/lib/actions";

const DashboardCards = async () => {
  const stats = await getDashboardStats();

  if (!stats) return notFound();

  // Check if there's test data (revenue = 300000 and totalOrders <= 5)
  const hasTestData = stats.revenue === 300000 && stats.totalOrders > 0;

  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 mt-10 gap-5 pb-10'>
      {/* Total Revenue */}
      <div className="flex items-center bg-black rounded-md overflow-hidden shadow-sm">
        <div className="p-4 bg-green-400">
          <LuChartArea className="size-12 text-white" />
        </div>
        <div className="px-4 text-white">
          <h3 className="text-sm tracking-wider">Total Revenue</h3>
          <p className="text-3xl ">{formatCurrency(stats.revenue)}</p>
        </div>
      </div>

      {/* Total Orders */}
      <div className="flex items-center bg-black rounded-md overflow-hidden shadow-sm">
        <div className="p-4 bg-purple-500">
          <LuShoppingCart className="size-12 text-white" />
        </div>
        <div className="px-4 text-white">
          <h3 className="text-sm tracking-wider">Total Orders</h3>
          <p className="text-3xl ">{stats.totalOrders}</p>
        </div>
      </div>

      {/* Total Customers */}
      <div className="flex items-center bg-black rounded-md overflow-hidden shadow-sm">
        <div className="p-4 bg-blue-600">
          <LuUsers className="size-12 text-white" />
        </div>
        <div className="px-4 text-white">
          <h3 className="text-sm tracking-wider">Total Customers</h3>
          <p className="text-3xl">{stats.totalCustomers}</p>
        </div>
      </div>

      {/* Delete Test Data Button - Only show if there's test data */}
      {hasTestData && (
        <form action={deleteTestData} className="flex items-center bg-black rounded-md overflow-hidden shadow-sm border border-red-500">
          <div className="p-4 bg-red-500">
            <LuTrash2 className="size-12 text-white" />
          </div>
          <div className="px-4">
            <button type="submit" className="text-white text-sm hover:underline">
              Hapus Data Test
            </button>
            <p className="text-gray-400 text-xs">Klik untuk menghapus data test</p>
          </div>
        </form>
      )}
    </div>
  )
}

export default DashboardCards

