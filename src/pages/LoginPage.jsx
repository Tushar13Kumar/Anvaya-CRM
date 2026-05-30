import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://anvaya-project-backend.vercel.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        toast.success(`Welcome back, ${data.user.name}!`);
        navigate("/");
      } else {
        toast.error(data.error || "Login failed.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .auth-wrap {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: var(--bg); font-family: 'Sora','Segoe UI',sans-serif; padding: 20px;
        }
        .auth-card {
          width: 100%; max-width: 420px; background: var(--surface);
          border-radius: 16px; border: 1px solid var(--border); overflow: hidden;
        }
        .auth-head {
          padding: 28px 28px 20px; border-bottom: 1px solid var(--border); text-align: center;
        }
        .auth-logo {
          width: 48px; height: 48px; background: #6366f1; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; font-weight: 700; color: white; margin: 0 auto 12px;
        }
        .auth-title { font-size: 20px; font-weight: 600; color: var(--text); margin: 0 0 4px; }
        .auth-sub { font-size: 13px; color: var(--text-muted); margin: 0; }
        .auth-body { padding: 24px 28px 28px; }
        .auth-group { margin-bottom: 16px; }
        .auth-label { display: block; font-size: 12px; font-weight: 500; color: var(--text-muted); margin-bottom: 6px; }
        .auth-input {
          width: 100%; background: var(--input-bg); border: 1px solid var(--border);
          border-radius: 8px; padding: 10px 14px; font-size: 14px;
          font-family: 'Sora',sans-serif; color: var(--text); outline: none;
          transition: border-color 0.15s; box-sizing: border-box;
        }
        .auth-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        .auth-input::placeholder { color: var(--text-muted); opacity: 0.6; }
        .auth-btn {
          width: 100%; background: #6366f1; color: white; border: none;
          border-radius: 10px; padding: 12px; font-size: 14px; font-weight: 600;
          font-family: 'Sora',sans-serif; cursor: pointer; margin-top: 8px;
          transition: opacity 0.2s;
        }
        .auth-btn:hover:not(:disabled) { opacity: 0.88; }
        .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .auth-footer { text-align: center; margin-top: 16px; font-size: 13px; color: var(--text-muted); }
        .auth-link { color: #6366f1; text-decoration: none; font-weight: 500; }
        .auth-link:hover { text-decoration: underline; }
      `}</style>

      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-head">
            <div className="auth-logo">P</div>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-sub">Sign in to Prayas CRM</p>
          </div>
          <div className="auth-body">
            <form onSubmit={handleSubmit}>
              <div className="auth-group">
                <label className="auth-label">Email Address</label>
                <input type="email" className="auth-input" placeholder="you@prayas.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="auth-group">
                <label className="auth-label">Password</label>
                <input type="password" className="auth-input" placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
            <div className="auth-footer">
              Account nahi hai? <Link to="/signup" className="auth-link">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;