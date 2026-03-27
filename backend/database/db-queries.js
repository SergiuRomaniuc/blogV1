
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




module.exports = {
    findUserByUsername,
    createSession, 
    createUser,
    findSessionIdByUserId
}
