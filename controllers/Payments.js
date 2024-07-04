const { instance } = require("../config/razorpay");
const Course = require("../models/Cars");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { default: mongoose } = require("mongoose");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");



// capture the payment and initiate Razorpay order

exports.capturePayment = async (req, res) => {

    try {

        // get course id and user id
        const { course_id } = req.body;
        const userId = req.user.id;

        // validation

        // valid Course Id
        if (!course_id) {
            return res.json({
                success: false,
                message: "Please provide valid course ID"
            })
        }
        // valid courseDetail
        let course;

        try {
            course = await Course.findById({ course_id });
            if (!course) {
                return res.json({
                    success: false,
                    message: "could not find the course"
                })
            }

            // is user already enrolled for same course
            // const uid = new mongoose.Types.ObjectId(userId);

            if (course.studentEnrolled.includes(userId)) {
                return res.json({
                    success: false,
                    message: "Student is already enrolled",
                })
            }

        } catch (error) {

            console.error(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }

        // create order
        const amount = course.price;
        const currency = "INR";

        const options = {
            amount: amount * 100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes: {
                courseId: course_id,
                userId,
            }
        };

        // initiate the payment using razorpay

        try {

            const paymentResponce = await instance.orders.create(options);
            console.log(paymentResponce);

            return res.status(200).json({
                success: true,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                thumbnail: course.courseThumbnail,
                orderId: paymentResponce.id,
                currency: paymentResponce.currency,
                amount: paymentResponce.amount

            });

        } catch (error) {
            console.log(error);
            return res.json({
                success: false,
                message: "could not initiate order"
            })

        }



    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }


};


// verify signature of razorpay and server

exports.verifySignature = async (req, res) => {
    const webhookSecret = "12345678"

    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webhookSecret);

    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (signature === digest) {
        console.log("Payment is Authorized");

        const { userId, courseId } = req.body.payload.payment.entity.notes;

        try {

            // find the course and enroll student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                {
                    $push: {
                        studentEnrolled: userId
                    },
                },
                { new: true });

            if (!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: "Course not found",
                });
            }

            console.log(enrolledCourse);

            // find the student and add the course to list of enrolled courses
            const enrolledStudent = await User.findOneAndUpdate(
                { _id: userId },
                {
                    $push: {
                        courses: courseId,
                    }
                },
                { new: true }
            );

            // send confirmation mail

            const emailResponce = await mailSender(
                enrolledStudent.email,
                "Congratulation from StuduNotion",
                "Congratulation, you are onboarded into new StudyNotion Course",
            )

            console.log(emailResponce);

            return res.status(200).json({
                success: true,
                message: "Signature Verifiesd and Course Added"
            })

        } catch (error) {

            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            })

        }


    }
    else {
        return res.status(400).json({
            success: false,
            message: "Invalid request"
        })
    }
}