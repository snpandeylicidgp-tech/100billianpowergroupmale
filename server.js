const MONGO_URI = process.env.MONGO_URI || "";

if (MONGO_URI) {
  mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=> console.log("✅ MongoDB connected"))
    .catch(err => console.error("MongoDB connect error:", err.message));
} else {
  console.warn("⚠️ MONGO_URI not set — running without DB (using local fallback).");
}
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Add your routes here

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
