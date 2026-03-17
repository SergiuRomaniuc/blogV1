
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

async function createSession(sessionId, userId) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const sql = 'insert into session (sessionId, idusersession) values (?, ?)';
        await connection.query(sql, [sessionId, userId]);
    } catch (error) {
        console.log("Database error: ", error);
        throw error;
    } finally {
        if(connection) connection.end();
    }
}

module.exports = {
    findUserByUsername,
    createSession
}
