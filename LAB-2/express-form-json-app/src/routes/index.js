const express = require('express');
const FormController = require('../controllers/formController');

const router = express.Router();
const formController = new FormController();

function setRoutes(app) {
    router.get('/form', formController.getForm.bind(formController));
    router.post('/form', formController.postForm.bind(formController));
    app.use('/', router);
}

module.exports = setRoutes;