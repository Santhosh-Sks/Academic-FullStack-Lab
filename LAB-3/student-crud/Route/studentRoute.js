const express = require('express');
const router = express.Router();
const Student = require('../models/Student');



// CREATE
router.post('/students', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.send(student);
    } catch (err) {
        res.status(400).send(err);
    }
});

// READ
router.get('/students', async (req, res) => {
    const students = await Student.find();
    res.send(students);
});

// UPDATE
router.put('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(student);
    } catch (err) {
        res.status(400).send(err);
    }
});

// DELETE
router.delete('/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.send({ message: 'Student deleted' });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
