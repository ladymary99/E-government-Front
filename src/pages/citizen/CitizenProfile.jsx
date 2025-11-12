import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Clock,
  Bell,
  User,
  Mail,
  Phone,
  MapPin,
  Save,
} from "lucide-react";
import { authAPI } from "../../services/api";
import toast from "react-hot-toast";

const CitizenProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [loading, setLoading] = useState(false);

  const menuItems = [
    { path: "/citizen/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/citizen/apply", label: "Apply for Service", icon: FileText },
    { path: "/citizen/requests", label: "Track Requests", icon: Clock },
    { path: "/citizen/notifications", label: "Notifications", icon: Bell },
    { path: "/citizen/profile", label: "Profile", icon: User },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(formData);
      updateUser(response.data.user);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
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
          My Profile
        </h2>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Personal Information</h3>
            {!isEditing && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">
                    <User size={16} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Mail size={16} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Phone size={16} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <MapPin size={16} />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    className="form-input"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div
                className="card-body"
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: "24px",
                }}
              >
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    <Save size={20} />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || "",
                        email: user?.email || "",
                        phone: user?.phone || "",
                        address: user?.address || "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </motion.div>
    </Layout>
  );
};

export default CitizenProfile;
