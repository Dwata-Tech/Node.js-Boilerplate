let chai = require('chai');
let chaiHttp = require('chai-http');
const server = require('../src/index');

chai.should();

chai.use(chaiHttp);

let token;
let groupIds;

describe('Course API', () => {

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
     * Test the GET course route
     */
    describe('GET /api/v1/course', () => {
        it('It should GET all the course', (done) => {
            chai.request(server)
                .get('/api/v1/course')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    done();
                })
        })

        /**
        * Test the GET course route with invalid route url
        */
        it('It should not GET all the course', (done) => {
            chai.request(server)
                .get('/course')
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        // /**
        // * Test the GET course route when traceId not pass in header
        // */
        // it('It should not GET all the course', (done) => {
        //     chai.request(server)
        //         .post('/api/v1/course')
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
     * Test the PUT update student attendance course wise route
     */
    describe('PUT /api/v1/course/:courseId/attendance', () => {

        it('It should PUT update student attendance course wise', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"

            chai.request(server)
                .put('/api/v1/course/' + courseId + '/attendance')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .query({ present: true })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('success')
                    done();
                })
        })

        /**
        * Test the PUT update student attendance course wise route error handling
        * If course not found in database
        */
        it('It should PUT update student attendance course wise course notfound', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98934"

            chai.request(server)
                .put('/api/v1/course/' + courseId + '/attendance')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .query({ present: true })
                .end((err, response) => {
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('course not found')
                    done();
                })
        })

        /**
        * Test the PUT update student attendance course wise route error handling
        * If count is not proper
        */
        it('It should PUT update student attendance course wise if count not proper', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"

            chai.request(server)
                .put('/api/v1/course/' + courseId + '/attendance')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .query({ present: 21 })
                .end((err, response) => {
                    response.should.have.status(500);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('Internal server error')
                    done();
                })
        })

        /**
        * Test the PUT update student attendance course wise route error handling
        * If present not provide in req.query
        */
        it('It should not update student attendance course wise without present provided', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"
            let data = {}
            chai.request(server)
                .put('/api/v1/course/' + courseId + '/attendance')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .query(data)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('Please provide valid data')
                    done();
                })
        })

        /**
        * Test the PUT update student attendance course wise route with invalid route url
        */
        it('It should not PUT update student attendance', (done) => {
            chai.request(server)
                .put('/api/v1/course/attendance')
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        /**
        * Test the PUT update student attendance course wise route when traceId not pass in header
        */
        it('It should not PUT update student attendance', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"
            chai.request(server)
                .put('/api/v1/course/' + courseId + '/attendance')
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
    * Test the POST student understand the course route
    */
    describe('POST /api/v1/course/:courseId/understanding', () => {

        it('It should POST student understand the course route success', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"
            let data = {
                understanding: "sample understanding for test case"
            }
            chai.request(server)
                .post('/api/v1/course/' + courseId + '/understanding')
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
        * Test the POST student understand the course route error handling
        * If course not found in database
        */
        it('It should POST student understand the course if course not found in database', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98934"
            let data = {
                understanding: "sample understanding for test case"
            }
            chai.request(server)
                .post('/api/v1/course/' + courseId + '/understanding')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('course not found')
                    done();
                })
        })

        /**
        * Test the POST student understand the course route error handling
        * If understanding not provide in req.body
        */
        it('It should not student understand the course route without understanding', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"
            let data = {}
            chai.request(server)
                .post('/api/v1/course/' + courseId + '/understanding')
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
        * Test the POST student understand the course route with invalid route url
        */
        it('It should not POST student understand the course route', (done) => {
            chai.request(server)
                .put('/api/v1/course/understanding')
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        // /**
        // * Test the POST student understand the course route when traceId not pass in header
        // */
        // it('It should not POST student understand the course route', (done) => {
        //     let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"
        //     chai.request(server)
        //         .put('/api/v1/course/' + courseId + '/understanding')
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
    * Test the GET list of question by course route
    */
    describe('GET /api/v1/course/:courseId/questions', () => {

        it('It should GET the list of question by course route', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976";
            chai.request(server)
                .get('/api/v1/course/' + courseId + '/questions')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('data')
                    response.body.data.should.be.a('object');
                    response.body.data.should.have.property('questions')
                    response.body.data.questions.should.be.a('array')
                    done();
                })
        })

        /**
        * Test the GET list of question by course route error handling
        * if course wise question list is empty
        */
        it('It should GET the list of question by course route', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98977";
            chai.request(server)
                .get('/api/v1/course/' + courseId + '/questions')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('data')
                    response.body.data.should.be.a('object');
                    done();
                })
        })

        /**
        * Test the GET list of question by course route with invalid route url
        */
        it('It should not GET list of question by course route', (done) => {
            chai.request(server)
                .get('/api/v1/course/questions')
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        /**
        * Test the GET list of question by course route when traceId not pass in header
        */
        it('It should not GET list of question by course route', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"
            chai.request(server)
                .get('/api/v1/course/' + courseId + '/questions')
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
    * Test the POST update answer of question by course route
    */
    describe('POST /api/v1/course/:courseId/answer', () => {

        it('It should POST update answer of question by course route', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"
            let data = {
                questionId: "996f8dfb-908b-458d-9c0d-aa974afr5678",
                answer: "sample answer for test case"
            }
            chai.request(server)
                .post('/api/v1/course/' + courseId + '/answer')
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
        * Test the POST update answer of question by course route error handling
        * If course not found in database
        */
        it('It should POST update answer of question by course if course not found in database', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98934"
            let data = {
                questionId: "996f8dfb-908b-458d-9c0d-aa974afr5678",
                answer: "sample answer for test case"
            }
            chai.request(server)
                .post('/api/v1/course/' + courseId + '/answer')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('course not found')
                    done();
                })
        })

        /**
        * Test the POST update answer of question by course route error handling
        * If questionId not provide in req.body
        */
        it('It should not update answer of question by course route without questionId', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"
            let data = {
                answer: "sample answer for test case"
            }
            chai.request(server)
                .post('/api/v1/course/' + courseId + '/answer')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('Please provide valid input')
                    done();
                })
        })

        /**
        * Test the POST update answer of question by course route error handling
        * If answer not provide in req.body
        */
        it('It should not update answer of question by course route without answer', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"
            let data = {
                questionId: "996f8dfb-908b-458d-9c0d-aa974afr5678"
            }
            chai.request(server)
                .post('/api/v1/course/' + courseId + '/answer')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('Please provide valid input')
                    done();
                })
        })

        /**
        * Test the POST update answer of question by course route with invalid route url
        */
        it('It should not POST update answer of question by course route', (done) => {
            chai.request(server)
                .post('/api/v1/course/question')
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        /**
        * Test the POST update answer of question by course route when traceId not pass in header
        */
        it('It should not POST update answer of question by course route', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"
            chai.request(server)
                .post('/api/v1/course/' + courseId + '/answer')
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
    * Test the GET create group of student course wise route
    */
    describe('GET /api/v1/course/:courseId/groups', () => {

        it('It should GET create group of student course wise', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"
            let data = {
                count: 5
            }
            chai.request(server)
                .get('/api/v1/course/' + courseId + '/groups')
                .set({ Authorization: `Bearer ${token}`, "x-request-id": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .query(data)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('data');
                    response.body.data.should.be.a('object');
                    response.body.data.should.have.property('groups')
                    done();
                })
        })

        /**
        * Test the GET create group of student course wise route error handling
        * If count not provide in req.query
        */
        it('It should GET create group of student course wise', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"
            let data = {}
            chai.request(server)
                .get('/api/v1/course/' + courseId + '/groups')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .query(data)
                .end((err, response) => {
                    if (response.status == 404) {
                        response.should.have.status(404);
                        response.body.should.be.a('object');
                        response.body.should.have.property('message')
                        response.body.message.should.be.oneOf(['course not found', 'student enrollment data not found'])
                        done();
                    } else {
                        groupIds = response?.body?.data?.groups[0]?.groupId
                        response.should.have.status(200);
                        response.body.should.be.a('object');
                        response.body.should.have.property('data');
                        response.body.data.should.be.a('object');
                        response.body.data.should.have.property('groups')
                        done();
                    }
                })
        })

        it('It should GET create group of student course wise if course not found', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98900"
            let data = {
                count: 5
            }
            chai.request(server)
                .get('/api/v1/course/' + courseId + '/groups')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .query(data)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    // response.body.message.should.be.oneOf('course not found')
                    done();
                })
        })

        /**
        * Test the GET create group of student course wise route with invalid route url
        */
        it('It should not GET create group of student course wise', (done) => {
            chai.request(server)
                .get('/api/v1/course/groups')
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        /**
        * Test the GET create group of student course wise route when traceId not pass in header
        */
        it('It should not GET create group of student course wise', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976"
            chai.request(server)
                .get('/api/v1/course/' + courseId + '/groups')
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
    * Test the POST update answer of question of group by course route
    */
    describe('POST /api/v1/course/:courseId/group/:groupId/answer', () => {
        it('It should POST update answer of question of group by course route', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976";
            let groupId = groupIds
            let data = {
                questionId: "996f8dfb-908b-458d-9c0d-aa974afr5678",
                answer: "sample answer for test case"
            }
            chai.request(server)
                .post('/api/v1/course/' + courseId + '/group/' + groupId + '/answer')
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
        * Test the update answer of question of group by course route error handling
        * if courseId not found
        */
        it('It should POST update answer of question of group by course route', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98900";
            let groupId = groupIds
            let data = {
                questionId: "996f8dfb-908b-458d-9c0d-aa974afr5678",
                answer: "sample answer for test case"
            }
            chai.request(server)
                .post('/api/v1/course/' + courseId + '/group/' + groupId + '/answer')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('course not found')
                    done();
                })
        })

        /**
        * Test the update answer of question of group by course route error handling
        * if groupId not found
        */
        it('It should POST update answer of question of group by course route', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976";
            let groupId = "7889bc36-9f37-4cff-a6b9-6e7e491d72ba"
            let data = {
                questionId: "996f8dfb-908b-458d-9c0d-aa974afr5678",
                answer: "sample answer for test case"
            }
            chai.request(server)
                .post('/api/v1/course/' + courseId + '/group/' + groupId + '/answer')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('group not found')
                    done();
                })
        })


        /**
        * Test the update answer of question of group by course route error handling
        * If questionId not provide in req.body
        */
        it('It should not update answer of question of group by course route without questionId', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976";
            let groupId = groupIds
            let data = {
                answer: "sample answer for test case"
            }
            chai.request(server)
                .post('/api/v1/course/' + courseId + '/group/' + groupId + '/answer')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('Please provide valid input')
                    done();
                })
        })

        /**
        * Test the update answer of question of group by course route error handling
        * If answer not provide in req.body
        */
        it('It should not update answer of question of group by course route without answer', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976";
            let groupId = groupIds
            let data = {
                questionId: "996f8dfb-908b-458d-9c0d-aa974afr5678"
            }
            chai.request(server)
                .post('/api/v1/course/' + courseId + '/group/' + groupId + '/answer')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('Please provide valid input')
                    done();
                })
        })

        /**
        * Test the POST update answer of question of group by course route with invalid route url
        */
        it('It should not POST update answer of question of group by course route', (done) => {
            chai.request(server)
                .post('/api/v1/course/group/answer')
                .end((err, response) => {
                    response.should.have.status(401);
                    done();
                })
        })

        /**
        * Test the POST update answer of question of group by course route when traceId not pass in header
        */
        it('It should not POST update answer of question of group by course route', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976";
            let groupId = groupIds;
            chai.request(server)
                .post('/api/v1/course/' + courseId + '/group/' + groupId + '/answer')
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
    * Test the GET answer of specific group by course route
    */
    describe('GET /api/v1/course/:courseId/group/answers', () => {
        it('It should GET answer of specific group by course route success', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976";
            chai.request(server)
                .get('/api/v1/course/' + courseId + '/group/answers')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {

                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('data')
                    done();
                })
        })

        /**
        * Test the GET answer of specific group by course route error handling
        * If course not found in database
        */
        it('It should GET answer of specific group by course if course not found in database', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98934"

            chai.request(server)
                .get('/api/v1/course/' + courseId + '/group/answers')
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
        * Test the GET answer of specific group by course route with invalid route url
        */
        it('It should not GET answer of specific group by course route', (done) => {
            chai.request(server)
                .get('/api/v1/course/group/answers')
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        /**
        * Test the GET answer of specific group by course route when traceId not pass in header
        */
        it('It should not GET answer of specific group by course route', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976";
            chai.request(server)
                .get('/api/v1/course/' + courseId + '/group/answers')
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
    * Test the GET word cloud list by course route
    */
    describe('GET /api/v1/course/:courseId/world-cloud', () => {
        it('It should GET word cloud list by course route success', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976";
            chai.request(server)
                .get('/api/v1/course/' + courseId + '/world-cloud')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('data')
                    done();
                })
        })

        /**
        * Test the GET word cloud list by course route with invalid route url
        */
        it('It should not GET word cloud list by course route', (done) => {
            chai.request(server)
                .get('/api/v1/course/world-cloud')
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        /**
        * Test the GET word cloud list by course route when traceId not pass in header
        */
        it('It should not GET answer of specific group by course route', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976";
            chai.request(server)
                .get('/api/v1/course/' + courseId + '/world-cloud')
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
    * Test the GET reports by course route
    */
    describe('GET /api/v1/course/:courseId/reports', () => {

        it('It should GET word cloud list by course route success', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976";
            chai.request(server)
                .get('/api/v1/course/' + courseId + '/reports')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('data')
                    done();
                })
        })

        /**
        * Test the GET reports by course route with invalid route url
        */
        it('It should not GET reports by course route', (done) => {
            chai.request(server)
                .get('/api/v1/course/reports')
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        /**
        * Test the GET reports by course route when traceId not pass in header
        */
        it('It should not GET reports by course route', (done) => {
            let courseId = "996f8dfb-908b-458d-9c0d-aa974ff98976";
            chai.request(server)
                .get('/api/v1/course/' + courseId + '/reports')
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