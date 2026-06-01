import { useEffect, useState } from "react";
import API from "../api";

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      window.location.href = "/";
      return;
    }

    setUser(savedUser);
    loadDashboard(savedUser.user_id);
  }, []);

  const loadDashboard = async (userId) => {
    try {
      const [appRes, notiRes] = await Promise.all([
        API.get(`/applications/student/${userId}`),
        API.get(`/applications/notifications/${userId}`),
      ]);

      setApplications(appRes.data);
      setNotifications(notiRes.data);
    } catch (err) {
      alert("Failed to load dashboard data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const getStatusClass = (status) => {
    if (status === "Accepted") return "status status-accepted";
    if (status === "Rejected") return "status status-rejected";
    if (status === "Missing Documents") return "status status-missing";
    return "status status-submitted";
  };

  const latestApplication = applications[0];

  if (loading) {
    return (
      <div className="layout">
        <div className="topbar">
          <div className="topbar-title">WKU Admission Portal</div>
        </div>

        <main className="page">
          <div className="card">
            <h2>Loading dashboard...</h2>
            <p className="subtitle">Please wait while we load your application data.</p>
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
          <button className="danger-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <main className="page">
        <div className="page-header">
          <div>
            <h1>Student Dashboard</h1>
            <p className="subtitle">
              Manage your admission application and track your latest status.
            </p>
          </div>

          <button
            className="primary-btn"
            style={{ width: "auto" }}
            onClick={() => (window.location.href = "/apply")}
          >
            New Application
          </button>
        </div>

        <div className="grid">
          <div className="stat-card">
            <p>Total Applications</p>
            <h2>{applications.length}</h2>
          </div>

          <div className="stat-card">
            <p>Latest Status</p>
            <h2 style={{ fontSize: "24px" }}>
              {latestApplication ? latestApplication.status : "No Record"}
            </h2>
          </div>

          <div className="stat-card">
            <p>Notifications</p>
            <h2>{notifications.length}</h2>
          </div>

          <div className="stat-card">
            <p>Account Type</p>
            <h2 style={{ fontSize: "24px" }}>Student</h2>
          </div>
        </div>

        <div className="card">
          <h2>My Applications</h2>

          {applications.length === 0 ? (
            <div className="empty-box">
              <h3>No application submitted yet</h3>
              <p className="subtitle">
                Start your WKU international admission application by clicking
                the New Application button.
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Application ID</th>
                    <th>Program</th>
                    <th>Status</th>
                    <th>Submission Date</th>
                    <th>Documents</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((app) => (
                    <tr key={app.application_id}>
                      <td>#{app.application_id}</td>
                      <td>{app.program}</td>
                      <td>
                        <span className={getStatusClass(app.status)}>
                          {app.status}
                        </span>
                      </td>
                      <td>{new Date(app.submission_date).toLocaleString()}</td>
                      <td>
                        <button
                          className="secondary-btn"
                          onClick={() =>
                            (window.location.href = `/upload/${app.application_id}`)
                          }
                        >
                          Upload
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h2>Notifications</h2>

          {notifications.length === 0 ? (
            <p className="subtitle">No notifications yet.</p>
          ) : (
            <ul className="notice-list">
              {notifications.map((n) => (
                <li key={n.notification_id}>
                  <strong>{n.message}</strong>
                  <br />
                  <span className="subtitle">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;