import { useEffect, useState } from "react";
import API from "../api";

function OfficerDashboard() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
      window.location.href = "/";
      return;
    }

    setUser(savedUser);
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await API.get("/officer/applications");
      setApplications(res.data);
    } catch (err) {
      alert("Failed to load applications.");
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

  const reviewApplication = async (applicationId, decision) => {
    const remarkText = remarks[applicationId];

    if (!remarkText || remarkText.trim().length < 5) {
      alert("Please enter meaningful review remarks before submitting.");
      return;
    }

    const confirmReview = window.confirm(
      `Confirm decision: ${decision}? This will update the student's application status.`
    );

    if (!confirmReview) return;

    try {
      await API.post("/officer/review", {
        application_id: applicationId,
        officer_id: user.user_id,
        decision,
        remarks: remarkText,
      });

      alert("Application reviewed successfully.");

      setRemarks({
        ...remarks,
        [applicationId]: "",
      });

      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.message || "Review failed.");
    }
  };

  const total = applications.length;
  const accepted = applications.filter((a) => a.status === "Accepted").length;
  const rejected = applications.filter((a) => a.status === "Rejected").length;
  const pending = applications.filter(
    (a) =>
      a.status === "Submitted" ||
      a.status === "Under Review" ||
      a.status === "Missing Documents"
  ).length;

  if (loading) {
    return (
      <div className="layout">
        <div className="topbar">
          <div className="topbar-title">WKU Admission Portal</div>
        </div>

        <main className="page">
          <div className="card">
            <h2>Loading applications...</h2>
            <p className="subtitle">Please wait while we load review data.</p>
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
            <h1>Admission Officer Dashboard</h1>
            <p className="subtitle">
              Review applications, leave comments, and update admission status.
            </p>
          </div>
        </div>

        <div className="grid">
          <div className="stat-card">
            <p>Total Applications</p>
            <h2>{total}</h2>
          </div>

          <div className="stat-card">
            <p>Accepted</p>
            <h2>{accepted}</h2>
          </div>

          <div className="stat-card">
            <p>Rejected</p>
            <h2>{rejected}</h2>
          </div>

          <div className="stat-card">
            <p>Pending Review</p>
            <h2>{pending}</h2>
          </div>
        </div>

        <div className="card">
          <h2>Application Review List</h2>

          {applications.length === 0 ? (
            <div className="empty-box">
              <h3>No applications available</h3>
              <p className="subtitle">
                Student applications will appear here after submission.
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
                    <th>Review Remarks</th>
                    <th>Decision</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((app) => {
                    const isFinal =
                      app.status === "Accepted" || app.status === "Rejected";

                    return (
                      <tr key={app.application_id}>
                        <td>#{app.application_id}</td>
                        <td>{app.student_name}</td>
                        <td>{app.student_email}</td>
                        <td>{app.program}</td>

                        <td>
                          <span className={getStatusClass(app.status)}>
                            {app.status}
                          </span>
                        </td>

                        <td>
                          {isFinal ? (
                            <span className="subtitle">
                              Finalized application
                            </span>
                          ) : (
                            <textarea
                              className="textarea"
                              placeholder="Enter review comments..."
                              value={remarks[app.application_id] || ""}
                              onChange={(e) =>
                                setRemarks({
                                  ...remarks,
                                  [app.application_id]: e.target.value,
                                })
                              }
                            />
                          )}
                        </td>

                        <td>
                          {isFinal ? (
                            <span className={getStatusClass(app.status)}>
                              Final Decision
                            </span>
                          ) : (
                            <div className="action-row">
                              <button
                                className="success-btn"
                                onClick={() =>
                                  reviewApplication(
                                    app.application_id,
                                    "Approved"
                                  )
                                }
                              >
                                Approve
                              </button>

                              <button
                                className="danger-btn"
                                onClick={() =>
                                  reviewApplication(
                                    app.application_id,
                                    "Rejected"
                                  )
                                }
                              >
                                Reject
                              </button>

                              <button
                                className="warning-btn"
                                onClick={() =>
                                  reviewApplication(
                                    app.application_id,
                                    "Need More Documents"
                                  )
                                }
                              >
                                Need Docs
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default OfficerDashboard;