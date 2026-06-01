import { useState } from "react";
import API from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;
      if (role === "student") window.location.href = "/student";
      if (role === "officer") window.location.href = "/officer";
      if (role === "admin") window.location.href = "/admin";
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>WKU International Admission</h1>
        <p>
          A web-based admission management system for international applicants,
          admission officers, and administrators.
        </p>
      </div>

      <div className="auth-card-wrapper">
        <form className="auth-card" onSubmit={handleLogin}>
          <h2>Login</h2>
          <p className="subtitle">Access your admission portal</p>

          <input
            className="input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="primary-btn" type="submit">
            Login
          </button>

          <p style={{ marginTop: "18px" }}>
            No account? <a href="/register">Create one</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;