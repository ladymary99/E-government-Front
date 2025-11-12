// src/pages/admin/AdminReports.jsx
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import toast from "react-hot-toast";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      // Replace with your backend API endpoint
      const response = await fetch("http://localhost:5000/api/reports");
      const data = await response.json();
      setReports(data || []);
    } catch (error) {
      console.error("Error loading reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Admin Reports">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2
          style={{ fontSize: "28px", fontWeight: "600", marginBottom: "24px" }}
        >
          System Reports
        </h2>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            Loading reports...
          </div>
        ) : reports.length > 0 ? (
          <div className="reports-table">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Report Type</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>#{report.id}</td>
                    <td>{report.type}</td>
                    <td>{new Date(report.created_at).toLocaleDateString()}</td>
                    <td>{report.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <FileText className="empty-state-icon" size={64} />
            <h3 className="empty-state-title">No Reports Yet</h3>
            <p className="empty-state-text">
              No reports are available at the moment.
            </p>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default AdminReports;
