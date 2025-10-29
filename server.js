const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const app = express();
app.use(bodyParser.json());
app.use(express.static("public")); // for frontend files

// Dummy in-memory storage (testing only)
let users = {}; // key = userID
let tree = {};  // key = parentID

// -------------------------------
// Utility Functions
// -------------------------------

function createUser(name, mobile, dob, aadhar, parentId = null) {
  const id = uuidv4().slice(0, 8);
  users[id] = {
    id,
    name,
    mobile,
    dob,
    aadhar,
    parentId,
    left: null,
    right: null,
    joinDate: new Date(),
    paid: false,
    color: "gray",
    level: 1
  };

  if (parentId && tree[parentId]) {
    if (!tree[parentId].left) tree[parentId].left = id;
    else if (!tree[parentId].right) tree[parentId].right = id;
  }

  tree[id] = { left: null, right: null };
  return id;
}

function checkCompletion(userId) {
  const user = tree[userId];
  if (user && user.left && user.right) {
    users[userId].color = "green";
    return true;
  }
  return false;
}

function calculateCommission(parentId, level = 1) {
  if (!parentId || level > 10) return;
  const user = users[parentId];
  if (!user) return;
  if (level === 1) user.balance = (user.balance || 0) + 50; // joining refund
  else user.balance = (user.balance || 0) + 20;
  if (user.parentId) calculateCommission(user.parentId, level + 1);
}

// -------------------------------
// API Endpoints
// -------------------------------

// Registration (Step 1)
app.post("/register", async (req, res) => {
  const { name, mobile, dob, aadhar, parentId } = req.body;
  if (!name || !mobile || !dob || !aadhar) {
    return res.status(400).json({ error: "Incomplete details" });
  }

  const userId = createUser(name, mobile, dob, aadhar, parentId);

  // Dummy ₹100 payment (Paytm simulation)
  console.log(`Initiating ₹100 payment for ${mobile}`);
  users[userId].paid = true;

  res.json({ message: "Registered successfully", userId });
});

// On left+right completion (auto payout)
app.post("/complete", (req, res) => {
  const { userId } = req.body;
  if (!userId || !users[userId]) {
    return res.status(400).json({ error: "Invalid user" });
  }

  if (checkCompletion(userId)) {
    calculateCommission(userId);
    return res.json({
      message: "Tree complete! Commission distributed.",
      user: users[userId],
    });
  }

  res.json({ message: "Tree not complete yet" });
});

// Fetch Downline Tree
app.get("/tree/:id", (req, res) => {
  const id = req.params.id;
  if (!users[id]) return res.status(404).json({ error: "User not found" });
  res.json({ user: users[id], children: tree[id] });
});

// -------------------------------
app.listen(3000, () => {
  console.log("✅ MLM Server with Paytm integration running on port 3000");
});
// Get all members list (for admin)
app.get("/api/members", (req, res) => {
  // users object में से सभी members की array बनाओ
  const memberList = Object.values(users).map(u => ({
    id: u.id,
    name: u.name,
    mobile: u.mobile,
    paid: u.paid,
    joinDate: u.joinDate
  }));
  res.json(memberList);
});

