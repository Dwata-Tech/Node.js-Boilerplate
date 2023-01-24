const { query } = require("./connect");
const {
  dbSchema,
  GROUP_TABLE,
  ID,
  NAME,
  COURSE_ID,
  USERS,
} = require("./dbConstants");

async function getGroupByGroupId(groupId) {
  let dbQuery = `Select * from ${dbSchema}.${GROUP_TABLE} where "${ID}"='${groupId}'`;
  let { rows } = await query(dbQuery);
  return rows;
}

async function deleteGroupByCourseId(courseId) {
  let deleteRecord = `Delete from ${dbSchema}.${GROUP_TABLE} where "${COURSE_ID}"='${courseId}'`;
  await query(deleteRecord);
  return;
}

async function createGroup(groId, groupName, courseId, users) {
  let createGroupRecord = `insert into
                            "${dbSchema}"."${GROUP_TABLE}"
                            ("${ID}",${NAME}, "${COURSE_ID}", "${USERS}") values
                            ('${groId}','${groupName}','${courseId}', '{${users}}');`;
  await query(createGroupRecord);
  return;
}

async function getGroupByCourseId(courseId) {
  let dbQuery = `Select id as "groupId", users from ${dbSchema}.${GROUP_TABLE} where "${COURSE_ID}"='${courseId}'`;
  let { rows } = await query(dbQuery);
  return rows;
}

module.exports = {
  getGroupByGroupId,
  deleteGroupByCourseId,
  createGroup,
  getGroupByCourseId,
};
