const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/officer", require("./routes/officerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 8787;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});