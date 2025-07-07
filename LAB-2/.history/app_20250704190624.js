const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Template engine setup
app.engine('hbs', exphbs.engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
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

// Dummy storage (in-memory)
let currentStudent = null;
let courses = [];

// Routes
app.get('/', (req, res) => {
  if (req.session.student) return res.redirect('/dashboard');
  res.render('login');
});

app.post('/login', (req, res) => {
  const { email, rollno } = req.body;
  currentStudent = { email, rollno };
  req.session.student = email;
  res.redirect('/add-course');
});

app.get('/add-course', (req, res) => {
  if (!currentStudent) return res.redirect('/');
  res.render('add-course', { student: currentStudent });
});

app.post('/add-course', (req, res) => {
  const { coursename } = req.body;
  if (coursename) {
    const courses = getCourses();
    if (!courses[currentStudent.email]) courses[currentStudent.email] = [];
    courses[currentStudent.email].push({ name: coursename, desc: '' });
    saveCourses(courses);
  }
  res.redirect('/courses');
});

app.get('/courses', (req, res) => {
  res.render('course-list', { courses: getCourses()[currentStudent.email] || [] });
});

app.get('/dashboard', (req, res) => {
  if (!req.session.student) return res.redirect('/login');
  const studentCourses = getCourses()[req.session.student] || [];
  res.render('dashboard', { student: req.session.student, courses: studentCourses });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 