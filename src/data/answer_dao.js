const { query } = require("./connect");
const { dbSchema, ANSWER_TABLE, USER_ID, COURSE_ID, QUESTION_ID, ANSWER, ID } = require("./dbConstants");

async function getAnswerByCourseAndUserId(courseId, questionId, userId) {
    let dbQuery = `Select * from ${dbSchema}.${ANSWER_TABLE} where "${COURSE_ID}"='${courseId}' and "${QUESTION_ID}"='${questionId}' and "${USER_ID}"='${userId}'`;
    let { rows } = await query(dbQuery);
    return rows;
};

async function updateAnswerRecord(answerArray, courseId, questionId, userId) {
    let updateRecord = `update ${dbSchema}.${ANSWER_TABLE} set "${ANSWER}"='{${answerArray}}' where "${COURSE_ID}"='${courseId}' and "${QUESTION_ID}"='${questionId}' and "${USER_ID}"='${userId}'`;
    await query(updateRecord);
    return;
};

async function addAnswerData(queId, questionId, answer, courseId, userId) {
    let insertAnswerRecord = `insert into
                "${dbSchema}"."${ANSWER_TABLE}"
                ("${ID}",${QUESTION_ID}, "${ANSWER}", "${COURSE_ID}","${USER_ID}") values
                ('${queId}','${questionId}', '{${answer}}', '${courseId}', '${userId}');`;
    await query(insertAnswerRecord);
    return;
};

async function getAnswerByCourseIdAndUserId(userId, courseId) {
    let dbQuery = `Select questionid as "questionId", answer as "answers" from ${dbSchema}.${ANSWER_TABLE} where "${USER_ID}"='${userId}' and "${COURSE_ID}"='${courseId}'`;
    let { rows } = await query(dbQuery);
    return rows;
};

module.exports = {
    getAnswerByCourseAndUserId,
    updateAnswerRecord,
    addAnswerData,
    getAnswerByCourseIdAndUserId
}