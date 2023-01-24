const { query } = require("./connect");
const { dbSchema, GROUP_RESPONSE_TABLE, ID, COURSE_ID, GROUP_ID, QUESTION_ID, ANSWER } = require("./dbConstants");

async function getResponseByGroupIdAndCourseId(courseId, groupId, questionId) {
    let findDataQuery = `Select * from ${dbSchema}.${GROUP_RESPONSE_TABLE} where "${COURSE_ID}"='${courseId}' and "${GROUP_ID}"='${groupId}' and "${QUESTION_ID}"='${questionId}'`;
    let { rows } = await query(findDataQuery)
    return rows;
};

async function updateAnswerOfGroupResponse(answer, courseId, groupId, questionId) {
    let updateRecord = `update ${dbSchema}.${GROUP_RESPONSE_TABLE} set "${ANSWER}"='${answer}' where "${COURSE_ID}"='${courseId}' and "${GROUP_ID}"='${groupId}' and "${QUESTION_ID}"='${questionId}'`;
    await query(updateRecord);
    return;
};

async function addAnswerGroupResponse(groId, answer, questionId, courseId, groupId) {
    let addRecord = `Insert into "${dbSchema}"."${GROUP_RESPONSE_TABLE}"
                ("${ID}","${ANSWER}","${QUESTION_ID}","${COURSE_ID}","${GROUP_ID}") values
                ('${groId}','${answer}','${questionId}','${courseId}','${groupId}');`;

    await query(addRecord);
    return;
};

async function getGroupResponseList() {
    let dbQuery = `Select group_id as "groupId", questionid as "questionId", answer from ${dbSchema}.${GROUP_RESPONSE_TABLE}`;

    let { rows } = await query(dbQuery);
    return rows;
};

async function getGroupResponseListByCourseId(courseId) {
    let dbQuery = `Select group_id as "groupId", answer from ${dbSchema}.${GROUP_RESPONSE_TABLE} where "${COURSE_ID}"='${courseId}'`;
    let { rows } = await query(dbQuery);
    return rows;
};

module.exports = {
    getResponseByGroupIdAndCourseId,
    updateAnswerOfGroupResponse,
    addAnswerGroupResponse,
    getGroupResponseList,
    getGroupResponseListByCourseId
}