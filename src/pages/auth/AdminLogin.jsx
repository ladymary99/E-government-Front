import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Building2, Mail, Lock, ShieldCheck } from "lucide-react";
import "./AuthPages.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      if (result.user.role !== "admin") {
        toast.error("Access denied: not an admin");
        return;
      }
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="auth-page admin">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <Building2 size={32} />
            <span>E-Government Portal</span>
          </Link>
          <div className="admin-badge">
            <ShieldCheck size={24} />
          </div>
          <h1>Admin Login</h1>
          <p>System administrator access</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <Mail size={16} />
              Admin Email
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={16} />
              Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-danger" disabled={loading}>
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/" className="auth-link">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
