const http = require('http');
const fs = require('fs');
const path = require('path');

const dbConfig = require('./database/db-config.js');



const server = http.createServer((req, res) => {

    if(req.method === 'POST' && req.url === '/api/createBlog') {

        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        })

        req.on('end', () => {

            let blogData = JSON.parse(body);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: "POST request received and processed."}));
        })
    } 
    if(req.method === 'POST' && req.url === '/api/login') {

        let body = '';
        console.log('Req to login POST');
        req.on('data', (chunk) => {
            body += chunk.toString();
        })

        req.on('end', () => { 
            let loginData = JSON.parse(body);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: "Login POST request received and processed."}));
        });
    }
    // else {
    //     res.writeHead(404, {'Content-Type': 'text/plain'});
    //     res.end('404 NOT FOUND');
    // }


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

        if(req.method === 'GET' && req.url === '/html/login.html') {
        res.writeHead(200, {'Content-Type': 'text/html'});

        fs.readFile(path.join(__dirname, '../frontend/html/login.html'), (err, data) => {
            if(err) {
                console.error(err);
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('404 NOT FOUND');
            } else {
                res.end(data);
            }
        })


    }

    if(req.method === 'GET' && path.extname(req.url) === '.js') {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        fs.readFile(path.join(__dirname, '../frontend', req.url), (err, data) => {
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
