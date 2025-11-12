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
import { servicesAPI, departmentsAPI } from "../../services/api";
import toast from "react-hot-toast";

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fee: "",
    department_id: "",
  });
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
    fetchServices();
    fetchDepartments();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data.services || []);
    } catch (error) {
      setServices([
        {
          id: 1,
          name: "Business License",
          fee: 100,
          department_name: "Commerce",
          description: "New business registration",
        },
        {
          id: 2,
          name: "ID Renewal",
          fee: 50,
          department_name: "Interior",
          description: "National ID renewal service",
        },
      ]);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentsAPI.getAll();
      setDepartments(response.data.departments || []);
    } catch (error) {
      setDepartments([
        { id: 1, name: "Commerce" },
        { id: 2, name: "Interior" },
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingService) {
        await servicesAPI.update(editingService.id, formData);
        toast.success("Service updated successfully");
      } else {
        await servicesAPI.create(formData);
        toast.success("Service created successfully");
      }
      fetchServices();
      closeModal();
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await servicesAPI.delete(id);
      toast.success("Service deleted");
      fetchServices();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const openModal = (service = null) => {
    setEditingService(service);
    setFormData(
      service || { name: "", description: "", fee: "", department_id: "" }
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({ name: "", description: "", fee: "", department_id: "" });
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
            Manage Services
          </h2>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={20} />
            Add Service
          </button>
        </div>
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Service Name</th>
                  <th>Department</th>
                  <th>Fee</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <strong>#{service.id}</strong>
                    </td>
                    <td>{service.name}</td>
                    <td>{service.department_name}</td>
                    <td>${service.fee}</td>
                    <td>{service.description}</td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => openModal(service)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(service.id)}
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

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingService ? "Edit Service" : "Add Service"}
              </h3>
              <button className="modal-close" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Service Name</label>
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
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    value={formData.department_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        department_id: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Fee ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.fee}
                    onChange={(e) =>
                      setFormData({ ...formData, fee: e.target.value })
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

export default ManageServices;
