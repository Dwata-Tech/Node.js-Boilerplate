const { query } = require("./connect");
const { dbSchema, USER_LOGIN_TABLE, EMAIL, PASSWORD, USER_ID, IS_BLOCKED } = require("./dbConstants");

async function checkLoginDetails(email, password) {
    let dbQuery = `select * from "${dbSchema}"."${USER_LOGIN_TABLE}" 
                    where "${EMAIL}"='${email}' 
                    and "${PASSWORD}"='${password}';`;

    let { rows } = await query(dbQuery);
    return rows;
};

async function findEmail(email) {
    let dbQuery = `select * from "${dbSchema}"."${USER_LOGIN_TABLE}" 
                    where "${EMAIL}"='${email}';`;
    // find user
    let { rows } = await query(dbQuery);
    return rows;
};

async function createUserLogin(generatedUserId, email, password) {
    let dbQuery = `insert into 
    "${dbSchema}"."${USER_LOGIN_TABLE}" 
    ("${USER_ID}", "${EMAIL}", "${PASSWORD}") values 
    ('${generatedUserId}', '${email}', '${password}');`;

    // insert record
    await query(dbQuery);
    return;
};

async function createUserSocialLogin(generatedUserId, email) {
    let dbQuery = `insert into 
    "${dbSchema}"."${USER_LOGIN_TABLE}" 
    ("${USER_ID}", "${EMAIL}") values 
    ('${generatedUserId}', '${email}');`;

    // insert record
    await query(dbQuery);
    return;
};

async function getUserEmailData(email) {
    const dbQuery = `select "${EMAIL}","${USER_ID}"
  from ${dbSchema}.${USER_LOGIN_TABLE} 
  where ${USER_LOGIN_TABLE}.${EMAIL} = '${email}'`;
    // find user
    let { rows } = await query(dbQuery);
    return rows;
};

async function updatePassword(password, userId, email) {
    let updateUserPassword = `update ${dbSchema}.${USER_LOGIN_TABLE} set "${PASSWORD}"='${password}' where "${USER_ID}"= '${userId}' and "${EMAIL}"='${email}'`;
    await query(updateUserPassword);
    return;
};

async function updateBlockStatus(status, userId) {
    const dbQuery = `update ${dbSchema}.${USER_LOGIN_TABLE} set  "${IS_BLOCKED}" = ${status} where "${USER_ID}"= '${userId}';`;

    let { rowCount } = await query(dbQuery);
    return rowCount;
};

async function updateUserEmail(email, id) {
    const dbQuery = `update ${dbSchema}.${USER_LOGIN_TABLE} set "${EMAIL}"='${email}' where "${USER_ID}"= '${id}';`;
    await query(dbQuery);
    return;
};

module.exports = {
    checkLoginDetails,
    findEmail,
    createUserLogin,
    createUserSocialLogin,
    getUserEmailData,
    updatePassword,
    updateBlockStatus,
    updateUserEmail
}