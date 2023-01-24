const { query } = require("./connect");
const { dbSchema, COURSE_TABLE, ID } = require("./dbConstants");

async function getCourseList() {
    let dbQuery = `Select id, name, description from ${dbSchema}.${COURSE_TABLE}`;

    let { rows } = await query(dbQuery);
    return rows;
};

async function getCourseByCourseId(courseId) {
    let dbQuery = `Select * from ${dbSchema}.${COURSE_TABLE} where "${ID}"='${courseId}'`;

    let { rows } = await query(dbQuery);
    return rows;
};

module.exports = {
    getCourseList,
    getCourseByCourseId
}