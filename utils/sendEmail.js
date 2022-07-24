const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            // host: process.env.HOST,
            service: process.env.EMAILSERVICE,
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAILUSER,
                pass: process.env.EMAILPASS,
            },
        });

        await transporter.sendMail({
            from: `${process.env.NAME} <${process.env.EMAIL}>`,
            to: email,
            subject,
            html,
            attachments: [
                {
                    filename: 'logo.png',
                    path: `${__dirname}/html/handshake.png`,
                    cid: 'unique@cid',
                },
            ],
        });
        console.log('email sent sucessfully');
    } catch (error) {
        console.log('email not sent');
        console.log(error);
    }
};

module.exports = sendEmail;
