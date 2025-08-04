const express = require('express');
const path = require('path');
const fs = require('fs');
const exphbs = require('express-handlebars');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars setup
app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Show form using Handlebars view
app.get('/', (req, res) => {
  res.render('form', { layout: false });
});

// Handle form submission
app.post('/submit', (req, res) => {
  const formData = req.body;
  const dataPath = path.join(__dirname, 'data.json');
  fs.writeFileSync(dataPath, JSON.stringify(formData, null, 2));
  res.redirect('/display');
});

// Display submitted data
app.get('/display', (req, res) => {
  const dataPath = path.join(__dirname, 'data.json');
  let data = {};
  if (fs.existsSync(dataPath)) {
    data = JSON.parse(fs.readFileSync(dataPath));
  }
  res.render('display', { layout: false, data });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
