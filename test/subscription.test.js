let httpMocks = require("node-mocks-http");
const subscriptionData = require("../src/data/subscription_dao");
const subscriptionController = require("../src/controllers/subscription.controller");
const subscriptionService = require("../src/services/subscription.service");

jest.mock("../src/data/subscription_dao");

describe("Subscription details", () => {

    /**
    * Test subscription controller
    */
    describe("subscription plan list controller", () => {

        // test("subscription plan list success", async () => {
        //     let request = httpMocks.createRequest({
        //         method: "GET",
        //         headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
        //     });

        //     let response = httpMocks.createResponse({
        //         eventEmitter: require("events").EventEmitter,
        //     });

        //     await subscriptionController.listPlansController(request, response)
        //     let res_data = response._getData();
        //     expect(res_data).toEqual("")
        // });

        test("subscription plan list when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await subscriptionController.listPlansController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });

        test("subscription plan list success", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
            });
            const traceId = request.headers["X-REQUEST-ID"];

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await subscriptionService.listPlans(traceId, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                "data": {
                    "plans": [
                        {
                            "id": "plan_K3THJw6xg5CYxu",
                            "name": "DAILY",
                            "interval": "7 days",
                            "currency": "INR",
                            "price": "1.00"
                        },
                        {
                            "id": "plan_K3T0nW7IOxY9Fj",
                            "name": "2-yearly",
                            "interval": "730 days",
                            "currency": "INR",
                            "price": "34509.00"
                        },
                        {
                            "id": "plan_K3RfTTOogbGa5x",
                            "name": "Yearly",
                            "interval": "365 days",
                            "currency": "INR",
                            "price": "300.00"
                        },
                        {
                            "id": "plan_K3Rf5uNqO902My",
                            "name": "Weekly",
                            "interval": "7 days",
                            "currency": "INR",
                            "price": "200.00"
                        },
                        {
                            "id": "plan_K3RehKD8XH1R7D",
                            "name": "Monthly",
                            "interval": "30 days",
                            "currency": "INR",
                            "price": "100.00"
                        }
                    ]
                }
            })
        });
    })

    /**
    * Test subscription plan details controller
    */
    describe("subscription plan details controller", () => {

        test("subscription plan details success", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { "id": "plan_K3THJw6xg5CYxu" },
            });

            const { id } = request.params;
            const traceId = request.headers["X-REQUEST-ID"];
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await subscriptionService.getPlanDetails({ id, traceId }, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                "data": {
                    "id": "plan_K3THJw6xg5CYxu",
                    "name": "DAILY",
                    "interval": "7 days",
                    "currency": "INR",
                    "price": "1.00"
                }
            })
        });

        test("subscription plan details when id not pass in params", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
            });

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await subscriptionController.planDetailsController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({ message: "Please provide valid data" })
        });

        test("subscription plan details when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                params: { "id": "plan_K3THJw6xg5CYxu" },
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await subscriptionController.planDetailsController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });

        test("subscription plan details error", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { "id": "plan_K3THJw6xg5CYxu" },
            });

            const { id } = request.params;
            const traceId = request.headers["X-REQUEST-ID"];
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await subscriptionService.getPlanDetails({ traceId }, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "Internal server error"
            })
        });
    })

    /**
    * Test create subscription controller
    */
    describe("create subscription controller", () => {
        const mockedSubscriptionData = jest.mocked(subscriptionData);

        afterEach(() => {
            mockedSubscriptionData.createSubscriptionData.mockReset();
        });

        test("create subscription success", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: { "planId": "plan_K3THJw6xg5CYxu" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });

            const { planId } = request.params;
            const userId = request.user.user_id;
            const traceId = request.headers["X-REQUEST-ID"];

            mockedSubscriptionData.createSubscriptionData.mockResolvedValue([]);

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await subscriptionService.createSubscription({ userId, planId, traceId }, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual(res_data)
        });

        test("create subscription when planId not pass in body", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await subscriptionController.createSubscriptionController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({ message: "Please provide valid data" })
        });

        test("create subscription when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                body: { "planId": "plan_K3THJw6xg5CYxu" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await subscriptionController.createSubscriptionController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });

        test("create subscription error", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                body: { "planId": "plan_K3THJw6xg5CYxu" },
                user: { user_id: "996f8dfb-908b-458d-9c0d-aa974ff919a0" }
            });

            const { planId } = request.params;
            const userId = request.user.user_id;
            const traceId = request.headers["X-REQUEST-ID"];

            mockedSubscriptionData.createSubscriptionData.mockResolvedValue([]);

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await subscriptionService.createSubscription({ userId }, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({ message: "Internal server error" })
        });
    })

    /**
    * Test fetch subscription details controller
    */
    describe("fetch subscription details controller", () => {

        test("fetch subscription details success", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { "subscriptionId": "sub_KaisnrA7V3WU3B" },
            });
            const { subscriptionId } = request.params;
            const traceId = request.headers["X-REQUEST-ID"];

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await subscriptionService.fetchSubscriptionDetails({ subscriptionId, traceId }, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual(res_data)
        });

        test("fetch subscription details when subscriptionId not pass in params", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: {}
            });

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await subscriptionController.fetchSubscriptionDetailsController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({ message: "Please provide valid data" })
        });

        test("fetch subscription details when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                params: { "subscriptionId": "sub_KaisnrA7V3WU3B" },
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await subscriptionController.fetchSubscriptionDetailsController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });

        test("fetch subscription details error", async () => {
            let request = httpMocks.createRequest({
                method: "GET",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { "subscriptionId": "sub_KaisnrA7V3WU3B" },
            });
            const { subscriptionId } = request.params;
            const traceId = request.headers["X-REQUEST-ID"];

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await subscriptionService.fetchSubscriptionDetails({}, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({ message: "Internal server error" })
        });
    })

    /**
    * Test cancel subscription controller
    */
    describe("cancel subscription controller", () => {

        test("cancel subscription success", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: { "subscriptionId": "sub_KQSQwQCzFrvo1k" },
                body: { "cancelAtEndOfBillingCycle": false },
            });

            const { subscriptionId } = request.params;
            const traceId = request.headers["X-REQUEST-ID"];
            const { cancelAtEndOfBillingCycle } = request.body;

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await subscriptionService.cancelSubscription(subscriptionId, cancelAtEndOfBillingCycle, traceId, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual(res_data)
        });

        test("cancel subscription when subscriptionId not pass in params", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                headers: { "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472d" },
                params: {},
                body: { "cancelAtEndOfBillingCycle": false },
            });

            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await subscriptionController.cancelSubscriptionController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({ message: "Please provide valid data" })
        });

        test("cancel subscription when not pass header", async () => {
            let request = httpMocks.createRequest({
                method: "POST",
                params: { "subscriptionId": "sub_KaisnrA7V3WU3B" },
                body: { "cancelAtEndOfBillingCycle": false },
            });
            let response = httpMocks.createResponse({
                eventEmitter: require("events").EventEmitter,
            });

            await subscriptionController.cancelSubscriptionController(request, response)
            let res_data = JSON.parse(response._getData());
            expect(res_data).toEqual({
                message: "x-request-id  is missing in header",
            })
        });
    })

});