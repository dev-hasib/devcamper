const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	auth: {
		// TODO: replace `user` and `pass` values from <https://forwardemail.net>
		user: process.env.SMTP_USERNAME,
		pass: process.env.SMTP_PASSWORD,
	},
});

const sendEmail = async (options) => {
	// send mail with defined transport object
	const message = {
		from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // sender address
		to: `${options.email}`, // list of receivers
		subject: options.subject, // Subject line
		text: `${options.txt}`, // plain text body
		html: `<h1>${options.txt}</h1><br><a>${options.html}</a>`, // html body
	};

	const info = await transporter.sendMail(message);

	console.log('Message sent: %s', info.messageId);
};

module.exports = { sendEmail };
