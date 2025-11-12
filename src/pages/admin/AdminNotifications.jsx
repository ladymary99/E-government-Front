// src/pages/admin/AdminNotifications.jsx
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import toast from "react-hot-toast";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Replace with your backend API endpoint
      const response = await fetch("http://localhost:5000/api/notifications");
      const data = await response.json();
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Admin Notifications">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2
          style={{ fontSize: "28px", fontWeight: "600", marginBottom: "24px" }}
        >
          Notifications
        </h2>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
        ) : notifications.length > 0 ? (
          <ul className="notification-list">
            {notifications.map((notif) => (
              <li key={notif.id} className="notification-item">
                <Bell size={18} style={{ marginRight: "8px" }} />
                <span>{notif.message}</span>
                <small style={{ marginLeft: "auto", color: "#888" }}>
                  {new Date(notif.created_at).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <Bell className="empty-state-icon" size={64} />
            <h3 className="empty-state-title">No Notifications</h3>
            <p className="empty-state-text">
              There are currently no notifications.
            </p>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default AdminNotifications;
