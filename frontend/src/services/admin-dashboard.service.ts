import { apiClient } from '@/lib/api';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  completedOrders: number;
  inStockProducts: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  total: number;
  status: string;
  itemCount: number;
  createdAt: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
}

export const adminDashboardService = {
  async getDashboardStats(): Promise<DashboardResponse> {
    return apiClient('/api/admin/stats');
  },
};
