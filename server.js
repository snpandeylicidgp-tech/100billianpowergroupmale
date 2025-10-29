// server.js

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Static Files Serve (public folder)
app.use(express.static(path.join(__dirname, "public")));

// ✅ MongoDB Connection
const mongoURI = process.env.MONGODB_URI || "your_mongodb_connection_string_here";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch((err) => console.log("❌ MongoDB Connection Error:", err));

// ✅ Default Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Example API Route
app.get("/api/test", (req, res) => {
  res.json({ message: "API working fine ✅" });
});

// ✅ Port Configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running successfully on port ${PORT}`);
});
