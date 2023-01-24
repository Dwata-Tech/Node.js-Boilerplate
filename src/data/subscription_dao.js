const { query } = require("./connect");
const { dbSchema, SUBSCRIPTION_TABLE, USER_ID, SUBSCRIPTION_ID } = require("./dbConstants");

async function createSubscriptionData(userId, id) {
    let dbQuery = `insert into ${dbSchema}.${SUBSCRIPTION_TABLE} ("${USER_ID}", "${SUBSCRIPTION_ID}") values ('${userId}', '${id}')`

    await query(dbQuery)
    return;
};

module.exports = {
    createSubscriptionData,
}