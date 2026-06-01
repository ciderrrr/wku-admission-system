const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/applications", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.*, u.name AS student_name, u.email AS student_email
      FROM applications a
      JOIN users u ON a.user_id = u.user_id
      ORDER BY a.submission_date DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

router.post("/review", async (req, res) => {
  try {
    const { application_id, officer_id, decision, remarks } = req.body;

    let newStatus = "Under Review";

    if (decision === "Approved") newStatus = "Accepted";
    if (decision === "Rejected") newStatus = "Rejected";
    if (decision === "Need More Documents") newStatus = "Missing Documents";

    await pool.query(
      "INSERT INTO reviews (application_id, officer_id, decision, remarks) VALUES (?, ?, ?, ?)",
      [application_id, officer_id, decision, remarks]
    );

    await pool.query(
      "UPDATE applications SET status = ? WHERE application_id = ?",
      [newStatus, application_id]
    );

    const [[app]] = await pool.query(
      "SELECT user_id FROM applications WHERE application_id = ?",
      [application_id]
    );

    await pool.query(
      "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
      [app.user_id, `Your application status has been updated to: ${newStatus}`]
    );

    res.json({ message: "Application reviewed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Review failed" });
  }
});

module.exports = router;