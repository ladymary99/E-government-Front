import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Building2, Mail, Lock, Shield } from "lucide-react";
import "./AuthPages.css";

const OfficerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password, "officer");
    setLoading(false);

    if (result.success) {
      navigate("/officer/dashboard");
    }
  };

  return (
    <div className="auth-page officer">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <Building2 size={32} />
            <span>E-Government Portal</span>
          </Link>
          <div className="officer-badge">
            <Shield size={24} />
          </div>
          <h1>Officer Login</h1>
          <p>Access officer dashboard</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <Mail size={16} />
              Officer Email
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your officer email"
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

          <button
            type="submit"
            className="btn btn-secondary"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login as Officer"}
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

export default OfficerLogin;
