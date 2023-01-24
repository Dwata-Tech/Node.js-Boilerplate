require("dotenv").config();
const twilio = require("twilio");
const nodemailer = require('nodemailer')
const option = {
   // service: "amazonaws",
   host: process.env.EMAIL_HOST,
   port: 465,
   tls: {
      rejectUnauthorized: false
   },
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
   }
}
const transPorter = nodemailer.createTransport(option)

function sendEmailOTP(recepientEmail, emailSubject, messageString) {
   return new Promise(async (resolve, reject) => {
      try {
         const mailOptions = {
            from: process.env.SPIRIT_TRAVELER_EMAIL_VERIFICATION_ADDRESS,
            to: recepientEmail,
            subject: emailSubject,
            html: messageString
         }
         await transPorter.sendMail(mailOptions, function (error, response) {
            if (error) {
               reject(error)
            } else {
               resolve(true)
               // resolve(`Email has been sent to ${user.email}, kindly follow the instructions`)
            }
         });
      } catch (error) {
         reject(false)
      }
   })
}


module.exports.sendEmailOTP = sendEmailOTP