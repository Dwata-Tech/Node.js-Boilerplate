const { query } = require("./connect");
const { dbSchema, DISCUSSIONS_TABLE, ID, QUESTION, QUESTION_BY, COURSE_ID, ANSWER, ANSWER_BY } = require("./dbConstants");

async function addDiscussionData(id, question, userId, courseId) {
    let addDiscussionQuery = `insert into 
        "${dbSchema}"."${DISCUSSIONS_TABLE}"
        ("${ID}", "${QUESTION}", "${QUESTION_BY}", "${COURSE_ID}") values 
        ('${id}', '${question}', '${userId}','${courseId}');`;

    await query(addDiscussionQuery);
    return;
};

async function getDiscussionByCourseId(courseId) {
    let dbQuery = `Select * from ${dbSchema}.${DISCUSSIONS_TABLE} where "${COURSE_ID}"='${courseId}'`;
    let { rows } = await query(dbQuery);
    return rows;
};

async function updateDiscussionByCourseIdAndUserId(answer, userId, id, courseId) {
    let updateRecordDbQuery = `update ${dbSchema}.${DISCUSSIONS_TABLE} set  "${ANSWER}"='${answer}', "${ANSWER_BY}"='${userId}'  where "${ID}"='${id}' and "${COURSE_ID}" = '${courseId}'`;

    await query(updateRecordDbQuery);
    return;
};

module.exports = {
    addDiscussionData,
    getDiscussionByCourseId,
    updateDiscussionByCourseIdAndUserId
}