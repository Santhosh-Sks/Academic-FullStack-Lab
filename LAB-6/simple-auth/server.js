const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); 
mongoose.connect('mongodb+srv://santhoshs24mca:santhosh@cluster0.vfyfmux.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.send('<h3>Signup successful! <a href="/">Go to Login</a></h3>');
    } catch (err) {
        res.send('<h3>User already exists or error occurred. <a href="/">Try Again</a></h3>');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        res.cookie('username', username, { maxAge: 3600000 });
        res.redirect('/dashboard');
    } else {
        res.send('<h3>Invalid Credentials. <a href="/">Try Again</a></h3>');
    }
});

app.get('/dashboard', (req, res) => {
    if (req.cookies.username) {
        res.send(`
            <h2>Welcome ${req.cookies.username}!</h2>
            <a href="/logout">Logout</a>
        `);
    } else {
        res.redirect('/');
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
