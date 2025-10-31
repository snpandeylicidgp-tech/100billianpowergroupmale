const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "";

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect MongoDB safely
if (MONGO_URI) {
  mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err.message));
} else {
  console.warn("⚠️ MONGO_URI not set — running without DB (using local fallback).");
}

// ✅ Routes
app.get('/', (req, res) => {
  res.send('Hello, world! Your server is running successfully 🚀');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
