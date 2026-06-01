import { useEffect, useState } from "react";
import API from "../api";

function ApplicationForm() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [hasActiveApplication, setHasActiveApplication] = useState(false);
  const [checking, setChecking] = useState(true);

  const [form, setForm] = useState({
    full_name: "",
    gender: "",
    nationality: "",
    passport_number: "",
    high_school: "",
    gpa: "",
    program: "",
  });

  useEffect(() => {
    checkExistingApplication();
  }, []);

  const checkExistingApplication = async () => {
    try {
      const res = await API.get(`/applications/student/${user.user_id}`);

      const active = res.data.some(
        (app) =>
          app.status === "Submitted" ||
          app.status === "Under Review" ||
          app.status === "Missing Documents" ||
          app.status === "Accepted"
      );

      setHasActiveApplication(active);
      setChecking(false);
    } catch (err) {
      console.error(err);
      setChecking(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitApplication = async (e) => {
    e.preventDefault();

    if (hasActiveApplication) {
      alert(
        "You already have an active application. You cannot submit another application unless the previous one is rejected."
      );
      return;
    }

    try {
      await API.post("/applications", {
        user_id: user.user_id,
        ...form,
      });

      alert("Application submitted successfully!");
      window.location.href = "/student";
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  if (checking) {
    return (
      <div className="layout">
        <div className="topbar">
          <div className="topbar-title">WKU Admission Portal</div>
        </div>

        <main className="page">
          <div className="card">
            <h2>Checking application status...</h2>
          </div>
        </main>
      </div>
    );
  }

  if (hasActiveApplication) {
    return (
      <div className="layout">
        <div className="topbar">
          <div className="topbar-title">WKU Admission Portal</div>
          <div className="topbar-user">
            <span>{user?.name}</span>
            <button
              className="danger-btn"
              onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <main className="page">
          <div className="form-card">
            <h2>Application Already Exists</h2>
            <p className="subtitle">
              You already have an active application in the system. To avoid
              duplicate admission records, you cannot submit another application
              while your current application is submitted, under review, missing
              documents, or accepted.
            </p>

            <button
              className="primary-btn"
              onClick={() => (window.location.href = "/student")}
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="layout">
      <div className="topbar">
        <div className="topbar-title">WKU Admission Portal</div>
        <div className="topbar-user">
          <span>{user?.name}</span>
          <button
            className="danger-btn"
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <main className="page">
        <div className="form-card">
          <h2>Online Application Form</h2>
          <p className="subtitle">
            Please complete your personal and academic information carefully.
          </p>

          <form onSubmit={submitApplication}>
            <div className="form-grid">
              <input
                className="input"
                name="full_name"
                placeholder="Full Name"
                value={form.full_name}
                onChange={handleChange}
                required
              />

              <select
                className="input"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>

              <input
                className="input"
                name="nationality"
                placeholder="Nationality"
                value={form.nationality}
                onChange={handleChange}
                required
              />

              <input
                className="input"
                name="passport_number"
                placeholder="Passport Number"
                value={form.passport_number}
                onChange={handleChange}
                required
              />

              <input
                className="input"
                name="high_school"
                placeholder="High School"
                value={form.high_school}
                onChange={handleChange}
                required
              />

              <input
                className="input"
                name="gpa"
                placeholder="GPA"
                value={form.gpa}
                onChange={handleChange}
                required
              />

              <select
                className="input"
                name="program"
                value={form.program}
                onChange={handleChange}
                required
              >
                <option value="">Select Program</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Biology">Biology</option>
                <option value="Finance">Finance</option>
                <option value="Management">Management</option>
              </select>
            </div>

            <button className="primary-btn" type="submit">
              Submit Application
            </button>

            <button
              type="button"
              className="secondary-btn"
              style={{ width: "100%", marginTop: "10px" }}
              onClick={() => (window.location.href = "/student")}
            >
              Back to Dashboard
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ApplicationForm;