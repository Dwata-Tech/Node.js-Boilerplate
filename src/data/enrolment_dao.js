const { query } = require("./connect");
const { dbSchema, ENROLLMENT_TABLE, IS_STUDENT_PRESENT, USER_ID, COURSE_ID } = require("./dbConstants");

async function updateAttendance(present, userId, courseId) {
    let updateRecord = `update ${dbSchema}.${ENROLLMENT_TABLE} set "${IS_STUDENT_PRESENT}"='${present}' where "${USER_ID}"= '${userId}' and "${COURSE_ID}"='${courseId}'`;
    await query(updateRecord);
    return;
};

async function getEnrolmentDataByPresentStudent(courseId) {
    let findDataQuery = `Select * from ${dbSchema}.${ENROLLMENT_TABLE} where "${IS_STUDENT_PRESENT}"=true and "${COURSE_ID}"='${courseId}'`;
    let { rows } = await query(findDataQuery)
    return rows;
};

module.exports = {
    updateAttendance,
    getEnrolmentDataByPresentStudent
}