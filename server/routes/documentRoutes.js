const express = require("express");
const multer = require("multer");
const path = require("path");
const pool = require("../db");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("document"), async (req, res) => {
  try {
    const { application_id, document_type } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    await pool.query(
      `INSERT INTO documents 
      (application_id, file_name, file_path, document_type)
      VALUES (?, ?, ?, ?)`,
      [
        application_id,
        req.file.originalname,
        req.file.filename,
        document_type,
      ]
    );

    res.json({ message: "Document uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Document upload failed" });
  }
});

router.get("/:application_id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM documents WHERE application_id = ?",
      [req.params.application_id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
});

module.exports = router;