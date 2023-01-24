let httpMocks = require("node-mocks-http");
const courseData = require("../src/data/course_dao");
const discussionData = require("../src/data/discussion_dao");
const userData = require("../src/data/user_dao");
const discussionController = require("../src/controllers/discussion.controller");

jest.mock("../src/data/course_dao");
jest.mock("../src/data/discussion_dao");
jest.mock("../src/data/user_dao");

describe("Discussion details", () => {

    /**
    * Test add discussion controller
    */
    describe("add discussion controller", () => {
        const mockedCourseData = jest.mocked(courseData);
        const mockedDiscussionData = jest.mocked(discussionData);

        afterEach(() => {
            mockedCourseData.getCourseByCourseId.mockReset();
            mockedDiscussionData.addDiscussionData.mockReset();
        });
        test("add discussion success", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                body: { question: "question test" },
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
            mockedDiscussionData.addDiscussionData.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await discussionController.addDiscussionController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("add discussion when course not found", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                body: { question: "question test" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            mockedCourseData.getCourseByCourseId.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await discussionController.addDiscussionController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "course not found"
            })
        });

        test("add discussion when courseId not pass in params", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: {},
                body: { question: "question test" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await discussionController.addDiscussionController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data"
            })
        });

        test("add discussion when question not pass in body", async () => {
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

            await discussionController.addDiscussionController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data"
            })
        });

        test("add discussion when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await discussionController.addDiscussionController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });
    })


    /**
    * Test get discussion controller
    */
    describe("get discussion controller", () => {
        const mockedCourseData = jest.mocked(courseData);
        const mockedDiscussionData = jest.mocked(discussionData);
        const mockedUserData = jest.mocked(userData);

        afterEach(() => {
            mockedCourseData.getCourseByCourseId.mockReset();
            mockedDiscussionData.getDiscussionByCourseId.mockReset();
            mockedUserData.getUserById.mockReset();
        });

        test("get discussion success", async () => {
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

            const discussionDetails = {
                "id": "03dc3471-21b3-4282-89b2-135ec901b4db",
                "question": "course1",
                "question_by": "996f8dfb-908b-458d-9c0d-aa974ff919a0",
                "question_at": "2022-09-30 12:49:11",
                "answer": "",
                "answer_by": "",
                "answer_at": "2022-09-30 12:49:11",
                "course_id": "996f8dfb-908b-458d-9c0d-aa974ff98976"
            }

            mockedCourseData.getCourseByCourseId.mockResolvedValue([courseDetails]);
            mockedDiscussionData.getDiscussionByCourseId.mockResolvedValue([discussionDetails]);
            mockedUserData.getUserById.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await discussionController.getDiscussionItemsController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("get discussion when discussion item not found", async () => {
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
            mockedDiscussionData.getDiscussionByCourseId.mockResolvedValue([]);
            mockedUserData.getUserById.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await discussionController.getDiscussionItemsController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("get discussion when course not found", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
            });

            mockedCourseData.getCourseByCourseId.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await discussionController.getDiscussionItemsController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "course not found"
            })
        });

        test("get discussion when courseId not pass in params", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: {},
            });

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await discussionController.getDiscussionItemsController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data"
            })
        });

        test("get discussion when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await discussionController.getDiscussionItemsController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });
    })


    /**
    * Test update discussion controller
    */
    describe("update discussion controller", () => {
        const mockedCourseData = jest.mocked(courseData);
        const mockedDiscussionData = jest.mocked(discussionData);

        afterEach(() => {
            mockedCourseData.getCourseByCourseId.mockReset();
            mockedDiscussionData.updateDiscussionByCourseIdAndUserId.mockReset();
        });

        test("update discussion success", async () => {
            let request = httpMocks.createRequest({
                method: "PUT",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                body: { id: "03dc3471-21b3-4282-89b2-135ec901b4db", answer: "test answer" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" },
            });

            const courseDetails = {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff98976",
                "name": "course1",
                "description": "shdjjdsj jdhsds hdsi dsihdsbjdsbj",
                "created_at": "2022-09-30 12:49:11",
                "updated_at": "2022-09-30 12:49:11"
            }

            mockedCourseData.getCourseByCourseId.mockResolvedValue([courseDetails]);
            mockedDiscussionData.updateDiscussionByCourseIdAndUserId.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await discussionController.updateDiscussionItemsController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("update discussion when course not found", async () => {
            let request = httpMocks.createRequest({
                method: "PUT",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                body: { id: "03dc3471-21b3-4282-89b2-135ec901b4db", answer: "test answer" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" },
            });

            mockedCourseData.getCourseByCourseId.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await discussionController.updateDiscussionItemsController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "course not found"
            })
        });

        test("update discussion when courseId not pass in params", async () => {
            let request = httpMocks.createRequest({
                method: "PUT",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: {},
                body: { id: "03dc3471-21b3-4282-89b2-135ec901b4db", answer: "test answer" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" },
            });

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await discussionController.updateDiscussionItemsController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data"
            })
        });

        test("update discussion when id and answer not pass in body", async () => {
            let request = httpMocks.createRequest({
                method: "PUT",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                body: {},
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" },
            });

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await discussionController.updateDiscussionItemsController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data"
            })
        });

        test("update discussion when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "PUT",
                params: { courseId: "996f8dfb-908b-458d-9c0d-aa974ff98976" },
                body: {},
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" },
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await discussionController.updateDiscussionItemsController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });
    })
});