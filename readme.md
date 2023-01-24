# Node.js Express Boilerplate
 *Node.js Express Boilerplate* is a **starter kit**. This project is a very simple and useful for implementing projects with the microservice architecture

## Technologies 

- Axios 
- Chai 
- Dotenv
- Express
- Jsonwebtoken
- Moment
- Morgan
- Nodemailer
- Razorpay
- Twilio
- UUID
- Winston
- Swagger

## Installation

## Pre-requisite

- [Node.js](https://nodejs.org/) v10+ to run.
- Postgresql database

# How to run ?

### Step 1 :

Clone the repo and create `.env` file in respective directory. Contents of file should be

```txt
PORT=3001
NODE_ENV=development
JWT_SECRET=<Secret-key >
TOKEN_EXPIRY=7d
SESSION_EXPIRY_IN_DAYS=7
MOCK_OTP_LOGIN=true <Include if mock OTP login is needed>
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILLIO_SERVICE_ID
DB_URL=postgres://postgres:Pass2020!@localhost:5432/hue-tech
PROJECT_NAME=Learn Space
RAZOR_PAY_KEY_ID=
RAZOR_PAY_KEY_SECRET=
SUBSCRIPTION_TOTAL_COUNT=12
SUBSCRIPTION_UNIT_COUNT=12
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
EMAIL_HOST= <email hosting name for send mail>
EMAIL_USER= <email user name>
EMAIL_PASSWORD= <email password>
MAIL_ADDRESS= <email for send mail>
LOGGER_LEVEL= <error, warn, info, http, verbose, debug>
```

### Step 2 :

Then, install the dependencies and devDependencies and start the server.

```sh
- install node modules
npm i

- start server
npm run dev
```

## Unit test case coverage command

```sh
npm test -- --coverage
```
