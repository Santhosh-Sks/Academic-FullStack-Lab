# Express Form JSON App

This project is a simple Express application that allows users to submit data through a form. The submitted data is stored in a JSON file and can be displayed on another page using Handlebars as the templating engine.

## Project Structure

```
express-form-json-app
├── src
│   ├── app.js                # Entry point of the application
│   ├── routes
│   │   └── index.js          # Route definitions
│   ├── controllers
│   │   └── formController.js  # Controller for handling form logic
│   ├── views
│   │   ├── form.hbs          # Form view for user input
│   │   └── display.hbs       # View for displaying submitted data
│   └── data
│       └── submissions.json   # JSON file for storing submitted data
├── package.json               # npm configuration file
└── README.md                  # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd express-form-json-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the application:
   ```
   npm start
   ```

2. Open your browser and go to `http://localhost:3000` to access the form.

3. Fill out the form and submit it. You will be redirected to a page displaying the submitted data.

## Dependencies

- Express: A web framework for Node.js
- Handlebars: A templating engine for rendering views

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.