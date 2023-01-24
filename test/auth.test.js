let httpMocks = require("node-mocks-http");
const googleLoginData = require("../src/utils/apiCallGoogleDecodeToken");
const linkedLoginData = require("../src/utils/apiCallLinkedInDecodeToken");
const facebookLoginData = require("../src/utils/apiCallFacebookDecodeToken");
const userData = require("../src/data/user_dao");
const userLoginData = require("../src/data/user_login_dao");
const sessionData = require("../src/data/session_dao");
const otpData = require("../src/data/otp_history_dao");
const userController = require("../src/controllers/user.controller");
const authController = require("../src/controllers/auth.controller");

jest.mock("../src/data/user_login_dao");
jest.mock("../src/data/session_dao");
jest.mock("../src/data/user_dao");
jest.mock("../src/data/otp_history_dao");
jest.mock("../src/utils/apiCallGoogleDecodeToken");
jest.mock("../src/utils/apiCallLinkedInDecodeToken");
jest.mock("../src/utils/apiCallFacebookDecodeToken.js");

describe("Auth details", () => {

    /**
    * Test the login user function
    */
    describe("user login function", () => {
        const mockedUserLoginData = jest.mocked(userLoginData);
        const mockedSessionData = jest.mocked(sessionData);

        afterEach(() => {
            mockedUserLoginData.checkLoginDetails.mockReset();
            mockedSessionData.createSession.mockReset();
        });

        test("user login success", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: { email: "John@John.com", password: "12343" }
            });
            const { email, password } = request.body;
            const userDetails = {
                email: email,
                password: password,
                last_login_time: "12132",
                is_blocked: false,
                user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a01213",
            }
            mockedUserLoginData.checkLoginDetails.mockResolvedValue([userDetails]);
            mockedSessionData.createSession.mockResolvedValue();
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.loginController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("user login when email password not match", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: { email: "unitTest@gmail.com", password: "1234" }
            });
            mockedUserLoginData.checkLoginDetails.mockResolvedValue([]);
            mockedSessionData.createSession.mockResolvedValue();
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.loginController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Email/Password does not match",
            })
        });

        test("user login when email not pass in body", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: { password: "1234" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.loginController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("user login when password not pass in body", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: { email: "unitTest@gmail.com" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.loginController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("user details by id when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                body: { email: "unitTest@gmail.com", password: "1234" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.loginController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });

    })


    /**
    * Test the register controller
    */
    describe("user register function", () => {

        const mockedUserData = jest.mocked(userData);
        const mockedUserLoginData = jest.mocked(userLoginData);
        const mockedSessionData = jest.mocked(sessionData);

        afterEach(() => {
            mockedUserData.registerUser.mockReset();
            mockedUserLoginData.createUserLogin.mockReset();
            mockedUserLoginData.getUserEmailData.mockReset();
            mockedSessionData.createSession.mockReset();
        });

        test("user register success", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: {
                    email: "unitTest@John.com",
                    password: "12343",
                    firstName: "unit",
                    lastName: "test",
                    phoneNumber: "2479854327",
                    loginType: "EMAIL_PASSWORD",
                }
            });
            const { email } = request.body;
            const userDetails = {
                email: email,
                user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a01213",
            }
            mockedUserLoginData.getUserEmailData.mockResolvedValue([userDetails]);
            mockedUserData.registerUser.mockResolvedValue();
            mockedUserLoginData.createUserLogin.mockResolvedValue();
            mockedSessionData.createSession.mockResolvedValue();
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.registerController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("user register when email already taken", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: {
                    email: "unitTest@John.com",
                    password: "12343",
                    firstName: "unit",
                    lastName: "test",
                    phoneNumber: "2479854327",
                    loginType: "EMAIL_PASSWORD",
                }
            });
            const { email } = request.body;
            mockedUserLoginData.getUserEmailData.mockResolvedValue([]);
            mockedUserData.registerUser.mockResolvedValue();
            mockedUserLoginData.createUserLogin.mockResolvedValue();
            mockedSessionData.createSession.mockResolvedValue();
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.registerController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("user register when email not pass in body", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: {
                    password: "12343",
                    firstName: "unit",
                    lastName: "test",
                    phoneNumber: "2479854327",
                    loginType: "EMAIL_PASSWORD",
                }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.registerController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("user register when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                body: { email: "unitTest@gmail.com", password: "1234" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.registerController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });

    })


    /**
    * Test the sendOTP controller
    */
    describe("send otp controller", () => {

        const mockedOtpData = jest.mocked(otpData);

        afterEach(() => {
            mockedOtpData.invalidateOtpOfSameType.mockReset();
            mockedOtpData.generateOtp.mockReset();
        });

        test("send otp success when type = VERIFY_EMAIL", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: {
                    type: "VERIFY_EMAIL"
                },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a01213" }
            });
            const userId = request.user.user_id;

            mockedOtpData.invalidateOtpOfSameType.mockResolvedValue();
            mockedOtpData.generateOtp.mockResolvedValue();
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.sendOTP(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("send otp success when type = VERIFY_PHONE", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: {
                    type: "VERIFY_PHONE"
                },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a01213" }
            });
            const userId = request.user.user_id;

            mockedOtpData.invalidateOtpOfSameType.mockResolvedValue();
            mockedOtpData.generateOtp.mockResolvedValue();
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.sendOTP(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("send otp when type not pass in body", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a01213" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.sendOTP(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("send otp when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                body: {
                    type: "VERIFY_PHONE"
                },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a01213" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.sendOTP(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });

    })


    /**
    * Test the verifyOTP controller
    */
    describe("verify otp controller", () => {

        const mockedOtpData = jest.mocked(otpData);

        afterEach(() => {
            mockedOtpData.getOtpData.mockReset();
            mockedOtpData.updateOtpRecord.mockReset();
        });

        test("send otp success when type = VERIFY_EMAIL", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: {
                    otp: "123456", type: "VERIFY_EMAIL"
                },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a01213" }
            });
            const userId = request.user.user_id;

            mockedOtpData.getOtpData.mockResolvedValue([{ expiry: "2022-11-18 10:06:50" }]);
            // mockedOtpData.updateOtpRecord.mockResolvedValue([{}]);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.verifyOTP(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({ message: "OTP is expired" })
        });

        test("verify otp when type not pass in body", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a01213" },
                body: {
                    otp: "123456"
                }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.verifyOTP(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("verify otp when otp not pass in body", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a01213" },
                body: {
                    type: "VERIFY_EMAIL"
                }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.verifyOTP(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("verify otp when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                body: {
                    type: "VERIFY_PHONE"
                },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a01213" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.verifyOTP(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });

    })

    /**
    * Test the forgot password controller
    */
    describe("forgot password controller", () => {

        const mockedUserLoginData = jest.mocked(userLoginData);
        const mockedOtpData = jest.mocked(otpData);

        afterEach(() => {
            mockedUserLoginData.getUserEmailData.mockReset();
            mockedOtpData.invalidateOtpOfSameType.mockReset();
            mockedOtpData.generateOtp.mockReset();
        });

        test("forgot password success", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: { email: "unitTest@gmail.com" },
            });

            mockedUserLoginData.getUserEmailData.mockResolvedValue([{ user_id: "", email: request.body.email }]);
            mockedOtpData.invalidateOtpOfSameType.mockResolvedValue([{}]);
            mockedOtpData.generateOtp.mockResolvedValue([{}]);

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.forgotPasswordController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("forgot password when email not pass in body", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.forgotPasswordController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("forgot password when user not exist", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: { email: "unitTest@gmail.com" },
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            mockedUserLoginData.getUserEmailData.mockResolvedValue([]);
            await authController.forgotPasswordController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("forgot password when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                body: { email: "unitTest@gmail.com" },
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.forgotPasswordController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });

    })


    /**
    * Test the change password controller
    */
    describe("change password controller", () => {

        const mockedUserLoginData = jest.mocked(userLoginData);
        const mockedOtpData = jest.mocked(otpData);

        afterEach(() => {
            mockedUserLoginData.getUserEmailData.mockReset();
            mockedUserLoginData.updatePassword.mockReset();
            mockedOtpData.getOtpDataForChangePassword.mockReset();
            mockedOtpData.updateOtpRecord.mockReset();
        });

        test("change password success", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: { email: "unitTest@gmail.com", password: "909090", otp: "123456" },
            });

            mockedUserLoginData.getUserEmailData.mockResolvedValue([{ user_id: "", email: request.body.email }]);
            mockedUserLoginData.updatePassword.mockResolvedValue([{}]);
            mockedOtpData.getOtpDataForChangePassword.mockResolvedValue([{}]);
            mockedOtpData.updateOtpRecord.mockResolvedValue([{}]);

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.changePasswordController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("change password when email not pass in body", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.forgotPasswordController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("change password when user not exist", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: { email: "unitTest@gmail.com", password: "909090", otp: "123456" },
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            mockedUserLoginData.getUserEmailData.mockResolvedValue([]);
            mockedUserLoginData.updatePassword.mockResolvedValue([{}]);
            mockedOtpData.getOtpDataForChangePassword.mockResolvedValue([{}]);
            mockedOtpData.updateOtpRecord.mockResolvedValue([{}]);

            await authController.changePasswordController(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("change password when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                body: { email: "unitTest@gmail.com", password: "909090", otp: "123456" },
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.changePasswordController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });

    })


    /**
    * Test the register google login
    */
    describe("register google login function", () => {
        const mockedGoogleLoginData = jest.mocked(googleLoginData);

        afterEach(() => {
            mockedGoogleLoginData.googleAPICall.mockReset();
        });

        test("register google login success", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: { accessToken: "access_token" }
            });
            const userDetails = {
                email: "unitTest@gmail.com",
                firstName: "unit",
                lastName: "test",
            }
            mockedGoogleLoginData.googleAPICall.mockResolvedValue(userDetails);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.registerUserUsingGoogle(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("register google login when email not match", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: { accessToken: "access_token" }
            });
            mockedGoogleLoginData.googleAPICall.mockResolvedValue();

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.registerUserUsingGoogle(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("register google login when accessToken not pass in body", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: {}
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.registerUserUsingGoogle(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("register google login when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                body: { accessToken: "access_token" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.registerUserUsingGoogle(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });

    })


    /**
    * Test the register linked login
    */
    describe("register linked login function", () => {
        const mockedLinkedLoginData = jest.mocked(linkedLoginData);

        afterEach(() => {
            mockedLinkedLoginData.linkedInApiCall.mockReset();
        });

        test("register linked login success", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: { accessToken: "access_token" }
            });
            const userDetails = {
                email: "unitTest@gmail.com",
                firstName: "unit",
                lastName: "test",
            }
            mockedLinkedLoginData.linkedInApiCall.mockResolvedValue(userDetails);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.registerUserUsingLinkedIn(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("register linked login when email not match", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: { accessToken: "access_token" }
            });
            mockedLinkedLoginData.linkedInApiCall.mockResolvedValue();

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.registerUserUsingLinkedIn(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("register linked login when accessToken not pass in body", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: {}
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.registerUserUsingLinkedIn(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("register linked login when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                body: { accessToken: "access_token" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.registerUserUsingLinkedIn(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });

    })

    /**
    * Test the register facebook login
    */
    describe("register facebook login function", () => {
        const mockedFacebookLoginData = jest.mocked(facebookLoginData);

        afterEach(() => {
            mockedFacebookLoginData.facebookAPICall.mockReset();
        });

        test("register facebook login success", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: { accessToken: "access_token" }
            });
            const userDetails = {
                email: "unitTest@gmail.com",
                firstName: "unit",
                lastName: "test",
            }
            mockedFacebookLoginData.facebookAPICall.mockResolvedValue(userDetails);
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.registerUserUsingFacebook(request, response)
            let res_data = response._getData();
            expect(res_data).toEqual("")
        });

        test("register facebook login when email not match", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: { accessToken: "access_token" }
            });
            mockedFacebookLoginData.facebookAPICall.mockResolvedValue();

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.registerUserUsingFacebook(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("register facebook login when accessToken not pass in body", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: {}
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.registerUserUsingFacebook(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Please provide valid data",
            })
        });

        test("register facebook login when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                body: { accessToken: "access_token" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await authController.registerUserUsingFacebook(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });

    })
});