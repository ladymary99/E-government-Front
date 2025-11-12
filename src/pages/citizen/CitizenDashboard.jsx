import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../../components/Layout";
import {
  LayoutDashboard,
  FileText,
  Clock,
  Bell,
  User,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { requestsAPI } from "../../services/api";
import toast from "react-hot-toast";

const CitizenDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { path: "/citizen/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/citizen/apply", label: "Apply for Service", icon: FileText },
    { path: "/citizen/requests", label: "Track Requests", icon: Clock },
    { path: "/citizen/notifications", label: "Notifications", icon: Bell },
    { path: "/citizen/profile", label: "Profile", icon: User },
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestsAPI.getAll();
      const data = response.data.requests || [];
      setRequests(data.slice(0, 5));

      // Calculate stats
      setStats({
        total: data.length,
        pending: data.filter((r) => r.status === "pending").length,
        approved: data.filter((r) => r.status === "approved").length,
        rejected: data.filter((r) => r.status === "rejected").length,
      });
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load requests");
      // Use mock data if API fails
      const mockRequests = [
        {
          id: 1,
          service_name: "Business License",
          status: "pending",
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          service_name: "ID Renewal",
          status: "approved",
          created_at: new Date().toISOString(),
        },
      ];
      setRequests(mockRequests);
      setStats({ total: 2, pending: 1, approved: 1, rejected: 0 });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "badge-pending",
      processing: "badge-processing",
      approved: "badge-approved",
      rejected: "badge-rejected",
      completed: "badge-completed",
    };
    return badges[status] || "badge-pending";
  };

  return (
    <Layout menuItems={menuItems} title="Citizen Portal">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2
          style={{ fontSize: "28px", fontWeight: "600", marginBottom: "32px" }}
        >
          Welcome to Your Dashboard
        </h2>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FileText size={24} />
            </div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Requests</div>
          </div>
          <div className="stat-card accent">
            <div className="stat-icon">
              <AlertCircle size={24} />
            </div>
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card secondary">
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-value">{stats.approved}</div>
            <div className="stat-label">Approved</div>
          </div>
          <div className="stat-card danger">
            <div className="stat-icon">
              <XCircle size={24} />
            </div>
            <div className="stat-value">{stats.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="card" style={{ marginBottom: "32px" }}>
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="grid-2">
              <Link to="/citizen/apply" className="btn btn-primary">
                <Plus size={20} />
                Apply for New Service
              </Link>
              <Link to="/citizen/requests" className="btn btn-outline">
                <Clock size={20} />
                Track My Requests
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Requests</h3>
          </div>
          <div className="card-body">
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div className="spinner"></div>
              </div>
            ) : requests.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Service</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request.id}>
                        <td>#{request.id}</td>
                        <td>{request.service_name || "Service"}</td>
                        <td>
                          <span
                            className={`badge ${getStatusBadge(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td>
                          {new Date(request.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <FileText className="empty-state-icon" size={64} />
                <h3 className="empty-state-title">No Requests Yet</h3>
                <p className="empty-state-text">
                  You haven't submitted any service requests yet
                </p>
                <Link to="/citizen/apply" className="btn btn-primary">
                  Apply for Service
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default CitizenDashboard;
