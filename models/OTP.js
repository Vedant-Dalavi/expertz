const mongoose = require('mongoose');
// const mailSender = require('../utils/mailSender');
// const emailTemplate = require("../mail/templates/emailVerificationTemplate")

const OTPSchema = new mongoose.Schema({
    phoneNo: {
        type: String,
        required: true,
        trim: true
    },
    otp: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60,
    }
})


// to send email

// async function sendVerificationEmail(email, otp) {

//     try {
//         const mailResponse = await mailSender(
//             email,
//             "Verification Email",
//             emailTemplate(otp)
//         );
//         console.log("Email sent successfully: ", mailResponse.response);
//     } catch (error) {
//         console.log("Error occurred while sending email: ", error);
//         throw error;
//     }

// }

// OTPSchema.pre("save", async function (next) {
//     await sendVerificationEmail(this.email, this.otp);
//     next();
// })

module.exports = mongoose.model('OTP', OTPSchema);