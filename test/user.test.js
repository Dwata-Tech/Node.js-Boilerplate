let httpMocks = require("node-mocks-http");
const userData = require("../src/data/user_dao");
const userLoginData = require("../src/data/user_login_dao");
const userController = require("../src/controllers/user.controller");

jest.mock("../src/data/user_dao");
jest.mock("../src/data/user_login_dao");

// userData.findUserDetailsByUserId = jest.fn();

describe("user service", () => {

    /**
    * Test the GET user details by userId
    */
    describe("user details by userId", () => {
        const mockedUserData = jest.mocked(userData);

        afterEach(() => {
            mockedUserData.findUserDetailsByUserId.mockReset();
        });
        test("user details by id", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { userId: "996f8dfb-908b-458d-9c0d-aa974ff919a01213" }
            });
            let { userId } = request.params;
            const userDetails = {
                email: "John@John.com",
                first_name: "John",
                last_name: "doe",
                phone_number: "123456789",
                user_id: userId,
            }
            const data = {
                data: {
                    user: userDetails
                },
            };
            mockedUserData.findUserDetailsByUserId.mockResolvedValue([userDetails]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await userController.findUserById(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual(data)
        });

        test("user details by id when user not found", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { userId: "996f8dfb-908b-458d-9c0d-aa974ff919a01213" }
            });
            mockedUserData.findUserDetailsByUserId.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await userController.findUserById(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "User not found",
            })
        });

        test("user details by id when userId not pass in params", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await userController.findUserById(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("user details by id when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await userController.findUserById(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });

    })

    /**
    * Test the GET user details by email
    */
    describe("user details by email", () => {
        const mockedUserData = jest.mocked(userData);

        afterEach(() => {
            mockedUserData.getUserByEmail.mockReset();
        });
        test("user details by email", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { email: "unitTest@gmail.com" }
            });

            const userDetails = {
                user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a01213",
            }
            const data = {
                data: {
                    isUserExist: true
                },
            };
            mockedUserData.getUserByEmail.mockResolvedValue([userDetails]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await userController.findUserByEmail(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual(data)
        });

        test("user details by email when user not found", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { email: "unitTest@gmail.com" }
            });
            mockedUserData.getUserByEmail.mockResolvedValue([]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });
            const data = {
                data: {
                    isUserExist: false
                },
            };
            await userController.findUserByEmail(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual(data)
        });

        test("user details by email when email not pass in params", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await userController.findUserByEmail(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("user details by email when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await userController.findUserByEmail(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });

    })

    /**
    * Test the Post update user status
    */
    describe("update user status by userId", () => {
        const mockedUserData = jest.mocked(userLoginData);

        afterEach(() => {
            mockedUserData.updateBlockStatus.mockReset();
        });

        test("update user status success", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: { status: "ACTIVE" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a01213" }
            });

            mockedUserData.updateBlockStatus.mockResolvedValue(1);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await userController.updateUserStatus(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({ message: "success" })
        });

        test("update user status success", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: { status: "false" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a01213" }
            });

            mockedUserData.updateBlockStatus.mockResolvedValue(1);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await userController.updateUserStatus(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({ message: "success" })
        });

        test("update user status when user not found", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: { status: "false" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a01213" }
            });
            mockedUserData.updateBlockStatus.mockResolvedValue(0);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await userController.updateUserStatus(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({ message: "User not found" })
        });

        test("update user status when email not pass in params", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a01213" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await userController.updateUserStatus(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("update user status when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a01213" },
                body: { status: false }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await userController.updateUserStatus(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });

    })

    /**
    * Test the Put update user details
    */
    describe("update user details", () => {
        const mockedUserData = jest.mocked(userData);
        const mockedUserLoginData = jest.mocked(userLoginData);

        afterEach(() => {
            mockedUserData.updateUser.mockReset();
            mockedUserLoginData.updateUserEmail.mockReset();
        });

        test("update user details success", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: {
                    id: "996f8dfb-908b-458d-9c0d-aa974ff919a01213",
                    firstName: "unit",
                    lastName: "test",
                    email: "unitTest@gmail.com",
                    phoneNumber: "1234567890",
                }
            });

            mockedUserData.updateUser.mockResolvedValue();
            mockedUserLoginData.updateUserEmail.mockResolvedValue();
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await userController.updateUserDetails(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("update user details when id not pass in body", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: {
                    firstName: "unit",
                    lastName: "test",
                    email: "unitTest@gmail.com",
                    phoneNumber: "1234567890",
                }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await userController.updateUserDetails(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("update user details when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                body: {
                    firstName: "unit",
                    lastName: "test",
                    email: "unitTest@gmail.com",
                    phoneNumber: "1234567890",
                }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await userController.updateUserDetails(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });

    })
});
