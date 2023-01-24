// Db Schema
const dbSchema = "learn_space";

// Db tables
const USER_TABLE = "users";
const USER_LOGIN_TABLE = "user_login";
const WATCH_HISTORY = "watch_history";
const OTP_HISTORY = "OTP_history";
const SESSION_TABLE = "sessions";
const VIDEO_TABLE = "videos";
const SUBSCRIPTION_TABLE = "subscriptions";
const COURSE_TABLE = "courses";
const ENROLLMENT_TABLE = "enrolments";
const RESPONSE_TABLE = "responses";
const DISCUSSIONS_TABLE = "discussions";
const QUESTIONS_TABLE = "questions";
const GROUP_RESPONSE_TABLE = "group_response";
const GROUP_TABLE = "groups";
const ANSWER_TABLE = "answers";


// Table fields
const EMAIL = "email";
const USER_ID = "user_id";
const SUBSCRIPTION_ID = "subscription_id";
const LAST_LOGIN_TIME = "last_login_Time";
const PASSWORD = "password";
const IS_BLOCKED = "is_blocked";
const LOGIN_TYPE = "login_type";
const FIRST_NAME = "first_name";
const LAST_NAME = "last_name";
const IS_DELETED = "is_deleted";
const IS_EMAIL_VERIFIED = "is_email_verified";
const IS_PHONE_VERIFIED = "is_phone_Verified";
const PHONE_NUMBER = "phone_number";
const CREATED_AT = "created_at";
const UPDATED_AT = "updated_at";
const ID = "id";
const DEVICE_ID = "device_id";
const VIDEO_ID = "video_id";
const OTP = "otp";
const TYPE = "type";
const RECEPIENT = "recepient";
const EXPIRY = "expiry";
const OTP_ATTEMPTS = "OTP_attempts";
const SESSION_ID = "session_id";
const VERIFY_EMAIL = "VERIFY_EMAIL";
const VERIFY_PHONE = "VERIFY_PHONE";
const CATEGORY = "category";
const DESCRIPTION = "description";
const TITLE = "title";
const URL = "URL";
const IS_VALID = "is_valid"
const NAME = "name"
const COURSE_ID = "course_id"
const IS_STUDENT_PRESENT = "is_student_present"
const UNDERSTANDING = "understanding"
const QUESTION_BY = "question_by";
const QUESTION_AT = "question_at";
const ANSWER_AT = "answer_at";
const ANSWER_BY = "answer_by";
const QUESTION_ID = "questionid"
const ANSWER = "answer"
const QUESTION = "question"
const GROUP_ID = "group_id"
const USERS = "users"
const SRTIKE_WORD ="strike_word";


// Categories
const SPIRITUALBODY = "SpiritualBody";
const PHYSICALBODY = "PhysicalBody";
const MENTALBODY = "MentalBody";
const EMOTIONALBODY = "EmotionalBody";
const MEDITATION = "Meditation";
const CHAKRATIME = "ChakraTime";
const TIMETRAVEL = "TimeTravel";
const EARTHANGELSEASON02 = "EarthAngelSeason02";

module.exports = {
  USER_TABLE,
  USER_LOGIN_TABLE,
  WATCH_HISTORY,
  OTP_HISTORY,
  SESSION_TABLE,
  VIDEO_TABLE,
  SUBSCRIPTION_TABLE,
  COURSE_TABLE,
  ENROLLMENT_TABLE,
  RESPONSE_TABLE,
  DISCUSSIONS_TABLE,
  GROUP_RESPONSE_TABLE,
  GROUP_TABLE,
  QUESTIONS_TABLE,
  ANSWER_TABLE,
  EMAIL,
  USER_ID,
  LAST_LOGIN_TIME,
  PASSWORD,
  IS_BLOCKED,
  LOGIN_TYPE,
  FIRST_NAME,
  LAST_NAME,
  IS_DELETED,
  IS_EMAIL_VERIFIED,
  IS_PHONE_VERIFIED,
  PHONE_NUMBER,
  CREATED_AT,
  UPDATED_AT,
  ID,
  DEVICE_ID,
  VIDEO_ID,
  OTP,
  TYPE,
  RECEPIENT,
  EXPIRY,
  OTP_ATTEMPTS,
  dbSchema,
  SESSION_ID,
  VERIFY_EMAIL,
  VERIFY_PHONE,
  IS_VALID,
  CATEGORY,
  DESCRIPTION,
  TITLE,
  URL,
  SPIRITUALBODY,
  PHYSICALBODY,
  MENTALBODY,
  EMOTIONALBODY,
  MEDITATION,
  CHAKRATIME,
  TIMETRAVEL,
  EARTHANGELSEASON02,
  SUBSCRIPTION_ID,
  NAME,
  COURSE_ID,
  IS_STUDENT_PRESENT,
  UNDERSTANDING,
  QUESTION,
  QUESTION_BY,
  QUESTION_AT,
  ANSWER,
  ANSWER_AT,
  ANSWER_BY,
  QUESTION_ID,
  GROUP_ID,
  USERS,
  SRTIKE_WORD
};
