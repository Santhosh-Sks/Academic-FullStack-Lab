const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Template engine setup
app.engine('hbs', exphbs.engine({ extname: 'hbs' }));
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

// Routes
app.get('/', (req, res) => {
  res.render('login');
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
  res.render('subjects', {
    student: currentStudent,
    subjects: semesterSubjects,
    attendance: studentAttendance
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

app.get('/logout', (req, res) => {
  currentStudent = null;
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 