import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "../../components/Layout";
import {
  LayoutDashboard,
  FileText,
  Clock,
  Bell,
  User,
  Search,
} from "lucide-react";
import { requestsAPI } from "../../services/api";
import toast from "react-hot-toast";

const RequestTracking = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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

  useEffect(() => {
    filterRequests();
  }, [searchTerm, statusFilter, requests]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestsAPI.getAll();
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch requests, showing sample data.");

      // Mock data
      const mockRequests = [
        {
          id: 1,
          service_name: "Business License",
          status: "pending",
          created_at: new Date().toISOString(),
          description: "New business registration",
        },
        {
          id: 2,
          service_name: "ID Renewal",
          status: "approved",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          description: "National ID renewal",
        },
        {
          id: 3,
          service_name: "Building Permit",
          status: "processing",
          created_at: new Date(Date.now() - 172800000).toISOString(),
          description: "Construction permit",
        },
      ];
      setRequests(mockRequests);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...requests];

    if (statusFilter !== "all") {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
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

  const getProgressSteps = (status) => {
    const steps = ["pending", "processing", "approved", "completed"];
    const currentIndex = steps.indexOf(status);
    return steps.map((step, index) => ({
      name: step,
      completed: index <= currentIndex,
    }));
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
          Track Your Requests
        </h2>

        {/* Search and Filter */}
        <div
          className="search-filter-bar"
          style={{ display: "flex", gap: "16px", marginBottom: "24px" }}
        >
          <div className="form-group" style={{ flex: 1 }}>
            <div style={{ position: "relative" }}>
              <Search
                size={20}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--gray)",
                }}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: "40px" }}
              />
            </div>
          </div>
          <div className="form-group">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="card">
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px" }}>
              <div className="spinner"></div>
              <p style={{ marginTop: "20px", color: "var(--gray)" }}>
                Loading requests...
              </p>
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Service</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id}>
                      <td>
                        <strong>#{request.id}</strong>
                      </td>
                      <td>{request.service_name}</td>
                      <td>{request.description}</td>
                      <td>
                        <span
                          className={`badge ${getStatusBadge(request.status)}`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td>
                        {new Date(request.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div
                          className="progress-steps"
                          style={{
                            display: "flex",
                            gap: "4px",
                            minWidth: "120px",
                          }}
                        >
                          {getProgressSteps(request.status).map((step, idx) => (
                            <div
                              key={idx}
                              style={{
                                width: "24px",
                                height: "4px",
                                borderRadius: "2px",
                                background: step.completed
                                  ? "var(--success)"
                                  : "var(--border)",
                              }}
                              title={step.name}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <FileText className="empty-state-icon" size={64} />
              <h3 className="empty-state-title">No Requests Found</h3>
              <p className="empty-state-text">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "You haven't submitted any requests yet"}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default RequestTracking;
