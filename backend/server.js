const http = require('http');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');


const { findUserByUsername, createUser, findSessionIdByUserId } = require('./database/db-queries.js');
const { handleSessionCreation } = require('./session_management_utilities/session-Creation.js');
const { handleFileRead } = require('./callback_functions/callback_for_readfile.js');


const saltRounds = 10;

const server = http.createServer((req, res) => {

   
   
   
//--------------------Create blog endpoint--------------------
   
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





//--------------------Login endpoint--------------------

    if(req.method === 'POST' && req.url === '/api/login') {

        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })

        req.on('end', async () => {
                       
            try {
                let loginData = JSON.parse(body); //reading the data sent in the request body; {username, password}

                const user = await findUserByUsername(loginData.username); //finding the user {id, username, password} by the username provided in the frontend form

                if(!user) {
                    res.writeHead(401, {'Content-Type': 'application/json'}); //handling the case when the user is not yet registered
                    res.end(JSON.stringify({success: false, message: "User not found."}));
                    return;
                }

                const match = await bcrypt.compare(loginData.password, user.password); //comparing the passwrod from the user and from the backend
                
                if(match) {
                    //TODO: add session management here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    
                    await handleSessionCreation(user.iduser); //creating a session in the db
                    
                    //send sessionID to the frontend to be stored in a cookie
                    const sessionId = await findSessionIdByUserId(user.iduser);
                    console.log(sessionId);
                    res.setHeader('Set-Cookie', `sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Strict;`);
                    res.writeHead(200, {'Content-Type': 'application/json'}); //case when user exists and the password is correct
                    res.end(JSON.stringify({success: true, message: "Login successful."}));
                    return;
                } else {
                    res.writeHead(401, {'Content-Type': 'application/json'}); //case when the password is incorrect
                    res.end(JSON.stringify({success: false, message: "Incorrect password."}));
                    return;
                }

            } catch (error) {
                console.error("Error processing login request: ", error);
                res.writeHead(500, {'Content-Type': 'application/json'}); //handling any unexpected errors
                res.end(JSON.stringify({success: false, message: "Internal server error."}));

            }


            
            
            // let sessionId = uuidv4.v4(); //generating a unique session ID
            // await createSession(sessionId, databaseResult.iduser); //storing the session ID in the db
      
            // setting the session ID in a coookie for the browser to store
            // res.writeHead(200, {
            //     'Content-Type': 'application/json',
            //     'Set-Cookie': [
            //         `sessionId=${sessionId}; HttpOnly; Secure; SameSite=Strict; Max-Age=${60*60*100}`
            //     ]
            // });
            // res.end(JSON.stringify({message: "Login POST request received and processed."}));
        });
    }


    
    
     
//--------------------Register endpoint--------------------
    if(req.method === 'POST' && req.url === '/api/register') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        })


        req.on('end', async () => {

            try {
                let registerData = JSON.parse(body);

                const databaseResult = await findUserByUsername(registerData.username); 

                if(databaseResult !== undefined) {
                    res.writeHead(409, {'Content-Type': 'application/json'}); //handling the case when the username already exists in the database
                    res.end(JSON.stringify({success: false, message: "Username already exists."}));
                    return;
                }

                const hash = await bcrypt.hash(registerData.password, saltRounds); //hashing the password

                await createUser(registerData.username, hash); //storing the new user in the db


//TODO: add session management for the register endpoint!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

                res.writeHead(200, {'Content-Type': 'application/json'}); //case when the user is successfully registered
                res.end(JSON.stringify({success: true, message: "User registered successfully."}));
                return;

            } catch(error) {
                console.error("Error processing register request: ", error);
                res.writeHead(500, {'Content-Type': 'application/json'}); //handling any unexpected errors
                res.end(JSON.stringify({success: false, message: "Internal server error."}));
                return;
            }
        })
    } 













    // -----------GET requests-----------


//-------------serving login page-------------   
    if(req.method === 'GET' && req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        console.log(req.headers.cookie);
        fs.readFile(path.join(__dirname, '../frontend/html/login.html'), handleFileRead(res));

    }

  

 
//-------------serving dashboard page-------------  
    if(req.method === 'GET' && req.url === '/dashboard') {
        res.writeHead(200, {'Content-Type': 'text/html'});

        fs.readFile(path.join(__dirname, '../frontend/index.html'), handleFileRead(res));


    }




//-------------serving login page-------------    
    if(req.method === 'GET' && req.url === '/login') {
        res.writeHead(200, {'Content-Type': 'text/html'});

        fs.readFile(path.join(__dirname, '../frontend/html/login.html'), handleFileRead(res));  
    }




//-------------serving sign in page-------------
    if(req.method === 'GET' && req.url === '/signin') {
        res.writeHead(200, {'Content-Type': 'text/html'});

        fs.readFile(path.join(__dirname, '../frontend/html/signin.html'), handleFileRead(res));
    }

    


//-------------serving js files-------------
    if(req.method === 'GET' && path.extname(req.url) === '.js') {
        res.writeHead(200, {'Content-Type': 'text/javascript'});

        fs.readFile(path.join(__dirname, '../frontend', req.url), handleFileRead(res));
    }

});














//---------------------Starting the server--------------------

server.listen(3000, 'localhost', () => {
    console.log('Server is listening');
});
