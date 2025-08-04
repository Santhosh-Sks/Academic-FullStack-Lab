const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

const questions = require('./questions.json');

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api/questions', (req, res) => {
    res.json(questions);
});

app.post('/api/validate', (req, res) => {
    const { id, selectedAnswer } = req.body;
    const question = questions.find(q => q.id === id);

    if (question) {
        const isCorrect = question.answer === selectedAnswer;
        res.json({ correct: isCorrect });
    } else {
        res.status(404).json({ message: 'Question not found' });
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
