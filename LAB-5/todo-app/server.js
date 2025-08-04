const http = require('http');
const fs = require('fs');
const path = require('path');

const todosPath = path.join(__dirname, 'data', 'todos.json');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/todos') {
        fs.readFile(todosPath, 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error reading file');
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    } else if (req.method === 'POST' && req.url === '/todos') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            fs.writeFile(todosPath, body, err => {
                if (err) {
                    res.writeHead(500);
                    return res.end('Error writing file');
                }
                res.writeHead(200);
                res.end('Data saved');
            });
        });
    } else {
        let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
        let extname = path.extname(filePath);
        let contentType = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css'
        }[extname] || 'text/plain';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
    }
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
