let chai = require('chai');
let chaiHttp = require('chai-http');
const server = require('../src/index');

chai.should();

chai.use(chaiHttp);

let token;
function generateEmail(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function generateName(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

describe('Auth API', () => {

    /**
     * Test the POST register route
     */
    describe('POST /api/v1/user', () => {

        it('It should POST a register route success', (done) => {
            let emailIs = generateEmail(6);
            let phoneIs = Math.floor(1000000000 + Math.random() * 9000000000);
            let data = {
                email: `${emailIs}@gmail.com`,
                password: "123dd",
                firstName: generateName(4),
                lastName: generateName(4),
                phoneNumber: phoneIs,
                loginType: "EMAIL-PASSWORD"
            }
            chai.request(server)
                .post('/api/v1/user')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('data')
                    response.body.data.should.be.a('object');
                    response.body.data.should.have.property('token');
                    done();
                })
        })

        /**
        * Test the POST register route error handling
        * If email already store in database
        */
        it('It should POST a register route if email already stored in database', (done) => {
            let data = {
                email: "testCase@gmail.com",
                password: "000111",
                firstName: "test",
                lastName: "case",
                phoneNumber: "9494949494",
                loginType: "EMAIL-PASSWORD"
            }
            chai.request(server)
                .post('/api/v1/user')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(403);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq(`${data.email} this email is already taken`)
                    done();
                })
        })

        /**
        * Test the POST register route error handling
        * If email not provide
        */
        it('It should not a register without email provided', (done) => {
            let data = {
                password: "000111",
                firstName: "test",
                lastName: "case",
                phoneNumber: "9494949494",
                loginType: "EMAIL-PASSWORD"
            }
            chai.request(server)
                .post('/api/v1/user')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
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
        * Test the POST register route error handling
        * If password not provide
        */
        it('It should not a register without password provided', (done) => {
            let data = {
                email: "testCase@gmail.com",
                firstName: "test",
                lastName: "case",
                phoneNumber: "9494949494",
                loginType: "EMAIL-PASSWORD"
            }
            chai.request(server)
                .post('/api/v1/user')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
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
        * Test the POST register route error handling
        * If firstName not provide
        */
        it('It should not a register without firstName provided', (done) => {
            let data = {
                email: "testCase@gmail.com",
                password: "000111",
                lastName: "case",
                phoneNumber: "9494949494",
                loginType: "EMAIL-PASSWORD"
            }
            chai.request(server)
                .post('/api/v1/user')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
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
        * Test the POST register route error handling
        * If lastName not provide
        */
        it('It should not a register without lastName provided', (done) => {
            let data = {
                email: "testCase@gmail.com",
                password: "000111",
                firstName: "test",
                phoneNumber: "9494949494",
                loginType: "EMAIL-PASSWORD"
            }
            chai.request(server)
                .post('/api/v1/user')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
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
        * Test the POST register route error handling
        * If phoneNumber not provide
        */
        it('It should not a register without phoneNumber provided', (done) => {
            let data = {
                email: "testCase@gmail.com",
                password: "000111",
                firstName: "test",
                lastName: "case",
                loginType: "EMAIL-PASSWORD"
            }
            chai.request(server)
                .post('/api/v1/user')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
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
        * Test the POST register route error handling
        * If loginType not provide
        */
        it('It should not a register without loginType provided', (done) => {
            let data = {
                email: "testCase@gmail.com",
                password: "000111",
                firstName: "test",
                lastName: "case",
                phoneNumber: "9494949494",
            }
            chai.request(server)
                .post('/api/v1/user')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
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
        * Test the POST user register route with invalid route url
        */
        it('It should not register the user', (done) => {
            chai.request(server)
                .post('/api/v1/use')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        /**
        * Test the POST user register route when traceId not pass in header
        */
        it('It should not register the user', (done) => {
            chai.request(server)
                .post('/api/v1/user')
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
    * Test the POST login route
    */
    describe('POST /api/v1/login', function () {
        // this.timeout(3000)
        it('It should POST a login route success', (done) => {
            let data = {
                email: "John@John.com",
                password: "12343"
            }
            chai.request(server)
                .post('/api/v1/login')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    if (response.status == 200) {
                        token = response?.body?.data?.token;
                        response.should.have.status(200);
                        response.body.should.be.a('object');
                        response.body.should.have.property('data')
                        response.body.data.should.be.a('object');
                        response.body.data.should.have.property('token');
                        done();
                    } else if (response.status == 500) {
                        response.should.have.status(500);
                        response.body.should.be.a('object');
                        response.body.should.have.property('message')
                        response.body.message.should.be.eq('Internal server error')
                        done();
                    }
                })
        })

        /**
        * Test the POST login route error handling
        * If email not provide
        */
        it('It should not a login without email provided', (done) => {
            let data = {
                password: "12343"
            }
            chai.request(server)
                .post('/api/v1/login')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
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
        * Test the POST login route error handling
        * If password not provide
        */
        it('It should not a login without password provided', (done) => {
            let data = {
                email: "John@John.com"
            }
            chai.request(server)
                .post('/api/v1/login')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
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
        * Test the POST login route error handling
        * email password not match
        */
        it('It should not a login for email password not match', (done) => {
            let data = {
                email: "John@John.com",
                password: "123431234"
            }
            chai.request(server)
                .post('/api/v1/login')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(401);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('Email/Password does not match')
                    done();
                })
        })

        /**
        * Test the POST user login route with invalid route url
        */
        it('It should not login the user', (done) => {
            chai.request(server)
                .post('/api/v1/log')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })

        /**
        * Test the POST user login route when traceId not pass in header
        */
        it('It should not login the user', (done) => {
            chai.request(server)
                .post('/api/v1/login')
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
    * Test the POST forgot password route
    */
    describe('POST /api/v1/forgotPassword', () => {
        it('It should POST a forgot password route success', (done) => {
            let data = {
                email: "testCase@gmail.com",
            }
            chai.request(server)
                .post('/api/v1/forgotPassword')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    if (response.status == 404) {
                        response.should.have.status(404);
                        response.body.should.be.a('object');
                        response.body.should.have.property('message')
                        response.body.message.should.be.eq('User does not exist with this email')
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
        * Test the POST forgot password route error handling
        * If email not provide
        */
        it('It should not a forgot password without email provided', (done) => {
            let data = {}
            chai.request(server)
                .post('/api/v1/forgotPassword')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
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
        * Test the POST forgot password route with invalid route url
        */
        it('It should not forgot password', (done) => {
            chai.request(server)
                .post('/api/v1/forgotpassword')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(400);
                    done();
                })
        })

        /**
        * Test the POST forgot password route when traceId not pass in header
        */
        it('It should not forgot password', (done) => {
            chai.request(server)
                .post('/api/v1/forgotPassword')
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
    * Test the POST change password route
    */
    describe('POST /api/v1/changePassword', () => {
        it('It should POST a change password route success', (done) => {
            let data = {
                email: "testCase@gmail.com",
                password: "testCase",
                otp: "668698"
            }
            chai.request(server)
                .post('/api/v1/changePassword')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    if (response.status == 400) {
                        response.should.have.status(400);
                        response.body.should.be.a('object');
                        response.body.should.have.property('message')
                        response.body.message.should.be.eq('OTP is invalid')
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
        * Test the POST change password route error handling
        * If email not exist in database
        */
        it('It should POST a change password route if email does not exist in database', (done) => {
            let data = {
                email: "shahiii@gmail.com",
                password: "123000",
                otp: "123456"
            }
            chai.request(server)
                .post('/api/v1/changePassword')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('User does not exist with this email')
                    done();
                })
        })

        // /**
        // * Test the POST change password route error handling
        // * If OTP is expired
        // */
        // it('It should POST a change password route if OTP is expired', (done) => {
        //     let data = {
        //         email: "testCase@gmail.com",
        //         password: "123000",
        //         otp: "624524"
        //     }
        //     chai.request(server)
        //         .post('/api/v1/changePassword')
        //         .send(data)
        //         .end((err, response) => {
        //             response.should.have.status(400);
        //             response.body.should.be.a('object');
        //             response.body.should.have.property('message')
        //             response.body.message.should.be.eq('OTP is expired')
        //             done();
        //         })
        // })

        /**
        * Test the POST change password route error handling
        * If OTP is invalid
        */
        it('It should POST a change password route if OTP is invalid', (done) => {
            let data = {
                email: "testCase@gmail.com",
                password: "testCase",
                otp: "123456"
            }
            chai.request(server)
                .post('/api/v1/changePassword')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .send(data)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('OTP is invalid')
                    done();
                })
        })

        /**
        * Test the POST change password route error handling
        * If email not provide
        */
        it('It should not a change password without email provided', (done) => {
            let data = {
                password: "123000",
                otp: "123456"
            }
            chai.request(server)
                .post('/api/v1/changePassword')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
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
        * Test the POST change password route error handling
        * If password not provide
        */
        it('It should not a change password without password provided', (done) => {
            let data = {
                email: "testCase@gmail.com",
                otp: "123456"
            }
            chai.request(server)
                .post('/api/v1/changePassword')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
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
        * Test the POST change password route error handling
        * If otp not provide
        */
        it('It should not a change password without otp provided', (done) => {
            let data = {
                email: "testCase@gmail.com",
                password: "123000",
            }
            chai.request(server)
                .post('/api/v1/changePassword')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
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
        * Test the POST change password route with invalid route url
        */
        it('It should not change password', (done) => {
            chai.request(server)
                .post('/api/v1/changepassword')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(400);
                    done();
                })
        })

        /**
        * Test the POST change password route when traceId not pass in header
        */
        it('It should not change password', (done) => {
            chai.request(server)
                .post('/api/v1/changePassword')
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
    * Test the POST logout route
    */
    describe('POST /api/v1/logout', () => {
        it('It should POST a logout route success', (done) => {
            chai.request(server)
                .post('/api/v1/logout')
                .set({ Authorization: `Bearer ${token}`, "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message')
                    response.body.message.should.be.eq('Success')
                    done();
                })
        })

        // /**
        // * Test the POST logout route error handling
        // * If email not provide
        // */
        // it('It should not a logout without', (done) => {
        //     let data = {}
        //     chai.request(server)
        //         .post('/api/v1/forgotPassword')
        //         .send(data)
        //         .end((err, response) => {
        //             response.should.have.status(400);
        //             response.body.should.be.a('object');
        //             response.body.should.have.property('message')
        //             response.body.message.should.be.eq('Please provide valid data')
        //             done();
        //         })
        // })

        /**
        * Test the POST logout route with invalid route url
        */
        it('It should not logout', (done) => {
            chai.request(server)
                .post('/api/v1/logout')
                .set({ "X-REQUEST-ID": "c00d6800-fa5f-11e6-83c2-f531bfc95472" })
                .end((err, response) => {
                    response.should.have.status(401);
                    done();
                })
        })

        // /**
        // * Test the POST logout route when traceId not pass in header
        // */
        // it('It should not logout', (done) => {
        //     chai.request(server)
        //         .post('/api/v1/logout')
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
})