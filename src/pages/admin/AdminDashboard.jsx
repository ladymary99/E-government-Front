import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "../../components/Layout";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  BarChart3,
  Bell,
  DollarSign,
  FileText,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { reportsAPI } from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRequests: 245,
    totalUsers: 1234,
    totalDepartments: 8,
    totalRevenue: 125000,
  });

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/departments", label: "Departments", icon: Building2 },
    { path: "/admin/services", label: "Services", icon: Briefcase },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/reports", label: "Reports", icon: BarChart3 },
    { path: "/admin/notifications", label: "Notifications", icon: Bell },
  ];

  const requestsData = [
    { month: "Jan", requests: 45 },
    { month: "Feb", requests: 52 },
    { month: "Mar", requests: 48 },
    { month: "Apr", requests: 61 },
    { month: "May", requests: 55 },
    { month: "Jun", requests: 67 },
  ];

  const statusData = [
    { name: "Pending", value: 45, color: "#f59e0b" },
    { name: "Processing", value: 30, color: "#3b82f6" },
    { name: "Approved", value: 75, color: "#10b981" },
    { name: "Rejected", value: 15, color: "#ef4444" },
  ];

  const revenueData = [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 15000 },
    { month: "Mar", revenue: 18000 },
    { month: "Apr", revenue: 22000 },
    { month: "May", revenue: 25000 },
    { month: "Jun", revenue: 33000 },
  ];

  return (
    <Layout menuItems={menuItems} title="Admin Portal">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2
          style={{ fontSize: "28px", fontWeight: "600", marginBottom: "32px" }}
        >
          Admin Dashboard
        </h2>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FileText size={24} />
            </div>
            <div className="stat-value">{stats.totalRequests}</div>
            <div className="stat-label">Total Requests</div>
          </div>
          <div className="stat-card secondary">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card accent">
            <div className="stat-icon">
              <Building2 size={24} />
            </div>
            <div className="stat-value">{stats.totalDepartments}</div>
            <div className="stat-label">Departments</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-value">
              ${(stats.totalRevenue / 1000).toFixed(0)}K
            </div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
        {/* Charts Grid */}
        <div className="grid-2">
          {/* Requests Trend */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Requests Trend</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={requestsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="requests" fill="#1e40af" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Request Status Distribution</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="card" style={{ marginTop: "24px" }}>
          <div className="card-header">
            <h3 className="card-title">
              <TrendingUp size={20} />
              Revenue Growth
            </h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#059669"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default AdminDashboard;
