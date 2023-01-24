const { query } = require("./connect");
const { dbSchema, SESSION_TABLE, SESSION_ID, USER_ID, EXPIRY, LOGIN_TYPE, IS_VALID } = require("./dbConstants");

async function createSession(sessionId, userId, session_expiry, loginType) {
    let insertSessionRecord = `insert into 
        "${dbSchema}"."${SESSION_TABLE}" 
        ("${SESSION_ID}", "${USER_ID}", "${EXPIRY}", "${LOGIN_TYPE}") values 
        ('${sessionId}', '${userId}', '${session_expiry}', '${loginType}');`;

    await query(insertSessionRecord);
    return;
};

async function getSessionData(sessionId) {
    let dbQuery = `select * from ${dbSchema}.${SESSION_TABLE} where "${SESSION_ID}"='${sessionId}' and "${IS_VALID}"=true`;

    let { rows } = await query(dbQuery);
    return rows;
};

async function updateSessionData(sessionId) {
    let updateSessionQuery = `update  ${dbSchema}.${SESSION_TABLE} set "${IS_VALID}"=false where "${SESSION_ID}"='${sessionId}' and "${IS_VALID}"=true`;

    await query(updateSessionQuery);
    return;
};

module.exports = {
    createSession,
    getSessionData,
    updateSessionData
}