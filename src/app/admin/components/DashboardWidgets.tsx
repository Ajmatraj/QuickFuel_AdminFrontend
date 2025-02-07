import { Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react"

const DashboardWidgets = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <div className="bg-blue-500 p-3 rounded-full">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500">Total Users</p>
            <p className="text-2xl font-semibold text-gray-400">10,245</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <div className="bg-green-500 p-3 rounded-full">
            <ShoppingCart className="h-8 w-8 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500">Total Orders</p>
            <p className="text-2xl font-semibold text-gray-400">1,352</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <div className="bg-yellow-500 p-3 rounded-full">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500">Total Revenue</p>
            <p className="text-2xl font-semibold text-gray-400">$24,678</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <div className="bg-purple-500 p-3 rounded-full">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500">Growth</p>
            <p className="text-2xl font-semibold text-gray-400">12.5%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardWidgets

