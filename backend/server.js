const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log('Received request');

    if(req.method === 'GET' && req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});

        fs.readFile(path.join(__dirname, '../frontend/index.html'), (err, data) => {
            if(err) {
                console.error(err);
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('404 NOT FOUND');
            } else {
                res.end(data);
            }
        })


    }
});

server.listen(3000, 'localhost', () => {
    console.log('Server is listening');
});
