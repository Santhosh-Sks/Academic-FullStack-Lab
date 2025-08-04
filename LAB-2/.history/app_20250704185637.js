const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Set up hbs
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'simple-secret',
  resave: false,
  saveUninitialized: true
}));

// Ensure data directory and courses.json exist
const dataDir = path.join(__dirname, 'data');
const coursesFile = path.join(dataDir, 'courses.json');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(coursesFile)) fs.writeFileSync(coursesFile, '{}');

// Helper to read/write courses
function getCourses() {
  return JSON.parse(fs.readFileSync(coursesFile, 'utf-8'));
}
function saveCourses(courses) {
  fs.writeFileSync(coursesFile, JSON.stringify(courses, null, 2));
}

// Routes
app.get('/', (req, res) => {
  if (req.session.student) return res.redirect('/dashboard');
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { student } = req.body;
  if (!student) return res.render('login', { error: 'Enter your name or ID' });
  req.session.student = student;
  res.redirect('/dashboard');
});

app.get('/dashboard', (req, res) => {
  if (!req.session.student) return res.redirect('/login');
  const courses = getCourses();
  const studentCourses = courses[req.session.student] || [];
  res.render('dashboard', { student: req.session.student, courses: studentCourses });
});

app.post('/add-course', (req, res) => {
  if (!req.session.student) return res.redirect('/login');
  const { courseName, courseDesc } = req.body;
  if (!courseName) return res.redirect('/dashboard');
  const courses = getCourses();
  if (!courses[req.session.student]) courses[req.session.student] = [];
  courses[req.session.student].push({ name: courseName, desc: courseDesc });
  saveCourses(courses);
  res.redirect('/dashboard');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 