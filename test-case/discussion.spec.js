let chai = require('chai');
let chaiHttp = require('chai-http');
const server = require('../src/index');

chai.should();

chai.use(chaiHttp);

let token;

describe('Discussion API', () => {

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
     * Test the GET course discussion by courseId route
     */
    describe('GET /api/v1/course/:courseId/discussion', function () {
        this.timeout(3000)
        /**
        * It should GET a course discussion by courseId error handling
        * If token is not pass in header
        */
        it('It should not GET a course discussion by courseId when token not pass in header', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"
            chai.request(server)
                .get('/api/v1/course/' + courseId + '/discussion')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(401);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('Unauthorized');
                    done();
                })
        })

        /**
        * It should GET a course discussion by courseId error handling
        * If token is not correct
        */
        it('It should not GET a course discussion by courseId when token is incorrect', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"
            let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5OTZmOGRmYi05MDhiLTQ1OGQtOWMwZC1hYTk3NGZmOTE5YTAiLCJzZXNzaW9uSWQiOiI3NzU3OTk3Mi1hMTgzLTQ4MjYtYjdjYS1mNWRmNjNkYWEyZWEiLCJpYXQiOjE2NjMyMjA2MTQsImV4cCI6MTY2MzgyNTQxNH0.ccHeMrtaeRIOMBedihW9LRTc1DFutOEP8szRI4MN56A";
            chai.request(server)
                .get('/api/v1/course/' + courseId + '/discussion')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(401);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('Invalid token');
                    done();
                })
        })

        /**
        * Test the GET course discussion by courseId route
        */
        it('It should GET a course discussion by courseId', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"
            chai.request(server)
                .get('/api/v1/course/' + courseId + '/discussion')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('data')
                    response.body.data.should.be.a('object');
                    response.body.data.should.have.property('discussionItems');
                    done();
                })
        })

        /**
        * It should GET a course discussion by courseId error handling
        * If course not found in database
        */
        it('It should GET a course discussion by courseId if course not found', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98934"

            chai.request(server)
                .get('/api/v1/course/' + courseId + '/discussion')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('course not found')
                    done();
                })
        })

        /**
        * Test the GET course discussion by courseId route with invalid route url
        */
        it('It should not get the course discussion by courseId', (done) => {
            chai.request(server)
                .get('/api/v1/course/discussion')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        /**
        * Test the GET course discussion by courseId route when traceId not pass in header
        */
        it('It should not get the course discussion by courseId', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976";
            chai.request(server)
                .get('/api/v1/course/' + courseId + '/discussion')
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
    * Test the POST add course discussion controller route
    */
    describe('POST /api/v1/course/:courseId/discussion', () => {

        it('It should POST add course discussion route success', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976";
            let data = {
                question: "sample question for test case ?"
            }
            chai.request(server)
                .post('/api/v1/course/' + courseId + '/discussion')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    if (response.status == 404) {
                        response.should.have.status(404);
                        response.body.should.be.a('object');
                        response.body.should.have.property('message')
                        response.body.message.should.be.eq('course not found')
                        done();
                    } else {
                        response.should.have.status(200);
                        response.body.should.be.a('object');
                        response.body.should.have.property('message')
                        response.body.message.should.be.eq('Success')
                        done();
                    }
                })
        })

        /**
        * Test the POST add course discussion route with invalid route url
        */
        it('It should not POST add course discussion', (done) => {
            chai.request(server)
                .post('/api/v1/course/discussion')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        /**
        * Test the POST add course discussion route when traceId not pass in header
        */
        it('It should not POST add course discussion', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976";
            chai.request(server)
                .post('/api/v1/course/' + courseId + '/discussion')
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
    * Test the PUT update course discussion route
    */
    describe('PUT /api/v1/course/:courseId/discussion', () => {

        it('It should PUT update course discussion route success', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"
            let data = {
                id: "26b1bf49-81c9-44d1-8648-cf92271245f3",
                answer: "update answer"
            }
            chai.request(server)
                .put('/api/v1/course/' + courseId + '/discussion')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    if (response.status == 404) {
                        response.should.have.status(404);
                        response.body.should.be.a('object');
                        response.body.should.have.property('message')
                        response.body.message.should.be.eq('course not found')
                        done();
                    } else {
                        response.should.have.status(200);
                        response.body.should.be.a('object');
                        response.body.should.have.property('message')
                        response.body.message.should.be.eq('Success')
                        done();
                    }
                })
        })

        /**
        * Test the PUT update course discussion route error handling
        * If id not provide
        */
        it('It should not a update course discussion without id provided', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"
            let data = {
                answer: ""
            }
            chai.request(server)
                .put('/api/v1/course/' + courseId + '/discussion')
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
        * Test the PUT update course discussion route error handling
        * If answer not provide
        */
        it('It should not a update course discussion without answer provided', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"
            let data = {
                id: "0af6369b-4a1d-46e0-bcf4-830ce1c08ea0"
            }
            chai.request(server)
                .put('/api/v1/course/' + courseId + '/discussion')
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
        * Test the PUT update course discussion route with invalid route url
        */
        it('It should not update course discussion', (done) => {
            chai.request(server)
                .put('/api/v1/course/discussion')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        /**
        * Test the PUT update course discussion route when traceId not pass in header
        */
        it('It should not update course discussion', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976";
            chai.request(server)
                .put('/api/v1/course/' + courseId + '/discussion')
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