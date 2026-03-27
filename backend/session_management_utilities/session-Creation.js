const  uuidv4 = require('uuid');

const { createSession } = require('../database/db-queries.js');


async function handleSessionCreation(userId) {
    let sessionId = uuidv4.v4(); //generating a unique session ID

    await createSession(sessionId, userId); //storing the session ID in the db
}

module.exports = {
    handleSessionCreation
}
