const { query } = require("./connect");
const { dbSchema, QUESTIONS_TABLE, ID, QUESTION, COURSE_ID } = require("./dbConstants");

async function getQuestionsByCourseId(courseId) {
    let dbQuery = `Select  "${QUESTIONS_TABLE}"."${ID}", "${QUESTION}" from ${dbSchema}.${QUESTIONS_TABLE} where "${COURSE_ID}"='${courseId}'`;
    let { rows } = await query(dbQuery);
    return rows;
};

module.exports = {
    getQuestionsByCourseId
}