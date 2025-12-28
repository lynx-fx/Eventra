const transport = require("./sendMail.js");

exports.welcomeMail = async (userName, email) => {
  let mail = await transport.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Welcome to Eventra!",
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 500px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);"> 
        <h2 style="color: #333; text-align: center;">Welcome to Eventra!</h2>
        <p style="color: #555;">Hi ${userName},</p>
        <p style="color: #555;">Thank you for signing up! We're excited to have you on board.</p>
        <hr style="border: none; border-top: 1px solid #ddd;">
        <p style="color: #777; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Eventra. All rights reserved.</p>
      </div>
    </div>
  `,
  });

  if (mail.accepted.length <= 0) {
    console.log("Signup mail not sent.");
  }

  return mail;
}

exports.forgotPasswordMail = async (email, link) => {
  let mail = await transport.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Reset Your Password",
    html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 500px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);"> 
            <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
            <p style="color: #555;">You requested a password reset. Click the button below to reset your password. This link will expire in <strong>10 minutes</strong>.</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${link}" 
                 style="background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">
                 Reset Password
              </a>
            </div>
            <p style="color: #555;">If you didn’t request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #ddd;">
            <p style="color: #777; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Eventra. All rights reserved.</p>
          </div>
        </div>
      `,
  });

  if (mail.accepted.length <= 0) {
    console.log("Signup mail not sent.");
  }

  return mail;
}