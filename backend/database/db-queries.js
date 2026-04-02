
const mysql = require('mysql2/promise');
const dbConfig = require('./db-Config.js');

async function findUserByUsername(username) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const sql = 'select * from user where username=(?)';
        const result = await connection.query(sql, username);

        return result[0][0];
    } catch (error) {
        console.log("Database error: ", error);
        throw error;
    } finally {
        if(connection) connection.end();
    }
}

async function findUserBySessionId(sessionId) {
    let connection; //finding the user by the session ID stored in the cookie
    
    if(!sessionId) return null; //if there is no session ID, return null

    try {
        connection = await mysql.createConnection(dbConfig);
        const sql = 'select iduser, username from user join session u on iduser=u.idusersession where u.sessionId = ?';
        const result = await connection.query(sql, sessionId);

        return result[0][0] == undefined ? null : result[0][0];//for the case when the session ID is not in the db

    } catch (error) {
        console.error("Database error: ", error);
        throw error;
    } finally {
        if(connection) connection.end();
    }
}
 
async function findSessionIdByUserId(userId) {
    let connection; //finding the session ID for a specific user ID
    try {
        connection = await mysql.createConnection(dbConfig);
        const sql = 'select sessionId from session where idusersession=(?)';
        
        const result = await connection.query(sql, userId); 
        return result[0][0].sessionId;
    } catch (error) {
        console.error("Database error: ", error);
        throw error;
    } finally {
        if(connection) connection.end();
    }
}

async function deleteSession(userId) {
    //deleting any existing session for the user before creating a new one
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const sql = 'delete from session where idusersession=(?)';
        await connection.query(sql, userId);
    } catch (error) {
        console.error("Database error: ", error);
        throw error;
    } finally {
        if(connection) connection.end();
    }
}

async function createSession(sessionId, userId) {
    //inserting the session ID for the specific iduser
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await deleteSession(userId); //deleting any existing session for the user before creating a new one
        const sql = 'insert into session (sessionId, idusersession) values (?, ?)';
        await connection.query(sql, [sessionId, userId]);
    } catch (error) {
        console.log("Database error: ", error);
        throw error;
    } finally {
        if(connection) connection.end();
    }
}

async function createUser(username, password) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const sql = 'insert into user (username, password) values (?, ?)';
        await connection.query(sql, [username, password]);
    } catch (error) {
        console.log("Database error: ", error);
        throw error;
    } finally {
        if(connection) connection.end();
    }
}


async function createBlogPost(blogText, sessionId) {
    let connection;
    try {
        const user = await findUserBySessionId(sessionId);
        
        if(!user) throw new Error("No user found");


        connection = await mysql.createConnection(dbConfig);
        const sql = 'insert into blog (text, userid) values (?, ?)';

        await connection.query(sql, [blogText, user.iduser]);

    } catch (error) {
        console.error("Database error: ", error);
        throw error;
    } finally {
        if(connection) connection.end();
    }
}

async function getAllBlogPosts(iduser) {
    let connection;
    try {

        connection = await mysql.createConnection(dbConfig);

        const sql = 'select text from blog where userid=?;';

        const result = await connection.query(sql, iduser);

        return result[0].map(post => post.text);

    } catch (error) {
        console.error("Database error: ", error);
        throw error;
    } finally {
        if(connection) connection.end();
    }
}

module.exports = {
    findUserByUsername,
    createSession, 
    createUser,
    findSessionIdByUserId,
    findUserBySessionId,
    deleteSession,
    createBlogPost,
    getAllBlogPosts
}
