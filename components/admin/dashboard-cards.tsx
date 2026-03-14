import { getDashboardStats } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

const DashboardCards = async () => {
  const stats = await getDashboardStats();

  console.log('=== DASHBOARD CARDS ===', stats.revenue, 'from Payment SUM');

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-10">
      <div className="bg-black p-6 rounded-lg shadow border-l-4 border-green-400">
        <p className="text-white text-sm">Total Revenue</p>
        <h2 className="text-3xl font-bold text-green-400">
          {formatCurrency(stats.revenue)}
        </h2>
        <p className="text-xs text-gray-400 mt-1">{stats.completedOrders} paid orders</p>
      </div>

      <div className="bg-black p-6 rounded-lg shadow border-l-4 border-blue-400">
        <p className="text-white text-sm">Total Orders</p>
        <h2 className="text-3xl font-bold text-blue-400">
          {stats.totalOrders ?? 0}
        </h2>
      </div>

      <div className="bg-black p-6 rounded-lg shadow border-l-4 border-purple-400">
        <p className="text-white text-sm">Total Customers</p>
        <h2 className="text-3xl font-bold text-purple-400">
          {stats.totalCustomers ?? 0}
        </h2>
      </div>
    </div>
  );
};

export default DashboardCards;

