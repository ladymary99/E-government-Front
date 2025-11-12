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
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import { departmentsAPI } from "../../services/api";
import toast from "react-hot-toast";

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/departments", label: "Departments", icon: Building2 },
    { path: "/admin/services", label: "Services", icon: Briefcase },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/reports", label: "Reports", icon: BarChart3 },
    { path: "/admin/notifications", label: "Notifications", icon: Bell },
  ];

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await departmentsAPI.getAll();
      setDepartments(response.data.departments || []);
    } catch (error) {
      console.error("Error:", error);
      setDepartments([
        {
          id: 1,
          name: "Department of Interior",
          description: "Internal affairs and administration",
        },
        {
          id: 2,
          name: "Department of Commerce",
          description: "Business and trade services",
        },
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingDept) {
        await departmentsAPI.update(editingDept.id, formData);
        toast.success("Department updated successfully");
      } else {
        await departmentsAPI.create(formData);
        toast.success("Department created successfully");
      }
      fetchDepartments();
      closeModal();
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this department?")) return;

    try {
      await departmentsAPI.delete(id);
      toast.success("Department deleted");
      fetchDepartments();
    } catch (error) {
      toast.error("Failed to delete department");
    }
  };

  const openModal = (dept = null) => {
    setEditingDept(dept);
    setFormData(dept || { name: "", description: "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDept(null);
    setFormData({ name: "", description: "" });
  };

  return (
    <Layout menuItems={menuItems} title="Admin Portal">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <h2 style={{ fontSize: "28px", fontWeight: "600" }}>
            Manage Departments
          </h2>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={20} />
            Add Department
          </button>
        </div>
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.id}>
                    <td>
                      <strong>#{dept.id}</strong>
                    </td>
                    <td>{dept.name}</td>
                    <td>{dept.description}</td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => openModal(dept)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(dept.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingDept ? "Edit Department" : "Add Department"}
              </h3>
              <button className="modal-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Department Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ManageDepartments;
