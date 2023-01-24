let chai = require('chai');
let chaiHttp = require('chai-http');
let sinon = require('sinon');
let httpMocks = require('node-mocks-http');
let chaiAsPromised = require('chai-as-promised')
const server = require('../src/index');
const { findUserByIdController } = require('../src/controllers');
const userService = require('../src/services/user.service');
const authService = require('../src/services/auth.service');
const userData = require('../src/data/user_dao');
const userLoginData = require('../src/data/user_login_dao');
const sessionData = require('../src/data/session_dao');
const { expect } = require('chai');


chai.use(chaiHttp);
chai.use(chaiAsPromised);

chai.should();

let token;

describe('User Details API', () => {

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
     * Test the GET user details by userId route
     */
    describe('GET /api/v1/user/:userId', function () {
        this.timeout(2000)

        it('It should GET a user details by userId', (done) => {
            let userId = "996f8dfb-458d-458d-9c0d-aa974ff919a1"
            chai.request(server)
                .get('/api/v1/user/' + userId)
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('data')
                    response.body.data.should.be.a('object');
                    response.body.data.should.have.property('user');
                    done();
                })
        })

        /**
        * Test the GET user details by userId route error handling
        * If userId not found
        */
        it('It should GET user details for userId not found in database', (done) => {
            let userId = "996f8dfb-458d-458d-9c0d-aa974ff919999"
            chai.request(server)
                .get('/api/v1/user' + userId)
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    // response.body.should.have.property('message')
                    // response.body.message.should.be.eq('User not found')
                    done();
                })
        })

        /**
        * Test the GET user details by userId route with invalid route url
        */
        it('It should not get the details of user', (done) => {
            chai.request(server)
                .get('/api/v1/user')
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        /**
        * Test the GET user details by userId route when traceId not pass in header
        */
        it('It should not get the details of user', (done) => {
            let userId = "996f8dfb-458d-458d-9c0d-aa974ff919999"
            chai.request(server)
                .get('/api/v1/user/' + userId)
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
    * Test the GET user exist with email route
    */
    describe('POST /api/v1/user/:email/isExist', () => {

        it('It should GET user exist with email route success', (done) => {
            let email = "John@John.com";
            chai.request(server)
                .get('/api/v1/user/' + email + '/isExist')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('data')
                    response.body.data.should.be.a('object');
                    response.body.data.should.have.property('isUserExist');
                    response.body.data.isUserExist.should.be.eq(true);
                    done();
                })
        })

        /**
        * Test the GET user exist with email route error handling
        * If email not exist
        */
        it('It should POST a login route if email not exist', (done) => {
            let email = "johnysion@gmail.com"
            chai.request(server)
                .get('/api/v1/user/' + email + '/isExist')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('data')
                    response.body.data.should.be.a('object');
                    response.body.data.should.have.property('isUserExist');
                    response.body.data.isUserExist.should.be.eq(false);
                    done();
                })
        })

        /**
        * Test the GET user exist with email route with invalid route url
        */
        it('It should not get the check user is exist or not', (done) => {
            chai.request(server)
                .get('/api/v1/user/44544/isExit')
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        /**
        * Test the GET user exist with email route when traceId not pass in header
        */
        it('It should not get the check user is exist or not', (done) => {
            let email = "johnysion@gmail.com"
            chai.request(server)
                .get('/api/v1/user/' + email + '/isExist')
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
    * Test the POST update user status route
    */
    describe('POST /api/v1/user/status', () => {

        it('It should POST update user status route success', (done) => {
            let data = {
                status: "not",
            }
            chai.request(server)
                .post('/api/v1/user/status')
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

        // /**
        // * Test the GET user details by userId route error handling
        // * If userId not found
        // */
        // it('It should POST user status for userId not found in database', (done) => {
        //     let data = {
        //         status: "not",
        //     }
        //     chai.request(server)
        //         .post('/api/v1/user/status')
        //         .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
        //         .send(data)
        //         .end((err, response) => {
        //             response.should.have.status(404);
        //             response.body.should.be.a('object');
        //             response.body.should.have.property('message')
        //             response.body.message.should.be.eq('User not found')
        //             done();
        //         })
        // })

        /**
        * Test the POST update user status route error handling
        * If status not provide
        */
        it('It should not a update user status without status provided', (done) => {
            let data = {}
            chai.request(server)
                .post('/api/v1/user/status')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('Please provide valid data')
                    done();
                })
        })

        /**
        * Test the POST update user status route with invalid route url
        */
        it('It should not update user status', (done) => {
            chai.request(server)
                .post('/api/v1/user/stat')
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        /**
        * Test the POST update user status route when traceId not pass in header
        */
        it('It should not update user status', (done) => {
            chai.request(server)
                .post('/api/v1/user/status')
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
    * Test the PUT update user details route
    */
    describe('PUT /api/v1/user', () => {
        it('It should PUT update user details route success', (done) => {
            let data = {
                "id": "996f8dfb-908b-458d-9c0d-aa974ff919a0",
                "firstName": "John",
                "lastName": "doe",
                "email": "John@John.com",
                "phoneNumber": "123456789"
            }
            chai.request(server)
                .put('/api/v1/user')
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
        * Test the PUT update user details route error handling
        * If id not provide
        */
        it('It should not a update user details without id provided', (done) => {
            let data = {}
            chai.request(server)
                .put('/api/v1/user')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('Please provide valid data')
                    done();
                })
        })

        /**
        * Test the PUT update user details route with invalid route url
        */
        it('It should not update user details', (done) => {
            chai.request(server)
                .put('/api/v1/userss')
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        /**
        * Test the PUT update user details route when traceId not pass in header
        */
        it('It should not update user status', (done) => {
            chai.request(server)
                .put('/api/v1/user')
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