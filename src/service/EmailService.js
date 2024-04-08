import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmailCreateOrder = async (email, cartItems) => {
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: process.env.MAIL_ACCOUNT,
			pass: process.env.MAIl_PASSWORD,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});
};

export const sendMailResetPassword = async (options) => {
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: process.env.MAIL_ACCOUNT,
			pass: process.env.MAIl_PASSWORD,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	const info = await transporter.sendMail({
		from: process.env.MAIL_HOST_NAME + process.env.MAIL_ACCOUNT,
		to: options.email,
		subject: 'Yêu cầu đặt lại mật khẩu',
		html: `
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
          <td>
            <h1>${options.subject}</h1>
			${options.message1}
            <p>${options.message2}</p>
            <p>
              <a style="cursor: pointer;" href="${options.resetURL}">
                <button style="padding: 10px; background-color: #4CAF50; color: white; border: none; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">
                  Đặt lại mật khẩu
                </button>
              </a>
            </p>
			<p>${options.message3}</p>
          </td>
        </tr>
      </table>
    `,
	});
};

export const sendMailActiveAccount = async (options) => {
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: process.env.MAIL_ACCOUNT,
			pass: process.env.MAIl_PASSWORD,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	const info = await transporter.sendMail({
		from: process.env.MAIL_HOST_NAME + process.env.MAIL_ACCOUNT,
		to: options.email,
		subject: options.subject,
		html: `
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
          <td>
            <h1>${options.subject} (${process.env.EMAIL_REGISTER_TEMP_EXPIRES} phút)</h1>
			${options.message1}
            <p>
              <a style="cursor: pointer;" href="${options.registerURL}">
                <button style="padding: 10px; background-color: #4CAF50; color: white; border: none; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">
                  Kích hoạt tài khoản
                </button>
              </a>
            </p>
			<p>${options.message2}</p>
          </td>
        </tr>
      </table>
    `,
	});
};
