import { useEffect, useState } from "react";
import API from "../api";

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
  });
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      window.location.href = "/";
      return;
    }

    setUser(savedUser);
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, appsRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/applications"),
      ]);

      setStats(statsRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      alert("Failed to load admin dashboard.");
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

  const filteredApplications = applications.filter((app) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      app.name?.toLowerCase().includes(keyword) ||
      app.email?.toLowerCase().includes(keyword) ||
      app.program?.toLowerCase().includes(keyword);

    const matchesStatus =
      statusFilter === "All" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="layout">
        <div className="topbar">
          <div className="topbar-title">WKU Admission Portal</div>
        </div>

        <main className="page">
          <div className="card">
            <h2>Loading admin dashboard...</h2>
            <p className="subtitle">Please wait while system data is loading.</p>
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
            <h1>Administrator Dashboard</h1>
            <p className="subtitle">
              Monitor application statistics and admission progress.
            </p>
          </div>
        </div>

        <div className="grid">
          <div className="stat-card">
            <p>Total Applications</p>
            <h2>{stats.total}</h2>
          </div>

          <div className="stat-card">
            <p>Accepted</p>
            <h2>{stats.accepted}</h2>
          </div>

          <div className="stat-card">
            <p>Rejected</p>
            <h2>{stats.rejected}</h2>
          </div>

          <div className="stat-card">
            <p>Pending</p>
            <h2>{stats.pending}</h2>
          </div>
        </div>

        <div className="card">
          <div className="page-header" style={{ marginBottom: "16px" }}>
            <div>
              <h2>All Applications</h2>
              <p className="subtitle">
                Search, filter, and monitor all submitted applications.
              </p>
            </div>
          </div>

          <div className="filter-row">
            <input
              className="input"
              style={{ marginTop: 0 }}
              placeholder="Search by student, email, or program..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="input"
              style={{ marginTop: 0, maxWidth: "240px" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Missing Documents">Missing Documents</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="empty-box">
              <h3>No matching applications</h3>
              <p className="subtitle">
                Try changing the search keyword or status filter.
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Program</th>
                    <th>Status</th>
                    <th>Submitted</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.application_id}>
                      <td>#{app.application_id}</td>
                      <td>{app.name}</td>
                      <td>{app.email}</td>
                      <td>{app.program}</td>
                      <td>
                        <span className={getStatusClass(app.status)}>
                          {app.status}
                        </span>
                      </td>
                      <td>{new Date(app.submission_date).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;