import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../../components/Layout";
import {
  LayoutDashboard,
  FileText,
  User,
  Calendar,
  FileCheck,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";
import { requestsAPI } from "../../services/api";
import toast from "react-hot-toast";

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notes, setNotes] = useState("");

  const menuItems = [
    { path: "/officer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/officer/dashboard", label: "Requests", icon: FileText },
  ];

  useEffect(() => {
    fetchRequestDetail();
  }, [id]);

  const fetchRequestDetail = async () => {
    try {
      setLoading(true);
      const response = await requestsAPI.getById(id);
      setRequest(response.data.request);
    } catch (error) {
      console.error("Error fetching request:", error);
      // Mock data
      setRequest({
        id: id,
        citizen_name: "John Smith",
        citizen_email: "john.smith@example.com",
        service_name: "Business License",
        description: "New business registration for tech startup",
        status: "pending",
        created_at: new Date().toISOString(),
        documents: [
          { name: "business_plan.pdf", size: "2.5 MB" },
          { name: "id_card.pdf", size: "1.2 MB" },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await requestsAPI.updateStatus(id, {
        status: "approved",
        officer_notes: notes,
      });
      toast.success("Request approved successfully!");
      navigate("/officer/dashboard");
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!notes) {
      toast.error("Please provide rejection reason");
      return;
    }

    setActionLoading(true);
    try {
      await requestsAPI.updateStatus(id, {
        status: "rejected",
        officer_notes: notes,
      });
      toast.success("Request rejected");
      navigate("/officer/dashboard");
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "badge-pending",
      processing: "badge-processing",
      approved: "badge-approved",
      rejected: "badge-rejected",
    };
    return badges[status] || "badge-pending";
  };

  if (loading) {
    return (
      <Layout menuItems={menuItems} title="Officer Portal">
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <div className="spinner"></div>
          <p style={{ marginTop: "20px", color: "var(--gray)" }}>
            Loading request details...
          </p>
        </div>
      </Layout>
    );
  }

  if (!request) {
    return (
      <Layout menuItems={menuItems} title="Officer Portal">
        <div className="empty-state">
          <FileText className="empty-state-icon" size={64} />
          <h3 className="empty-state-title">Request Not Found</h3>
        </div>
      </Layout>
    );
  }
  return (
    <Layout menuItems={menuItems} title="Officer Portal">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "32px",
          }}
        >
          <h2 style={{ fontSize: "28px", fontWeight: "600" }}>
            Request #{request.id}
          </h2>
          <span className={`badge ${getStatusBadge(request.status)}`}>
            {request.status}
          </span>
        </div>

        <div className="grid-2" style={{ marginBottom: "32px" }}>
          {/* Request Details */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Request Information</h3>
            </div>
            <div className="card-body">
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "8px",
                  }}
                >
                  <FileCheck size={20} color="var(--primary)" />
                  <strong>Service:</strong>
                </div>
                <p style={{ marginLeft: "32px" }}>{request.service_name}</p>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "8px",
                  }}
                >
                  <User size={20} color="var(--primary)" />
                  <strong>Citizen:</strong>
                </div>
                <p style={{ marginLeft: "32px" }}>
                  {request.citizen_name}
                  <br />
                  {request.citizen_email}
                </p>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "8px",
                  }}
                >
                  <Calendar size={20} color="var(--primary)" />
                  <strong>Submitted:</strong>
                </div>
                <p style={{ marginLeft: "32px" }}>
                  {new Date(request.created_at).toLocaleString()}
                </p>
              </div>

              <div>
                <strong>Description:</strong>
                <p style={{ marginTop: "8px", color: "var(--gray)" }}>
                  {request.description}
                </p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Submitted Documents</h3>
            </div>
            <div className="card-body">
              {request.documents && request.documents.length > 0 ? (
                request.documents.map((doc, index) => (
                  <div key={index} className="file-item">
                    <div className="file-item-info">
                      <FileText size={20} />
                      <div>
                        <div style={{ fontWeight: "500" }}>{doc.name}</div>
                        <small style={{ color: "var(--gray)" }}>
                          {doc.size}
                        </small>
                      </div>
                    </div>
                    <button className="btn btn-outline btn-sm">
                      <Download size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p
                  style={{
                    color: "var(--gray)",
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  No documents attached
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Officer Notes and Actions */}
        {request.status === "pending" && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Review & Decision</h3>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Officer Notes</label>
                <textarea
                  className="form-textarea"
                  placeholder="Add notes or rejection reason..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  className="btn btn-success"
                  onClick={handleApprove}
                  disabled={actionLoading}
                >
                  <CheckCircle size={20} />
                  {actionLoading ? "Processing..." : "Approve Request"}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleReject}
                  disabled={actionLoading}
                >
                  <XCircle size={20} />
                  {actionLoading ? "Processing..." : "Reject Request"}
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default RequestDetail;
