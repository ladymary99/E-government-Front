import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "../../components/Layout";
import {
  LayoutDashboard,
  FileText,
  Clock,
  Bell,
  User,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

const CitizenNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const menuItems = [
    { path: "/citizen/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/citizen/apply", label: "Apply for Service", icon: FileText },
    { path: "/citizen/requests", label: "Track Requests", icon: Clock },
    { path: "/citizen/notifications", label: "Notifications", icon: Bell },
    { path: "/citizen/profile", label: "Profile", icon: User },
  ];

  useEffect(() => {
    // Mock notifications
    setNotifications([
      {
        id: 1,
        type: "success",
        title: "Request Approved",
        message: "Your Business License request (#1234) has been approved.",
        date: new Date().toISOString(),
        read: false,
      },
      {
        id: 2,
        type: "info",
        title: "Request Update",
        message: "Your ID Renewal request is being processed.",
        date: new Date(Date.now() - 86400000).toISOString(),
        read: false,
      },
      {
        id: 3,
        type: "warning",
        title: "Document Required",
        message: "Additional documents needed for Building Permit request.",
        date: new Date(Date.now() - 172800000).toISOString(),
        read: true,
      },
    ]);
  }, []);

  const getIcon = (type) => {
    const icons = {
      success: CheckCircle,
      info: Info,
      warning: AlertCircle,
    };
    const Icon = icons[type] || Info;
    return <Icon size={24} />;
  };

  const getAlertClass = (type) => {
    const classes = {
      success: "alert-success",
      info: "alert-info",
      warning: "alert-warning",
    };
    return classes[type] || "alert-info";
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
          Notifications
        </h2>

        <div className="card">
          <div className="card-body">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`alert ${getAlertClass(notification.type)}`}
                  style={{ opacity: notification.read ? 0.7 : 1 }}
                >
                  {getIcon(notification.type)}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: "600", marginBottom: "4px" }}>
                      {notification.title}
                    </h4>
                    <p style={{ marginBottom: "8px" }}>
                      {notification.message}
                    </p>
                    <small style={{ opacity: 0.8 }}>
                      {new Date(notification.date).toLocaleString()}
                    </small>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Bell className="empty-state-icon" size={64} />
                <h3 className="empty-state-title">No Notifications</h3>
                <p className="empty-state-text">
                  You don't have any notifications at the moment
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default CitizenNotifications;
