const transport = require("./sendMail.js");

exports.welcomeMail = async (userName) => {
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