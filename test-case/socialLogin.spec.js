// let chai = require('chai');
// let chaiHttp = require('chai-http');
// const server = require('../src/index');

// chai.should();

// chai.use(chaiHttp);

// let token;

// describe('Social login API', () => {

//     /**
//      * Test the POST google login route
//      */
//     describe('POST /api/v1/register/google', () => {
//         it('It should POST a google register or login route success', (done) => {
//             let data = {
//                 accessToken: "",
//             }
//             chai.request(server)
//                 .post('/api/v1/register/google')
//                 .send(data)
//                 .end((err, response) => {
//                     response.should.have.status(200);
//                     response.body.should.be.a('object');
//                     response.body.should.have.property('data')
//                     response.body.data.should.be.a('object');
//                     response.body.data.should.have.property('token');
//                     done();
//                 })
//         })

//         /**
//         * Test the POST google login or register route error handling
//         * If accessToken not provide
//         */
//         it('It should POST a google login or register for not provided the accessToken', (done) => {
//             let data = {}
//             chai.request(server)
//                 .post('/api/v1/register/google')
//                 .send(data)
//                 .end((err, response) => {
//                     response.should.have.status(400);
//                     response.body.should.be.a('object');
//                     response.body.should.have.property('message')
//                     response.body.message.should.be.eq('Please provide valid data')
//                     done();
//                 })
//         })

//         /**
//         * Test the POST user google login or register route with invalid route url
//         */
//         it('It should not google login or register the user', (done) => {
//             chai.request(server)
//                 .post('/api/v1/google')
//                 .end((err, response) => {
//                     response.should.have.status(404);
//                     done();
//                 })
//         })

//     })

//     /**
//      * Test the POST linkedin login route
//      */
//     describe('POST /api/v1/register/linkedin', () => {
//         it('It should POST a linkedin register or login route success', (done) => {
//             let data = {
//                 accessToken: "",
//             }
//             chai.request(server)
//                 .post('/api/v1/register/linkedin')
//                 .send(data)
//                 .end((err, response) => {
//                     response.should.have.status(200);
//                     response.body.should.be.a('object');
//                     response.body.should.have.property('data')
//                     response.body.data.should.be.a('object');
//                     response.body.data.should.have.property('token');
//                     done();
//                 })
//         })

//         /**
//         * Test the POST linkedin login or register route error handling
//         * If accessToken not provide
//         */
//         it('It should POST a linkedin login or register for not provided the accessToken', (done) => {
//             let data = {}
//             chai.request(server)
//                 .post('/api/v1/register/linkedin')
//                 .send(data)
//                 .end((err, response) => {
//                     response.should.have.status(400);
//                     response.body.should.be.a('object');
//                     response.body.should.have.property('message')
//                     response.body.message.should.be.eq('Please provide valid data')
//                     done();
//                 })
//         })

//         /**
//         * Test the POST user linkedin login or register route with invalid route url
//         */
//         it('It should not linkedin login or register the user', (done) => {
//             chai.request(server)
//                 .post('/api/v1/linkedin')
//                 .end((err, response) => {
//                     response.should.have.status(404);
//                     done();
//                 })
//         })

//     })

//     /**
//      * Test the POST facebook login route
//      */
//     describe('POST /api/v1/register/facebook', () => {
//         it('It should POST a facebook register or login route success', (done) => {
//             let data = {
//                 accessToken: "",
//             }
//             chai.request(server)
//                 .post('/api/v1/register/facebook')
//                 .send(data)
//                 .end((err, response) => {
//                     response.should.have.status(200);
//                     response.body.should.be.a('object');
//                     response.body.should.have.property('data')
//                     response.body.data.should.be.a('object');
//                     response.body.data.should.have.property('token');
//                     done();
//                 })
//         })

//         /**
//         * Test the POST register route error handling
//         * If accessToken not provide
//         */
//         it('It should POST a facebook login or register for not provided the accessToken', (done) => {
//             let data = {}
//             chai.request(server)
//                 .post('/api/v1/register/facebook')
//                 .send(data)
//                 .end((err, response) => {
//                     response.should.have.status(400);
//                     response.body.should.be.a('object');
//                     response.body.should.have.property('message')
//                     response.body.message.should.be.eq('Please provide valid data')
//                     done();
//                 })
//         })

//         /**
//         * Test the POST user facebook login or register route with invalid route url
//         */
//         it('It should not facebook login or register the user', (done) => {
//             chai.request(server)
//                 .post('/api/v1/facebook')
//                 .end((err, response) => {
//                     response.should.have.status(404);
//                     done();
//                 })
//         })

//     })
// })