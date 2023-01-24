const { query } = require("./connect");
const { dbSchema, USER_TABLE, USER_ID, FIRST_NAME, LAST_NAME, PHONE_NUMBER, IS_EMAIL_VERIFIED, EMAIL, USER_LOGIN_TABLE } = require("./dbConstants");

async function registerUser(generatedUserId, firstName, lastName, phoneNumber) {
    let dbQuery = `insert into 
        "${dbSchema}"."${USER_TABLE}" 
        ("${USER_ID}", "${FIRST_NAME}", "${LAST_NAME}", "${PHONE_NUMBER}") values 
        ('${generatedUserId}', '${firstName}', '${lastName}', '${phoneNumber}');`;

    // insert record
    await query(dbQuery);
    return;
};

async function socialLogin(generatedUserId, firstName, lastName) {
    let dbQuery = `insert into 
        "${dbSchema}"."${USER_TABLE}" 
        ("${USER_ID}", "${FIRST_NAME}", "${LAST_NAME}", "${IS_EMAIL_VERIFIED}") values 
        ('${generatedUserId}', '${firstName}', '${lastName}', true);`;

    // insert record
    await query(dbQuery);
    return;
};

async function getUserById(userId) {
    let dbQuery = `Select * from ${dbSchema}.${USER_TABLE} where "${USER_ID}"='${userId}'`;
    let { rows } = await query(dbQuery);
    return rows;
};

async function getUserByEmail(email) {
    const dbQuery = `select "${USER_ID}"
    from ${dbSchema}.${USER_LOGIN_TABLE} 
    where ${USER_LOGIN_TABLE}.${EMAIL} = '${email}'`;

    let { rows } = await query(dbQuery);
    return rows;
};

async function updateUser(first_name, last_name, phone_number, id) {
    const dbQuery = `update ${dbSchema}.${USER_TABLE} set ${first_name}, ${last_name}, ${phone_number} where "${USER_ID}"= '${id}';`;
    await query(dbQuery);
    return;
};

async function findUserDetailsByUserId(userId) {
    const dbQuery = `select "${USER_TABLE}"."${USER_ID}", "${FIRST_NAME}", "${LAST_NAME}", "${EMAIL}", "${PHONE_NUMBER}"
    from ${dbSchema}.${USER_TABLE}, ${dbSchema}.${USER_LOGIN_TABLE} 
    where ${USER_TABLE}.${USER_ID} = ${USER_LOGIN_TABLE}.${USER_ID} 
    and  ${USER_TABLE}.${USER_ID} = '${userId}'`;

    // find user
    let { rows } = await query(dbQuery);
    return rows;
};

module.exports = {
    registerUser,
    socialLogin,
    getUserById,
    getUserByEmail,
    updateUser,
    findUserDetailsByUserId
}