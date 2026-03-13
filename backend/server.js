const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {

    if(req.method === 'POST' && req.url === '/api/createBlog') {
        console.log('Req to create a blog POST')
    }


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

        console.log('Req to load the page');

    }

    if(req.method === 'GET' && path.extname(req.url) === '.js') {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        console.log(req.url);
        fs.readFile(path.join(__dirname, '../frontend', req.url), (err, data) => {
            if(err) {
                console.error(err);
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('404 NOT FOUND');
            } else {
                res.end(data);
            }
        })

        console.log('Req to load the page');

    }

});

server.listen(3000, 'localhost', () => {
    console.log('Server is listening');
});
