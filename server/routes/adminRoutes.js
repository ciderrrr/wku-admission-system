const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const [[total]] = await pool.query(
      "SELECT COUNT(*) AS count FROM applications"
    );

    const [[accepted]] = await pool.query(
      "SELECT COUNT(*) AS count FROM applications WHERE status = 'Accepted'"
    );

    const [[rejected]] = await pool.query(
      "SELECT COUNT(*) AS count FROM applications WHERE status = 'Rejected'"
    );

    const [[pending]] = await pool.query(
      "SELECT COUNT(*) AS count FROM applications WHERE status IN ('Submitted', 'Under Review', 'Missing Documents')"
    );

    res.json({
      total: total.count,
      accepted: accepted.count,
      rejected: rejected.count,
      pending: pending.count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch statistics" });
  }
});

router.get("/applications", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        a.*,
        u.name,
        u.email
      FROM applications a
      JOIN users u
      ON a.user_id = u.user_id
      ORDER BY a.submission_date DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
});

module.exports = router;