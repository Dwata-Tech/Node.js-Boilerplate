const { query } = require("./connect");
const { dbSchema, RESPONSE_TABLE, USER_ID, COURSE_ID, UNDERSTANDING, ID, SRTIKE_WORD } = require("./dbConstants");

async function getResponseByCourseAndUser(courseId, userId) {
    let dbQuery = `Select * from ${dbSchema}.${RESPONSE_TABLE} where "${COURSE_ID}"='${courseId}' and "${USER_ID}"='${userId}'`;
    let { rows } = await query(dbQuery);
    return rows;
};

async function updateUnderstandingRecord(understanding, userId, courseId) {
    let updateRecord = `update ${dbSchema}.${RESPONSE_TABLE} set "${UNDERSTANDING}"='${understanding}' where "${USER_ID}"= '${userId}' and "${COURSE_ID}"='${courseId}'`;
    await query(updateRecord);
    return;
};

async function createUnderstandingResponse(responseId, understanding, courseId, userId) {
    let insertSessionRecord = `insert into
                "${dbSchema}"."${RESPONSE_TABLE}"
                ("${ID}", "${UNDERSTANDING}", "${COURSE_ID}","${USER_ID}") values
                ('${responseId}', '${understanding}', '${courseId}', '${userId}');`;

    await query(insertSessionRecord);
    return;
};

async function getStrikeWord(courseId) {
    let questionsdbQuery = `Select  "${RESPONSE_TABLE}"."${SRTIKE_WORD}" from ${dbSchema}.${RESPONSE_TABLE} where "${COURSE_ID}"='${courseId}'`;
    let { rows } = await query(questionsdbQuery);
    return rows;
};

async function getResponseByCourseId(courseId) {
    let questionsdbQuery = `Select user_id as "userId" , strike_word as "strikeWord", understanding from ${dbSchema}.${RESPONSE_TABLE} where "${COURSE_ID}"='${courseId}'`;
    let { rows } = await query(questionsdbQuery);
    return rows;
};

module.exports = {
    getResponseByCourseAndUser,
    updateUnderstandingRecord,
    createUnderstandingResponse,
    getStrikeWord,
    getResponseByCourseId
}