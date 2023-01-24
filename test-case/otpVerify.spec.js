let chai = require('chai');
let chaiHttp = require('chai-http');
const server = require('../src/index');

chai.should();

chai.use(chaiHttp);

let token;
let otp = 0;
describe('Verify user detail API', () => {

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
     * Test the POST send OTP route
     */
    describe('POST /api/v1/sendOTP', () => {

        /**
        * Test the POST send OTP route for verify email
        */
        it('It should POST route for send OTP to verify email success', (done) => {
            let data = {
                type: "VERIFY_EMAIL"
            }
            chai.request(server)
                .post('/api/v1/sendOTP')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    otp = response.body.message.split(" ")[3];
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message');
                    done();
                })
        })

        /**
        * Test the POST send OTP route
        * empty req.body
        */
        it('It should not send OTP without pass the req.body', (done) => {
            let data = {}
            chai.request(server)
                .post('/api/v1/sendOTP')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message');
                    done();
                })
        })

        /**
        * Test the POST send OTP route with invalid route url
        */
        it('It should not send the otp', (done) => {
            chai.request(server)
                .post('/api/v1/sendotp')
                .end((err, response) => {
                    response.should.have.status(401);
                    done();
                })
        })

        /**
        * Test the POST send OTP route when traceId not pass in header
        */
        it('It should not send the otp', (done) => {
            chai.request(server)
                .post('/api/v1/sendOTP')
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
     * Test the POST verify OTP route
     */
    describe('POST /api/v1/verifyOTP', () => {

        /**
        * Test the POST verify OTP route for verify email
        */
        it('It should POST route for verify OTP to verify email success', (done) => {
            let data = {
                otp: otp,
                type: "VERIFY_EMAIL"
            }
            chai.request(server)
                .post('/api/v1/verifyOTP')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message');
                    response.body.message.should.be.eq('Success');
                    done();
                })
        })

        /**
        * Test the POST verify OTP route
        * if otp not provide
        */
        it('It should not a verify otp without otp provided', (done) => {
            let data = {
                type: "VERIFY_EMAIL"
            }
            chai.request(server)
                .post('/api/v1/verifyOTP')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message');
                    done();
                })
        })

        /**
        * Test the POST verify OTP route
        * if type not provide
        */
        it('It should not a verify otp without type provided', (done) => {
            let data = {
                otp: otp
            }
            chai.request(server)
                .post('/api/v1/verifyOTP')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message');
                    done();
                })
        })

        /**
        * Test the POST verify OTP route with invalid route url
        */
        it('It should not verify the otp', (done) => {
            chai.request(server)
                .post('/api/v1/verifyOTP')
                .end((err, response) => {
                    response.should.have.status(401);
                    done();
                })
        })

        /**
        * Test the POST verify OTP route when traceId not pass in header
        */
        it('It should not verify the otp', (done) => {
            chai.request(server)
                .post('/api/v1/verifyOTP')
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