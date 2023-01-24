let chai = require('chai');
let chaiHttp = require('chai-http');
const server = require('../src/index');

chai.should();

chai.use(chaiHttp);

let token;

describe('Subscription API', () => {

    before(done => {
        let data = {
            email: "John@John.com",
            password: "12343"
        }
        chai.request(server)
            .post('/api/v1/login')
            .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
            .send(data)
            .end((err, response) => {
                token = response.body.data.token
                response.should.have.status(200);
                done();
            })
    })

    /**
     * Test the GET subscription plans list route
     */
    describe('GET /api/v1/plans', () => {
        it('It should GET subscription plans list', (done) => {
            chai.request(server)
                .get('/api/v1/plans')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('data')
                    response.body.data.should.be.a('object');
                    response.body.data.should.have.property('plans');
                    done();
                })
        })

        /**
        * Test the GET subscription plans list route with invalid route url
        */
        it('It should not get the subscription plans list', (done) => {
            chai.request(server)
                .get('/api/v1/plan')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        /**
        * Test the GET subscription plans list route when traceId not pass in header
        */
        it('It should not get the subscription plans list', (done) => {
            chai.request(server)
                .get('/api/v1/plans')
                .set({ Authorization: `Bearer ${token}` })
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message');
                    response.body.message.should.be.eq('x-request-id  is missing in header')
                    done();
                })
        })
    })


    /**
    * Test the GET subscription plan details by planId route
    */
    describe('GET /api/v1/plans/:planId', () => {

        it('It should GET subscription plan details by planId route success', (done) => {
            let id = "plan_K3T0nW7IOxY9Fj";
            chai.request(server)
                .get('/api/v1/plans/' + id)
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    if (response.status == 404) {
                        response.should.have.status(404);
                        response.body.should.be.a('object');
                        response.body.should.have.property('message')
                        response.body.message.should.be.eq('Plan not found')
                        done();
                    } else {
                        response.should.have.status(200);
                        response.body.should.be.a('object');
                        response.body.should.have.property('data')
                        done();
                    }
                })
        })

        /**
        * Test the GET subscription plan details by planId
        * if planId is invalid
        */
        it('It should GET subscription plan details by planId is invalid', (done) => {
            let id = "plan_K3RfTTOogbGa5sx";
            chai.request(server)
                .get('/api/v1/plans/' + id)
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(500);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('Internal server error')
                    done();
                })
        })

        /**
        * Test the GET subscription plan details by planId with invalid route url
        */
        it('It should not GET subscription plan details by planId', (done) => {
            chai.request(server)
                .get('/api/v1/plan')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        /**
        * Test the GET subscription plan details by planId when traceId not pass in header
        */
        it('It should not GET subscription plan details by planId', (done) => {
            let id = "plan_K3RfTTOogbGa5sx";
            chai.request(server)
                .get('/api/v1/plans/' + id)
                .set({ Authorization: `Bearer ${token}` })
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message');
                    response.body.message.should.be.eq('x-request-id  is missing in header')
                    done();
                })
        })
    })


    /**
    * Test the POST add subscription route
    */
    describe('POST /api/v1/subscribe', function () {
        this.timeout(4000);
        it('It should POST add subscription route success', (done) => {
            let data = {
                planId: "plan_K3RfTTOogbGa5x"
            }
            chai.request(server)
                .post('/api/v1/subscribe')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('success')
                    done();
                })
        })

        /**
        * Test the POST add subscription route error handling
        * If planId not provide
        */
        it('It should not a add subscription without planId provided', (done) => {
            let data = {}
            chai.request(server)
                .post('/api/v1/subscribe')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    // response.body.should.have.property('message')
                    // response.body.message.should.be.eq('Please provide valid data')
                    done();
                })
        })

        /**
        * Test the POST add subscription route with invalid route url
        */
        it('It should not add subscription', (done) => {
            chai.request(server)
                .post('/api/v1/subscription')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        // /**
        // * Test the POST add subscription route when traceId not pass in header
        // */
        // it('It should not add subscription', (done) => {
        //     chai.request(server)
        //         .post('/api/v1/subscribe')
        //         .set({ Authorization: `Bearer ${token}` })
        //         .end((err, response) => {
        //             response.should.have.status(400);
        //             response.body.should.be.a('object');
        //             response.body.should.have.property('message');
        //             response.body.message.should.be.eq('x-request-id  is missing in header')
        //             done();
        //         })
        // })
    })

    /**
    * Test the GET subscription details by subscriptionId route
    */
    describe('GET /api/v1/subscribe/:subscriptionId', () => {

        it('It should GET subscription details by subscriptionId route success', (done) => {
            let subscriptionId = "sub_KSOzVlBCUzR86W";
            chai.request(server)
                .get('/api/v1/subscribe/' + subscriptionId)
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('data')
                    done();
                })
        })

        /**
        * Test the GET subscription details by subscriptionId with invalid route url
        */
        it('It should not GET subscription details by subscriptionId', (done) => {
            chai.request(server)
                .get('/api/v1/subscriptions')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        /**
        * Test the GET subscription details by subscriptionId when traceId not pass in header
        */
        it('It should not GET subscription details by subscriptionId', (done) => {
            let subscriptionId = "sub_KSOzVlBCUzR86W";
            chai.request(server)
                .get('/api/v1/subscribe/' + subscriptionId)
                .set({ Authorization: `Bearer ${token}` })
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message');
                    response.body.message.should.be.eq('x-request-id  is missing in header')
                    done();
                })
        })
    })

    /**
    * Test the POST cancel subscription by subscriptionId route
    */
    describe('POST /api/v1/subscribe/:subscriptionId/cancel', () => {

        it('It should POST cancel subscription by subscriptionId route success', (done) => {
            let subscriptionId = "sub_KigPkKVmJJsKv3";
            let data = {
                cancelAtEndOfBillingCycle: false
            }
            chai.request(server)
                .post('/api/v1/subscribe/' + subscriptionId + '/cancel')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('Success')
                    done();
                })
        })

        /**
        * Test the POST cancel subscription by subscriptionId route error handling
        * If cancelAtEndOfBillingCycle not provide in body
        */
        it('It should not cancel subscription without cancelAtEndOfBillingCycle provided', (done) => {
            let subscriptionId = "sub_KSMOVU9Q2bC73f";
            let data = {}
            chai.request(server)
                .post('/api/v1/subscribe/' + subscriptionId + '/cancel')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(500);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('Internal server error')
                    done();
                })
        })

        /**
        * Test the POST cancel subscription by subscriptionId with invalid route url
        */
        it('It should not cancel subscription by subscriptionId', (done) => {
            chai.request(server)
                .post('/api/v1/subscribe/cancel')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        /**
        * Test the POST cancel subscription by subscriptionId when traceId not pass in header
        */
        it('It should not cancel subscription by subscriptionId', (done) => {
            let subscriptionId = "sub_KSMOVU9Q2bC73f";
            chai.request(server)
                .post('/api/v1/subscribe/' + subscriptionId + '/cancel')
                .set({ Authorization: `Bearer ${token}` })
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message');
                    response.body.message.should.be.eq('x-request-id  is missing in header')
                    done();
                })
        })
    })
})