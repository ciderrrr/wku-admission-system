import { useState } from "react";
import API from "../api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      await API.post("/auth/register", form);
      alert("Registration successful!");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>Create Your Account</h1>
        <p>
          Students can submit applications, officers can review materials, and
          administrators can monitor admission progress.
        </p>
      </div>

      <div className="auth-card-wrapper">
        <form className="auth-card" onSubmit={handleRegister}>
          <h2>Register</h2>
          <p className="subtitle">Create a portal account</p>

          <input
            className="input"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            className="input"
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="input"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <select
            className="input"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="officer">Admission Officer</option>
            <option value="admin">Administrator</option>
          </select>

          <button className="primary-btn" type="submit">
            Register
          </button>

          <p style={{ marginTop: "18px" }}>
            Already have an account? <a href="/">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;