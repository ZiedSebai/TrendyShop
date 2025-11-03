import { useState, useEffect } from "react";
import { Users, ShoppingBag, Package, DollarSign } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminDashboardService, DashboardStats, RecentOrder } from "@/services/admin-dashboard.service";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const data = await adminDashboardService.getDashboardStats();
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      } catch (error) {
        toast.error("Failed to load dashboard data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = stats ? [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      change: `${stats.completedOrders} completed orders`
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      change: `${stats.completedOrders} completed`
    },
    {
      title: "Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      change: `${stats.inStockProducts} in stock`
    },
    {
      title: "Customers",
      value: stats.totalUsers.toString(),
      icon: Users,
      change: "Total registered users"
    },
  ] : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">Overview of your store performance</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
              {statsCards.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs md:text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{stat.change}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Recent Orders</CardTitle>
                <CardDescription className="text-sm">Latest orders from your store</CardDescription>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No orders yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Order ID</TableHead>
                          <TableHead className="whitespace-nowrap">Customer</TableHead>
                          <TableHead className="whitespace-nowrap">Items</TableHead>
                          <TableHead className="whitespace-nowrap">Amount</TableHead>
                          <TableHead className="whitespace-nowrap">Status</TableHead>
                          <TableHead className="whitespace-nowrap">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium whitespace-nowrap">{order.id}</TableCell>
                            <TableCell className="whitespace-nowrap">{order.customer}</TableCell>
                            <TableCell className="whitespace-nowrap">{order.itemCount} items</TableCell>
                            <TableCell className="whitespace-nowrap">${order.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize whitespace-nowrap ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
