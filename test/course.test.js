
let httpMocks = require("node-mocks-http");
const courseData = require("../src/data/course_dao");
const enrolmentData = require("../src/data/enrolment_dao");
const responseData = require("../src/data/response_dao");
const questionData = require("../src/data/question_dao");
const answerData = require("../src/data/answer_dao");
const groupData = require("../src/data/group_dao");
const groupResponseData = require("../src/data/group_response_dao");
const courseController = require("../src/controllers/course.controller");

jest.mock("../src/data/course_dao");
jest.mock("../src/data/enrolment_dao");
jest.mock("../src/data/response_dao");
jest.mock("../src/data/question_dao");
jest.mock("../src/data/answer_dao");
jest.mock("../src/data/group_dao");
jest.mock("../src/data/group_response_dao");

describe("course service", () => {

    /**
    * Test the GET course list
    */
    describe("course list", () => {
        const mockedCourseData = jest.mocked(courseData);

        afterEach(() => {
            mockedCourseData.getCourseList.mockReset();
        });
        test("course list success", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
            });
            const courseDetails = [{
                "id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "name": "course1",
                "description": "shdjjdsj jdhsds hdsi dsihdsbjdsbj"
            },
            {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff98977",
                "name": "course2",
                "description": "njen shdjjdsj jdhsds hdsi dsihdsbjdsbj"
            }]
            const data = {
                data: {
                    courses: courseDetails
                },
            };
            mockedCourseData.getCourseList.mockResolvedValue(courseDetails);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.courseListController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual(data)
        });

        test("course list when courses not in database", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
            });
            mockedCourseData.getCourseList.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.courseListController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                data: {},
            })
        });

        test("course list when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.courseListController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });
    })


    /**
    * Test the student enroll course
    */
    describe("student enroll course", () => {
        const mockedCourseData = jest.mocked(courseData);
        const mockedEnrolmentData = jest.mocked(enrolmentData);

        afterEach(() => {
            mockedCourseData.getCourseByCourseId.mockReset();
            mockedEnrolmentData.updateAttendance.mockReset();
        });
        test("course list success", async () => {
            let request = httpMocks.createRequest({
                method: "PUT",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                query: { present: true },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            const courseDetails = {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "name": "course1",
                "description": "shdjjdsj jdhsds hdsi dsihdsbjdsbj",
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11"
            }
            mockedCourseData.getCourseByCourseId.mockResolvedValue([courseDetails]);
            mockedEnrolmentData.updateAttendance.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.studentEnrollCourse(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("student enroll course when course not found", async () => {
            let request = httpMocks.createRequest({
                method: "PUT",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                query: { present: true },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            mockedCourseData.getCourseByCourseId.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.studentEnrollCourse(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "course not found"
            })
        });

        test("student enroll course when courseId not pass in params", async () => {
            let request = httpMocks.createRequest({
                method: "PUT",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: {},
                query: { present: true },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.studentEnrollCourse(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("student enroll course when present not pass in query", async () => {
            let request = httpMocks.createRequest({
                method: "PUT",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.studentEnrollCourse(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("student enroll course when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "PUT",
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                query: { present: true },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.studentEnrollCourse(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });
    })


    /**
    * Test the student understanding course
    */
    describe("student understanding course", () => {
        const mockedCourseData = jest.mocked(courseData);
        const mockedResponseData = jest.mocked(responseData);

        afterEach(() => {
            mockedCourseData.getCourseByCourseId.mockReset();
            mockedResponseData.getResponseByCourseAndUser.mockReset();
            mockedResponseData.updateUnderstandingRecord.mockReset();
            mockedResponseData.createUnderstandingResponse.mockReset();
        });
        test("student understanding course success", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                body: { understanding: "This is understanding" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });

            const courseDetails = {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "name": "course1",
                "description": "shdjjdsj jdhsds hdsi dsihdsbjdsbj",
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11"
            }

            const responseDetails = {
                "id": "1bc7f5c0-9ff6-469e-8b1c-bc119c3960cb0",
                "understanding": "This is understanding",
                "strike_word": "shdjjdsj",
                "course_id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "user_id": "996f8dfb-908b-458d-9c0d-aa974ff919a0",
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11"
            }

            mockedCourseData.getCourseByCourseId.mockResolvedValue([courseDetails]);
            mockedResponseData.getResponseByCourseAndUser.mockResolvedValue([responseDetails]);
            mockedResponseData.updateUnderstandingRecord.mockResolvedValue([]);
            // mockedResponseData.createUnderstandingResponse.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.studentUnderstandingCourse(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("student understanding course success", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                body: { understanding: "This is understanding" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });

            const courseDetails = {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "name": "course1",
                "description": "shdjjdsj jdhsds hdsi dsihdsbjdsbj",
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11"
            }

            const responseDetails = {
                "id": "1bc7f5c0-9ff6-469e-8b1c-bc119c3960cb0",
                "understanding": "This is understanding",
                "strike_word": "shdjjdsj",
                "course_id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "user_id": "996f8dfb-908b-458d-9c0d-aa974ff919a0",
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11"
            }

            mockedCourseData.getCourseByCourseId.mockResolvedValue([courseDetails]);
            mockedResponseData.getResponseByCourseAndUser.mockResolvedValue([]);
            // mockedResponseData.updateUnderstandingRecord.mockResolvedValue([]);
            mockedResponseData.createUnderstandingResponse.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.studentUnderstandingCourse(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("student understanding course when course not found", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                body: { understanding: "This is understanding" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            mockedCourseData.getCourseByCourseId.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.studentUnderstandingCourse(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "course not found"
            })
        });

        test("student understanding course when courseId not pass in params", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: {},
                body: { understanding: "This is understanding" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.studentUnderstandingCourse(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("student understanding course when understanding not pass in body", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                body: {},
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.studentUnderstandingCourse(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("student understanding course when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                body: { understanding: "This is understanding" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.studentUnderstandingCourse(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });
    })


    /**
    * Test the question list controller
    */
    describe("question list controller", () => {
        const mockedCourseData = jest.mocked(courseData);
        const mockedQuestionData = jest.mocked(questionData);

        afterEach(() => {
            mockedCourseData.getCourseByCourseId.mockReset();
            mockedQuestionData.getQuestionsByCourseId.mockReset();
        });
        test("question list success", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
            });
            const courseDetails = {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "name": "course1",
                "description": "shdjjdsj jdhsds hdsi dsihdsbjdsbj",
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11"
            }

            const questionDetails = [
                {
                    "id": "996f8dfb-908b-458d-9c0d-aa974df34550",
                    "question": "sample question 1"
                },
                {
                    "id": "996f8dfb-908b-458d-9c0d-aa974afr5678",
                    "question": "sample question 2"
                }
            ]

            mockedCourseData.getCourseByCourseId.mockResolvedValue([courseDetails]);
            mockedQuestionData.getQuestionsByCourseId.mockResolvedValue(questionDetails);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.questionsListController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("question list when course not found", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
            });
            mockedCourseData.getCourseByCourseId.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.questionsListController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                data: {}
            })
        });

        test("question list when courseId not pass in params", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: {},
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.questionsListController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid input",
            })
        });

        test("question list when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                params: {},
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.questionsListController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });
    })


    /**
    * Test the add answer controller
    */
    describe("add answer controller", () => {
        const mockedCourseData = jest.mocked(courseData);
        const mockedAnswerData = jest.mocked(answerData);

        afterEach(() => {
            mockedCourseData.getCourseByCourseId.mockReset();
            mockedAnswerData.getAnswerByCourseAndUserId.mockReset();
            mockedAnswerData.updateAnswerRecord.mockReset();
            mockedAnswerData.addAnswerData.mockReset();
        });

        test("add answer success", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                body: { questionId: "996f8dfb-908b-458d-9c0d-aa974df34550", answer: "live url data" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            const courseDetails = {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "name": "course1",
                "description": "shdjjdsj jdhsds hdsi dsihdsbjdsbj",
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11"
            }

            const questionDetails = {
                "id": "996f8dfb-908b-458d-9c0d-aa974df34550",
                "answer": ["live url data"],
                "questionid": "996f8dfb-908b-458d-9c0d-aa974df34550",
                "course_id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "user_id": "996f8dfb-908b-458d-9c0d-aa974ff919a0"
            }


            mockedCourseData.getCourseByCourseId.mockResolvedValue([courseDetails]);
            mockedAnswerData.getAnswerByCourseAndUserId.mockResolvedValue([questionDetails]);
            mockedAnswerData.updateAnswerRecord.mockResolvedValue();
            // mockedAnswerData.addAnswerData.mockResolvedValue();
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.addAnswerController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("add answer success", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                body: { questionId: "996f8dfb-908b-458d-9c0d-aa974df34550", answer: "live url data" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            const courseDetails = {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "name": "course1",
                "description": "shdjjdsj jdhsds hdsi dsihdsbjdsbj",
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11"
            }

            mockedCourseData.getCourseByCourseId.mockResolvedValue([courseDetails]);
            mockedAnswerData.getAnswerByCourseAndUserId.mockResolvedValue([]);
            // mockedAnswerData.updateAnswerRecord.mockResolvedValue();
            mockedAnswerData.addAnswerData.mockResolvedValue();
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.addAnswerController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("add answer when course not found", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                body: { questionId: "996f8dfb-908b-458d-9c0d-aa974df34550", answer: "live url data" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            mockedCourseData.getCourseByCourseId.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.addAnswerController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "course not found"
            })
        });

        test("add answer when courseId not pass in params", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: {},
                body: { questionId: "996f8dfb-908b-458d-9c0d-aa974df34550", answer: "live url data" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.addAnswerController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid input",
            })
        });

        test("add answer when questionId not pass in body", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                body: { answer: "live url data" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.addAnswerController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid input",
            })
        });

        test("add answer when answer not pass in body", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: {},
                body: { questionId: "996f8dfb-908b-458d-9c0d-aa974df34550" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.addAnswerController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid input",
            })
        });

        test("add answer when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                params: {},
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.addAnswerController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });
    })

    /**
    * Test the update answer of group controller
    */
    describe("update answer of group controller", () => {
        const mockedCourseData = jest.mocked(courseData);
        const mockedGroupData = jest.mocked(groupData);
        const mockedGroupResponseData = jest.mocked(groupResponseData);

        afterEach(() => {
            mockedCourseData.getCourseByCourseId.mockReset();
            mockedGroupData.getGroupByGroupId.mockReset();
            mockedGroupResponseData.getResponseByGroupIdAndCourseId.mockReset();
            mockedGroupResponseData.updateAnswerOfGroupResponse.mockReset();
            mockedGroupResponseData.addAnswerGroupResponse.mockReset();
        });

        test("update answer of group success", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976", groupId: "c7c983a7-71ba-45db-915d-11a57710b931" },
                body: { questionId: "996f8dfb-908b-458d-9c0d-aa974df34550", answer: "live url data" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            const courseDetails = {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "name": "course1",
                "description": "shdjjdsj jdhsds hdsi dsihdsbjdsbj",
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11"
            }

            const groupDetails = {
                "id": "c7c983a7-71ba-45db-915d-11a57710b931",
                "name": "group 1",
                "course_id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "users": ["996f8dfb-908b-458d-9c0d-aa974ff919a0"],
                "created_at": "2022-10-25 16:17:29",
                "updated_at": "2022-10-25 16:17:29"
            }

            const groupResponseDetails = {
                "id": "08f47473-94aa-4112-b512-6220abdaf3ca",
                "answer": "jsdjb",
                "questionid": "996f8dfb-908b-458d-9c0d-aa974df34550",
                "course_id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "group_id": "c7c983a7-71ba-45db-915d-11a57710b931",
                "created_at": "2022-10-25 16:17:29",
                "updated_at": "2022-10-25 16:17:29"
            }

            mockedCourseData.getCourseByCourseId.mockResolvedValue([courseDetails]);
            mockedGroupData.getGroupByGroupId.mockResolvedValue([groupDetails]);
            mockedGroupResponseData.getResponseByGroupIdAndCourseId.mockResolvedValue([groupResponseDetails]);
            mockedGroupResponseData.updateAnswerOfGroupResponse.mockResolvedValue();
            // mockedAnswerData.addAnswerData.mockResolvedValue();
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.updateAnswerOfGroupController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("update answer of group success", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976", groupId: "c7c983a7-71ba-45db-915d-11a57710b931" },
                body: { questionId: "996f8dfb-908b-458d-9c0d-aa974df34550", answer: "live url data" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            const courseDetails = {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "name": "course1",
                "description": "shdjjdsj jdhsds hdsi dsihdsbjdsbj",
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11"
            }

            const groupDetails = {
                "id": "c7c983a7-71ba-45db-915d-11a57710b931",
                "name": "group 1",
                "course_id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "users": ["996f8dfb-908b-458d-9c0d-aa974ff919a0"],
                "created_at": "2022-10-25 16:17:29",
                "updated_at": "2022-10-25 16:17:29"
            }

            mockedCourseData.getCourseByCourseId.mockResolvedValue([courseDetails]);
            mockedGroupData.getGroupByGroupId.mockResolvedValue([groupDetails]);
            mockedGroupResponseData.getResponseByGroupIdAndCourseId.mockResolvedValue([]);
            mockedGroupResponseData.addAnswerGroupResponse.mockResolvedValue();
            // mockedAnswerData.addAnswerData.mockResolvedValue();
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.updateAnswerOfGroupController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("update answer of group when course not found", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976", groupId: "c7c983a7-71ba-45db-915d-11a57710b931" },
                body: { questionId: "996f8dfb-908b-458d-9c0d-aa974df34550", answer: "live url data" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });

            const groupDetails = {
                "id": "c7c983a7-71ba-45db-915d-11a57710b931",
                "name": "group 1",
                "course_id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "users": ["996f8dfb-908b-458d-9c0d-aa974ff919a0"],
                "created_at": "2022-10-25 16:17:29",
                "updated_at": "2022-10-25 16:17:29"
            }

            mockedGroupData.getGroupByGroupId.mockResolvedValue([groupDetails]);
            mockedCourseData.getCourseByCourseId.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.updateAnswerOfGroupController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("update answer of group when group not found", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976", groupId: "c7c983a7-71ba-45db-915d-11a57710b931" },
                body: { questionId: "996f8dfb-908b-458d-9c0d-aa974df34550", answer: "live url data" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });

            const courseDetails = {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "name": "course1",
                "description": "shdjjdsj jdhsds hdsi dsihdsbjdsbj",
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11"
            }

            mockedGroupData.getGroupByGroupId.mockResolvedValue([]);
            mockedCourseData.getCourseByCourseId.mockResolvedValue([courseDetails]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.updateAnswerOfGroupController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "group not found"
            })
        });

        test("update answer of group when courseId and groupId not pass in params", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: {},
                body: { questionId: "996f8dfb-908b-458d-9c0d-aa974df34550", answer: "live url data" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.updateAnswerOfGroupController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid input",
            })
        });

        test("update answer of group when questionId and answer not pass in body", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976", groupId: "c7c983a7-71ba-45db-915d-11a57710b931" },
                body: {},
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.updateAnswerOfGroupController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid input",
            })
        });

        test("update answer of group when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                params: {},
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.updateAnswerOfGroupController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });
    })

    /**
    * Test the create group controller
    */
    describe("create group controller", () => {
        const mockedCourseData = jest.mocked(courseData);
        const mockedEnrolmentData = jest.mocked(enrolmentData);
        const mockedGroupData = jest.mocked(groupData);

        afterEach(() => {
            mockedCourseData.getCourseByCourseId.mockReset();
            mockedEnrolmentData.getEnrolmentDataByPresentStudent.mockReset();
            mockedGroupData.deleteGroupByCourseId.mockReset();
            mockedGroupData.createGroup.mockReset();
            mockedGroupData.getGroupByCourseId.mockReset();
        });

        test("create group success", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                query: { count: 5 },
            });

            const courseDetails = {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "name": "course1",
                "description": "shdjjdsj jdhsds hdsi dsihdsbjdsbj",
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11"
            }

            const enrolmentDetails = {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff34567",
                "user_id": "996f8dfb-908b-458d-9c0d-aa974ff919a0",
                "course_id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "start_date": "2022-09-05",
                "is_student_present": true,
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11",
            }

            const groupDetails = {
                "groupId": "c7c983a7-71ba-45db-915d-11a57710b931",
                "users": ["996f8dfb-908b-458d-9c0d-aa974ff919a0"],
            }

            mockedCourseData.getCourseByCourseId.mockResolvedValue([courseDetails]);
            mockedEnrolmentData.getEnrolmentDataByPresentStudent.mockResolvedValue([enrolmentDetails]);
            mockedGroupData.deleteGroupByCourseId.mockResolvedValue();
            mockedGroupData.createGroup.mockResolvedValue();
            mockedGroupData.getGroupByCourseId.mockResolvedValue([groupDetails]);

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.createGroupController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("create group success if count not pass in params", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                query: {},
            });

            const courseDetails = {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "name": "course1",
                "description": "shdjjdsj jdhsds hdsi dsihdsbjdsbj",
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11"
            }

            const enrolmentDetails = {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff34567",
                "user_id": "996f8dfb-908b-458d-9c0d-aa974ff919a0",
                "course_id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "start_date": "2022-09-05",
                "is_student_present": true,
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11",
            }

            const groupDetails = {
                "groupId": "c7c983a7-71ba-45db-915d-11a57710b931",
                "users": ["996f8dfb-908b-458d-9c0d-aa974ff919a0"],
            }

            mockedCourseData.getCourseByCourseId.mockResolvedValue([courseDetails]);
            mockedEnrolmentData.getEnrolmentDataByPresentStudent.mockResolvedValue([enrolmentDetails]);
            mockedGroupData.deleteGroupByCourseId.mockResolvedValue();
            mockedGroupData.createGroup.mockResolvedValue();
            mockedGroupData.getGroupByCourseId.mockResolvedValue([groupDetails]);

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.createGroupController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("create group success when enrolment data not found", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                query: { count: 5 },
            });

            const courseDetails = {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "name": "course1",
                "description": "shdjjdsj jdhsds hdsi dsihdsbjdsbj",
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11"
            }

            const groupDetails = {
                "groupId": "c7c983a7-71ba-45db-915d-11a57710b931",
                "users": ["996f8dfb-908b-458d-9c0d-aa974ff919a0"],
            }

            mockedCourseData.getCourseByCourseId.mockResolvedValue([courseDetails]);
            mockedEnrolmentData.getEnrolmentDataByPresentStudent.mockResolvedValue([]);
            mockedGroupData.deleteGroupByCourseId.mockResolvedValue();
            mockedGroupData.createGroup.mockResolvedValue();
            mockedGroupData.getGroupByCourseId.mockResolvedValue([groupDetails]);

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.createGroupController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("create group success when course not found", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                query: { count: 5 },
            });
            mockedCourseData.getCourseByCourseId.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.createGroupController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "course not found"
            })
        });

        test("create group when courseId not pass in params", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: {},
                query: { count: 5 },
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.createGroupController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid input",
            })
        });

        test("create group when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                params: {},
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.createGroupController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });
    })

    /**
    * Test the group answer controller
    */
    describe("group answer controller", () => {
        const mockedCourseData = jest.mocked(courseData);
        const mockedGroupResponseData = jest.mocked(groupResponseData);

        afterEach(() => {
            mockedCourseData.getCourseByCourseId.mockReset();
            mockedGroupResponseData.getGroupResponseList.mockReset();
        });

        test("group answer success", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
            });
            const courseDetails = {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "name": "course1",
                "description": "shdjjdsj jdhsds hdsi dsihdsbjdsbj",
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11"
            }

            const groupResponseDetails = {
                "groupId": "996f8dfb-908b-458d-9c0d-aa974df34550",
                "questionId": "996f8dfb-908b-458d-9c0d-aa974df34550",
            }

            mockedCourseData.getCourseByCourseId.mockResolvedValue([courseDetails]);
            mockedGroupResponseData.getGroupResponseList.mockResolvedValue([groupResponseDetails]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.groupAnswerController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("group answer success", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
            });
            const courseDetails = {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "name": "course1",
                "description": "shdjjdsj jdhsds hdsi dsihdsbjdsbj",
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11"
            }

            mockedCourseData.getCourseByCourseId.mockResolvedValue([courseDetails]);
            mockedGroupResponseData.getGroupResponseList.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.groupAnswerController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("group answer when course not found", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
            });
            mockedCourseData.getCourseByCourseId.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.groupAnswerController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "course not found"
            })
        });

        test("group answer when courseId not pass in params", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: {},
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.groupAnswerController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid input",
            })
        });

        test("group answer when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                params: {},
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.groupAnswerController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });
    })

    /**
    * Test the word cloud list controller
    */
    describe("word cloud list controller", () => {
        const mockedCourseData = jest.mocked(courseData);
        const mockedResponseData = jest.mocked(responseData);

        afterEach(() => {
            mockedCourseData.getCourseByCourseId.mockReset();
            mockedResponseData.getStrikeWord.mockReset();
        });

        test("word cloud list success", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            const userId = request.user.user_id;
            const courseDetails = {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "name": "course1",
                "description": "shdjjdsj jdhsds hdsi dsihdsbjdsbj",
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11"
            }

            const responseDetails = {
                "strike_word": "strike word",
            }

            // const data = {
            //     data: {
            //         wordCloud: {
            //             userId,
            //             "word": responseDetails.strike_word
            //         }
            //     }
            // }

            mockedCourseData.getCourseByCourseId.mockResolvedValue([courseDetails]);
            mockedResponseData.getStrikeWord.mockResolvedValue([responseDetails]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.wordCloudListController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("word cloud list when course not found", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });

            mockedCourseData.getCourseByCourseId.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.wordCloudListController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({ data: {} })
        });

        test("word cloud list when courseId not pass in params", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: {},
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.wordCloudListController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid input",
            })
        });

        test("word cloud list when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                params: {},
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.wordCloudListController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });
    })

    /**
    * Test the report list controller
    */
    describe("report list controller", () => {
        const mockedCourseData = jest.mocked(courseData);
        const mockedGroupResponseData = jest.mocked(groupResponseData);
        const mockedAnswerData = jest.mocked(answerData);
        const mockedResponseData = jest.mocked(responseData);

        afterEach(() => {
            mockedCourseData.getCourseByCourseId.mockReset();
            mockedGroupResponseData.getGroupResponseListByCourseId.mockReset();
            mockedResponseData.getResponseByCourseId.mockReset();
            mockedAnswerData.getAnswerByCourseIdAndUserId.mockReset();
        });

        test("report list success", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            const userId = request.user.user_id;
            const courseDetails = {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "name": "course1",
                "description": "shdjjdsj jdhsds hdsi dsihdsbjdsbj",
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11"
            }

            const responseDetails = {
                "userId": "996f8dfb-908b-458d-9c0d-aa974ff919a0",
                "strikeWord": "strike word",
                understanding: "understandin1",
            }

            const groupResponseDetails = {
                "groupId": "996f8dfb-908b-458d-9c0d-aa974df34550",
                "answer": "answer1",
            }

            const answerDetails = {
                "questionId": "996f8dfb-908b-458d-9c0d-aa974df34550",
                "answers": ["answer1"],
            }

            mockedCourseData.getCourseByCourseId.mockResolvedValue([courseDetails]);
            mockedResponseData.getResponseByCourseId.mockResolvedValue([responseDetails]);
            mockedGroupResponseData.getGroupResponseListByCourseId.mockResolvedValue([groupResponseDetails]);
            mockedAnswerData.getAnswerByCourseIdAndUserId.mockResolvedValue([answerDetails]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.reportsListController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("report list when course not found", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });

            mockedCourseData.getCourseByCourseId.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.reportsListController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({ data: {} })
        });

        test("report list when courseId not pass in params", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: {},
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.reportsListController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid input",
            })
        });

        test("report list when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                params: {},
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await courseController.reportsListController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });
    })

});
