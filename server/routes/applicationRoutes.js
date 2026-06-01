const express = require("express");
const pool = require("../db");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      full_name,
      gender,
      nationality,
      passport_number,
      high_school,
      gpa,
      program,
    } = req.body;

    await pool.query(
      `INSERT INTO applications 
      (user_id, full_name, gender, nationality, passport_number, high_school, gpa, program)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        full_name,
        gender,
        nationality,
        passport_number,
        high_school,
        gpa,
        program,
      ]
    );

    res.json({ message: "Application submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Application submission failed" });
  }
});

router.get("/student/:user_id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM applications WHERE user_id = ? ORDER BY submission_date DESC",
      [req.params.user_id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

router.get("/notifications/:user_id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
      [req.params.user_id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

module.exports = router;