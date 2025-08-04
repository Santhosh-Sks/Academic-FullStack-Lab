class FormController {
    static getForm(req, res) {
        res.render('form');
    }

    static postForm(req, res) {
        const fs = require('fs');
        const path = require('path');
        const submissionsFilePath = path.join(__dirname, '../data/submissions.json');

        const newSubmission = req.body;

        fs.readFile(submissionsFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading submissions file');
            }

            let submissions = [];
            if (data) {
                submissions = JSON.parse(data);
            }

            submissions.push(newSubmission);

            fs.writeFile(submissionsFilePath, JSON.stringify(submissions, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error saving submission');
                }

                res.redirect('/display');
            });
        });
    }
}

module.exports = FormController;