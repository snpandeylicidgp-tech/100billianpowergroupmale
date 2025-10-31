// server.js - MLM app (100billianpowergroupmale)
const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"; // change in Render env
let adminToken = null; // simple in-memory token for admin session

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB (optional)
let UseMongo = false;
let MemberModel = null;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true })
    .then(()=>{ console.log('✅ MongoDB connected'); UseMongo = true;
      const memberSchema = new mongoose.Schema({
        id:String,name:String,mobile:String,dob:String,aadhar:String,parentId:String,paid:Boolean,joinDate:Date,left:String,right:String
      });
      MemberModel = mongoose.model('Member', memberSchema);
    })
    .catch(err=>{ console.error('MongoDB connect error:', err.message || err); });
}

// Simple file fallback storage
const USERS_FILE = path.join(__dirname, 'users.json');
let users = {}
function loadUsers(){ if(fs.existsSync(USERS_FILE)){ try{ users = JSON.parse(fs.readFileSync(USERS_FILE)) }catch(e){ users = {} } } else users = {} }
function saveUsers(){ fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2)); }
loadUsers();

function genId(){ return 'U'+Math.random().toString(36).slice(2,10).toUpperCase(); }

// Routes
app.get('/', (req,res)=> { res.sendFile(path.join(__dirname,'public','index.html')); });
app.get('/admin.html', (req,res)=> { res.sendFile(path.join(__dirname,'public','admin.html')); });

// Register new member
app.post('/register', async (req,res)=>{
  try{
    const { name,mobile,dob,aadhar,parentId } = req.body;
    if(!name || !mobile || !dob || !aadhar) return res.status(400).json({ message: 'Missing fields' });
    const id = genId();
    const member = { id, name, mobile, dob, aadhar, parentId: parentId||null, paid:true, joinDate: new Date() };
    if(UseMongo && MemberModel){
      const doc = new MemberModel(member); await doc.save();
    } else {
      users[id] = member; saveUsers();
    }
    return res.json({ message:'Registered', userId: id });
  }catch(err){ console.error(err); return res.status(500).json({ message:'Server error' }); }
});

// Admin login - returns a token
app.post('/admin-login', (req,res)=>{
  const { password } = req.body;
  if(password === ADMIN_PASSWORD){
    adminToken = Math.random().toString(36).slice(2);
    return res.json({ ok:true, token: adminToken });
  } else return res.status(401).json({ ok:false, message:'Invalid password' });
});

// Middleware to protect admin API
function requireAdmin(req,res,next){
  const token = req.headers['x-admin-token'] || req.query.token;
  if(adminToken && token === adminToken) return next();
  return res.status(401).json({ message:'Unauthorized' });
}

// Members list (protected)
app.get('/api/members', requireAdmin, async (req,res)=>{
  if(UseMongo && MemberModel){
    const list = await MemberModel.find().lean();
    return res.json(list);
  } else return res.json(Object.values(users));
});

// Health
app.get('/api/health', (req,res)=> res.json({ ok:true }));

app.listen(PORT, ()=> console.log(`🚀 100billianpowergroupmale server running on port ${PORT}`));
