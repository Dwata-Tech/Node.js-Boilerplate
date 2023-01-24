-- SCHEMA: sprit_traveller

DROP SCHEMA IF EXISTS learn_space CASCADE ;
CREATE SCHEMA IF NOT EXISTS learn_space
    AUTHORIZATION postgres;

--
-- Users table
--

CREATE TABLE learn_space.users 
(
	user_id TEXT primary key not null,
	first_name TEXT not null,
	last_name TEXT not null,
	phone_number TEXT ,
	is_deleted boolean DEFAULT false,
	is_email_verified boolean DEFAULT false,
	is_phone_verified boolean DEFAULT false,
	created_at  TIMESTAMP(0) default now(),
	updated_at  TIMESTAMP(0) default now()
);


--
-- User Login Table
--
CREATE TABLE learn_space.user_login
(
	user_id TEXT not null,
	email TEXT not null unique,
	password TEXT,
	last_login_time TIMESTAMP(0) default now(),
	is_blocked boolean DEFAULT false
);

-- ---
-- -- Watch history Table
-- --

-- CREATE TABLE learn_space.watch_history 
-- (
-- 	id serial primary key,
-- 	user_id TEXT,
-- 	device_id TEXT not null,
-- 	video_id TEXT not null,
-- created_at TIMESTAMP(0) default now(),
-- 	updated_at TIMESTAMP(0) default now()
-- );

--
-- OTP History table
--

create table learn_space.OTP_history
(
	id serial primary key,
	user_id TEXT not null,
	OTP TEXT not null,
	type TEXT not null,
	recepient TEXT not null,
	expiry TIMESTAMP(0) not null,
	OTP_attempts integer default 3,
	is_deleted boolean DEFAULT false,
	created_at TIMESTAMP(0) default now(),
	updated_at TIMESTAMP(0) default now()
);

--
-- Session table
--

create table learn_space.sessions 
(
	session_id TEXT primary key not null,
	user_id TEXT not null,
	expiry TIMESTAMP(0) not null,
	is_valid  BOOLEAN default true,
	login_type TEXT default 'EMAIL-PASSWORD',
	created_at TIMESTAMP(0) default now(),
	updated_at TIMESTAMP(0) default now()
);

--
-- Plans table
--

create table learn_space.plans 
(
	id serial primary key not null,
	plan_name TEXT not null,
	source TEXT not null,
	created_at TIMESTAMP(0) default now(),
	updated_at TIMESTAMP(0) default now()
);

--
-- Subscription table
--

create table learn_space.subscriptions 
(
	id serial primary key not null,
	user_id TEXT not null,
	subscription_id TEXT not null,
	created_at TIMESTAMP(0) default now(),
	updated_at TIMESTAMP(0) default now()
);


-- --
-- -- Vidoe table
-- --

-- create table learn_space.videos 
-- (
-- 	id serial primary key not null,
-- 	url TEXT not null,
-- 	title TEXT not null,
-- 	category TEXT not null,
-- 	description TEXT not null,
-- 	created_at TIMESTAMP(0) default now(),
-- 	updated_at TIMESTAMP(0) default now()
-- );

--
-- Course table
--

CREATE TABLE learn_space.courses 
(
	id TEXT primary key not null,
	name TEXT not null,
	description TEXT not null,
	created_at TIMESTAMP(0) default now(),
	updated_at TIMESTAMP(0) default now()
);

--
-- Enrolment table
--

CREATE TABLE learn_space.enrolments 
(
	id TEXT primary key not null,
	user_id TEXT not null,
	course_id TEXT not null,
	start_date DATE,
	is_student_present BOOLEAN default false,
	created_at TIMESTAMP(0) default now(),
	updated_at TIMESTAMP(0) default now()
);

--
-- Group table
--

CREATE TABLE learn_space.groups 
(
	id TEXT primary key not null,
	name TEXT not null,
	course_id TEXT not null,
	users TEXT[],
	created_at TIMESTAMP(0) default now(),
	updated_at TIMESTAMP(0) default now()
);

--
-- Question table
--

CREATE TABLE learn_space.questions 
(
	id TEXT primary key not null,
	question TEXT not null,
	course_id TEXT not null
);

--
-- Response table
--

CREATE TABLE learn_space.responses 
(
	id TEXT primary key not null,
	understanding TEXT not null,
	strike_word TEXT,
	course_id TEXT not null,
	user_id TEXT not null,
	created_at TIMESTAMP(0) default now(),
	updated_at TIMESTAMP(0) default now()
);

--
-- Group Response table
--

CREATE TABLE learn_space.group_response 
(
	id TEXT primary key not null,
	answer TEXT not null,
	questionid TEXT,
	course_id TEXT not null,
	group_id TEXT not null,
	created_at TIMESTAMP(0) default now(),
	updated_at TIMESTAMP(0) default now()
);

--
-- Discussion table
--

create table learn_space.discussions 
(
	id TEXT primary key not null,
	question TEXT,
	question_by TEXT,
	question_at TIMESTAMP(0) default now(),
	answer TEXT,
	answer_by TEXT,
	answer_at TIMESTAMP(0) default now(),
	course_id TEXT
);

--
--Answers table
--
create table learn_space.answers 
(
	id TEXT primary key not null,
	answer TEXT[],
	questionid TEXT,
	course_id TEXT not null,
	user_id TEXT not null
);

--
-- Seeding the data
--

insert into learn_space.users ("user_id", "first_name", "last_name", "phone_number") values ('996f8dfb-908b-458d-9c0d-aa974ff919a0', 'John', 'Doe', '123456789');
insert into learn_space.user_login ("user_id",  "email", "password") values ('996f8dfb-908b-458d-9c0d-aa974ff919a0', 'John@John.com', '12343');

insert into learn_space.users ("user_id", "first_name", "last_name", "phone_number") values ('996f8dfb-458d-458d-9c0d-aa974ff919a1', 'Jonathan', 'Trot', '123456789');
insert into learn_space.user_login ("user_id",  "email", "password") values ('996f8dfb-458d-458d-9c0d-aa974ff919a1', 'Jonathan@John.com', '12343');

insert into learn_space.users ("user_id", "first_name", "last_name" , "phone_number") values ('996f8dfb-908b-aa974ff919a0-9c0d-aa974ff919a0', 'Joe', 'Root', '123456789');
insert into learn_space.user_login ("user_id",  "email", "password") values ('996f8dfb-908b-aa974ff919a0-9c0d-aa974ff919a0', 'JoeRoot@John.com', '12343');

insert into learn_space.courses ("id", "name", "description") values ('996f8dfb-908b-458d-9c0d-aa974ff98976', 'course1', 'shdjjdsj jdhsds hdsi dsihdsbjdsbj');
insert into learn_space.courses ("id", "name", "description") values ('996f8dfb-908b-458d-9c0d-aa974ff98977', 'course2', 'njen shdjjdsj jdhsds hdsi dsihdsbjdsbj');

insert into learn_space.enrolments ("id", "user_id", "course_id", "start_date") values ('996f8dfb-908b-458d-9c0d-aa974ff34567', '996f8dfb-908b-458d-9c0d-aa974ff919a0', '996f8dfb-908b-458d-9c0d-aa974ff98976','2022-09-05 10:23:56');
insert into learn_space.enrolments ("id", "user_id", "course_id", "start_date") values ('996f8dfb-908b-458d-9c0d-aa974ff34568', '996f8dfb-908b-458d-9c0d-aa974ff919a1', '996f8dfb-908b-458d-9c0d-aa974ff98977','2022-09-05 10:23:56');

insert into learn_space.questions ("id","course_id", "question") values ('996f8dfb-908b-458d-9c0d-aa974df34550', '996f8dfb-908b-458d-9c0d-aa974ff98976','sample question 1');
insert into learn_space.questions ("id","course_id", "question") values ('996f8dfb-908b-458d-9c0d-aa974afr5678', '996f8dfb-908b-458d-9c0d-aa974ff98976','sample question 2');

insert into learn_space.responses ("id","course_id","understanding","user_id") values ('996f8dfb-908b-458d-9c0d-aa974gf34567', '996f8dfb-908b-458d-9c0d-aa974ff98976','sample understanding','996f8dfb-908b-458d-9c0d-aa974ff919a0');
insert into learn_space.responses ("id","course_id","understanding","user_id","strike_word") values ('567841', '996f8dfb-908b-458d-9c0d-aa974ff98977','sample understanding','996f8dfb-908b-458d-9c0d-aa974ff919a0', 'sample stike word 2');

insert into learn_space.group_response ("id","course_id","questionid","group_id","answer") values ('567848', '996f8dfb-908b-458d-9c0d-aa974ff98977','88888888888','7777777777','group answer');