const http = require('http');
const fs = require('fs');
const path = require('path');
const  uuidv4 = require('uuid');
const bcrypt = require('bcrypt');


const { findUserByUsername, createSession, createUser } = require('./database/db-queries.js');

const saltRounds = 10;


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

        req.on('end', async () => { 
            let loginData = JSON.parse(body);

            const databaseResult = await findUserByUsername(loginData.username);
            
            if(databaseResult !== undefined) { 
                if(databaseResult.password === loginData.password) {
                    console.log("Login successful for user: ", loginData.username);
                } else {
                    console.log("Login failed for user: ", loginData.username, " - Incorrect password.");
                }
            } else {
                console.log("Login failed - User not found: ", loginData.username);
                res.writeHead(401);
                res.end();
                return;
            }


            let sessionId = uuidv4.v4(); //generating a unique session ID
            

            await createSession(sessionId, databaseResult.iduser); //storing the session ID in the db
      
            // setting the session ID in a coookie for the browser to store
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Set-Cookie': [
                    `sessionId=${sessionId}; HttpOnly; Secure; SameSite=Strict; Max-Age=${60*60*100}`
                ]
            });
            res.end(JSON.stringify({message: "Login POST request received and processed."}));
        });
    }

    if(req.method === 'POST' && req.url === '/api/register') {
        let body = '';

        console.log('Req to register POST');

        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', async () => {
            let registerData = JSON.parse(body);

            const databaseResult = await findUserByUsername(registerData.username);
            //checking if the username already exists in the database
            if(databaseResult !== undefined) {
                console.log("Registration failed - Username already exists: ", registerData.username);  
                res.writeHead(409, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: "Username already exists."}));
                return;
            } else {
                //hashing the password and sotring it in the database
                bcrypt.hash(registerData.password, saltRounds, async (err, hash) => {
                    if(err) {
                        console.error("Error hashing password: ", err);
                        res.writeHead(500);
                        res.end();
                        return;
                    }
                    await createUser(registerData.username, hash);

                })
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: true}));          
        })
    } 


    // -----------GET requests-----------

    if(req.method === 'GET' && req.url === '/') {
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

        if(req.method === 'GET' && req.url === '/dashboard') {
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

    if(req.method === 'GET' && req.url === '/html/signin.html') {
        res.writeHead(200, {'Content-Type': 'text/html'});

        fs.readFile(path.join(__dirname, '../frontend/html/signin.html'), (err, data) => {
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
