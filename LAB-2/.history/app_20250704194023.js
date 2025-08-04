const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Template engine setup with helper (v6+ syntax)
const hbs = exphbs.create({
  extname: 'hbs',
  helpers: {
    attendanceCount: function(attendance, subject) {
      return (attendance && attendance[subject]) ? attendance[subject].length : 0;
    }
  }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Dummy storage (in-memory for student session)
let currentStudent = null;

// Semester subjects
const semesterSubjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Science",
  "English"
];

// Attendance persistence
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
const attendanceFile = path.join(dataDir, 'attendance.json');
if (!fs.existsSync(attendanceFile)) fs.writeFileSync(attendanceFile, '{}');

function getAttendance() {
  return JSON.parse(fs.readFileSync(attendanceFile, 'utf-8'));
}
function saveAttendance(att) {
  fs.writeFileSync(attendanceFile, JSON.stringify(att, null, 2));
}

// Leave persistence
const leaveFile = path.join(dataDir, 'leaves.json');
if (!fs.existsSync(leaveFile)) fs.writeFileSync(leaveFile, '{}');

function getLeaves() {
  return JSON.parse(fs.readFileSync(leaveFile, 'utf-8'));
}
function saveLeaves(leaves) {
  fs.writeFileSync(leaveFile, JSON.stringify(leaves, null, 2));
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, email, rollno } = req.body;
  currentStudent = { username, email, rollno };
  res.redirect('/subjects');
});

app.get('/subjects', (req, res) => {
  if (!currentStudent) return res.redirect('/');
  const attendance = getAttendance();
  const studentAttendance = attendance[currentStudent.email] || {};
  const leaves = getLeaves();
  const studentLeaves = leaves[currentStudent.email] || [];
  res.render('subjects', {
    student: currentStudent,
    subjects: semesterSubjects,
    attendance: studentAttendance,
    leaves: studentLeaves
  });
});

app.post('/mark-attendance', (req, res) => {
  const { subject } = req.body;
  if (!currentStudent || !subject) return res.redirect('/subjects');
  const attendance = getAttendance();
  if (!attendance[currentStudent.email]) attendance[currentStudent.email] = {};
  if (!attendance[currentStudent.email][subject]) attendance[currentStudent.email][subject] = [];
  // Mark today's date
  const today = new Date().toISOString().slice(0, 10);
  if (!attendance[currentStudent.email][subject].includes(today)) {
    attendance[currentStudent.email][subject].push(today);
  }
  saveAttendance(attendance);
  res.redirect('/subjects');
});

app.post('/submit-leave', (req, res) => {
  const { subject, date, reason } = req.body;
  if (!currentStudent || !subject || !date || !reason) return res.redirect('/subjects');
  const leaves = getLeaves();
  if (!leaves[currentStudent.email]) leaves[currentStudent.email] = [];
  leaves[currentStudent.email].push({ subject, date, reason });
  saveLeaves(leaves);
  res.redirect('/subjects');
});

app.get('/logout', (req, res) => {
  currentStudent = null;
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 