import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../../components/Layout";
import {
  LayoutDashboard,
  FileText,
  Clock,
  Bell,
  User,
  Upload,
  X,
} from "lucide-react";
import { servicesAPI, departmentsAPI, requestsAPI } from "../../services/api";
import toast from "react-hot-toast";

const ServiceApplication = () => {
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    department_id: "",
    service_id: "",
    description: "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { path: "/citizen/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/citizen/apply", label: "Apply for Service", icon: FileText },
    { path: "/citizen/requests", label: "Track Requests", icon: Clock },
    { path: "/citizen/notifications", label: "Notifications", icon: Bell },
    { path: "/citizen/profile", label: "Profile", icon: User },
  ];

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (formData.department_id) {
      fetchServices(formData.department_id);
    }
  }, [formData.department_id]);

  const fetchDepartments = async () => {
    try {
      const response = await departmentsAPI.getAll();
      setDepartments(response.data.departments || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      // Mock data
      setDepartments([
        { id: 1, name: "Department of Interior" },
        { id: 2, name: "Department of Commerce" },
      ]);
    }
  };

  const fetchServices = async (departmentId) => {
    try {
      const response = await servicesAPI.getByDepartment(departmentId);
      setServices(response.data.services || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      // Mock data
      setServices([
        { id: 1, name: "Business License", fee: 100 },
        { id: 2, name: "ID Card Renewal", fee: 50 },
      ]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestData = new FormData();
      requestData.append("service_id", formData.service_id);
      requestData.append("description", formData.description);

      files.forEach((file) => {
        requestData.append("documents", file);
      });

      await requestsAPI.create(requestData);
      toast.success("Application submitted successfully!");
      navigate("/citizen/requests");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application");
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
          Apply for Service
        </h2>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Select Department</label>
                <select
                  name="department_id"
                  className="form-select"
                  value={formData.department_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose a department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select Service</label>
                <select
                  name="service_id"
                  className="form-select"
                  value={formData.service_id}
                  onChange={handleChange}
                  required
                  disabled={!formData.department_id}
                >
                  <option value="">Choose a service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${service.fee}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  placeholder="Provide details about your request"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Upload Documents</label>
                <div className="file-upload-area">
                  <Upload size={40} />
                  <p>Click or drag files to upload</p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: "16px" }}
                  >
                    Choose Files
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="file-list">
                    {files.map((file, index) => (
                      <div key={index} className="file-item">
                        <div className="file-item-info">
                          <FileText size={20} />
                          <span>{file.name}</span>
                        </div>
                        <button
                          type="button"
                          className="file-item-remove"
                          onClick={() => removeFile(index)}
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div
              className="card-body"
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: "24px",
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </Layout>
  );
};

export default ServiceApplication;
