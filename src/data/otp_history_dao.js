const { query } = require("./connect");
const { dbSchema, OTP_HISTORY, USER_ID, TYPE, OTP, IS_DELETED, RECEPIENT, EXPIRY } = require("./dbConstants");

async function generateOtp(userId, generatedOTP, type, recepient, OTPExpiry) {
    let dbQuery = `insert into ${dbSchema}.${OTP_HISTORY}  ( "${USER_ID}", "${OTP}", "${TYPE}", "${RECEPIENT}", "${EXPIRY}") 
      values ( '${userId}', '${generatedOTP}', '${type}', '${recepient}', '${OTPExpiry}')`;

    await query(dbQuery);
    return;
};

async function getOtpData(userId, type, incomingOTP) {
    let dbQuery = `select * from ${dbSchema}.${OTP_HISTORY}  where "${USER_ID}"='${userId}' and "${TYPE}"='${type}' and "${OTP}"='${incomingOTP}' and "${IS_DELETED}"= false`;

    let { rows } = await query(dbQuery);
    return rows;
};

async function updateOtpRecord(userId, type, incomingOTP) {
    let updateRecordDbQuery = `update ${dbSchema}.${OTP_HISTORY} set  "${IS_DELETED}"= true  where "${USER_ID}"='${userId}' and "${TYPE}"='${type}' and "${OTP}"='${incomingOTP}' and "${IS_DELETED}"= false`;

    await query(updateRecordDbQuery);
    return;
};

async function invalidateOtpOfSameType(userId, type) {
    let updateRecordDbQuery = `update ${dbSchema}.${OTP_HISTORY} set  "${IS_DELETED}"=true  where "${USER_ID}"='${userId}' and "${TYPE}"='${type}' and "${IS_DELETED}"= false`;

    await query(updateRecordDbQuery);
    return;
};

async function getOtpDataForChangePassword(otp, email) {
    const dbQuery = `select "${RECEPIENT}", "${USER_ID}", "${OTP}","${EXPIRY}" from ${dbSchema}.${OTP_HISTORY} where "${OTP}" = '${otp}' and "${RECEPIENT}"='${email}' and "${TYPE}"='FORGOT_PASSWORD' and "${IS_DELETED}"= false`
    let { rows } = await query(dbQuery);
    return rows;
};

module.exports = {
    getOtpData,
    updateOtpRecord,
    invalidateOtpOfSameType,
    generateOtp,
    getOtpDataForChangePassword
}