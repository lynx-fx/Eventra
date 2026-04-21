const transport = require("./sendMail.js");

const baseStyles = `
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #1f2937;
  max-width: 600px;
  margin: 0 auto;
  padding: 0;
  background-color: #f9fafb;
`;

const containerStyles = `
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-top: 20px;
  margin-bottom: 20px;
`;

const headerStyles = `
  padding: 40px 20px;
  text-align: center;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: #ffffff;
`;

const contentStyles = `
  padding: 32px;
`;

const footerStyles = `
  padding: 24px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
  border-top: 1px solid #f3f4f6;
`;

const buttonStyles = `
  display: inline-block;
  padding: 14px 28px;
  background-color: #6366f1;
  color: #ffffff;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  margin: 20px 0;
  box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
`;

const detailsGrid = `
  background-color: #f3f4f6;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
`;

const formatDetails = (details) => {
  return details.map(d => `
    <div style="margin-bottom: 12px;">
      <span style="font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">${d.label}</span>
      <div style="font-size: 15px; color: #111827; font-weight: 500;">${d.value}</div>
    </div>
  `).join('');
};

exports.welcomeMail = async (userName, email, verificationLink) => {
  let mail = await transport.sendMail({
    from: `"Eventra" <${process.env.EMAIL}>`,
    to: email,
    subject: "Welcome to Eventra! ✨",
    html: `
      <div style="${baseStyles}">
        <div style="${containerStyles}">
          <div style="${headerStyles}">
            <h1 style="margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">Welcome to Eventra</h1>
            <p style="margin-top: 8px; opacity: 0.9; font-size: 16px;">The ultimate platform for amazing events</p>
          </div>
          <div style="${contentStyles}">
            <h2 style="margin-top: 0; font-size: 20px; font-weight: 700;">Hi ${userName},</h2>
            <p>We're thrilled to have you join our vibrant community! Eventra is where experiences come to life, and we're excited to help you find your next unforgettable moment.</p>
            <p>To get started, please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${verificationLink}" style="${buttonStyles}">Verify My Account</a>
            </div>
            <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">If the button doesn't work, you can copy and paste this link into your browser:<br>
            <span style="color: #6366f1; word-break: break-all;">${verificationLink}</span></p>
          </div>
          <div style="${footerStyles}">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Eventra. All rights reserved.</p>
            <p style="margin-top: 8px; font-size: 12px;">You received this because you signed up for an Eventra account.</p>
          </div>
        </div>
      </div>
    `,
  });

  return mail;
};

exports.forgotPasswordMail = async (email, link) => {
  let mail = await transport.sendMail({
    from: `"Eventra Support" <${process.env.EMAIL}>`,
    to: email,
    subject: "Reset Your Password - Eventra",
    html: `
      <div style="${baseStyles}">
        <div style="${containerStyles}">
          <div style="${headerStyles}; background: #1f2937;">
            <h1 style="margin: 0; font-size: 24px;">Reset Your Password</h1>
          </div>
          <div style="${contentStyles}">
            <p>You recently requested to reset your password for your Eventra account. No worries, it happens to the best of us!</p>
            <p>Click the button below to choose a new password. This link will expire in 10 minutes for your security.</p>
            <div style="text-align: center;">
              <a href="${link}" style="${buttonStyles}; background-color: #1f2937;">Reset Password</a>
            </div>
            <p>If you didn't request this change, please ignore this email or contact support if you have concerns.</p>
          </div>
          <div style="${footerStyles}">
            <p>&copy; ${new Date().getFullYear()} Eventra Support</p>
          </div>
        </div>
      </div>
    `,
  });

  return mail;
};

exports.eventApprovedMail = async (userName, email, eventDetails) => {
  const { title, eventDate, venue, city, bannerImage } = eventDetails;
  
  let mail = await transport.sendMail({
    from: `"Eventra Team" <${process.env.EMAIL}>`,
    to: email,
    subject: `Success! "${title}" is now LIVE! 🚀`,
    html: `
      <div style="${baseStyles}">
        <div style="${containerStyles}">
          <div style="height: 200px; background: url('${bannerImage || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4'}') center/cover no-repeat;">
            <div style="height: 100%; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; text-align: center;">
               <h1 style="color: #ffffff; padding: 0 20px; font-size: 24px; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${title}</h1>
            </div>
          </div>
          <div style="${contentStyles}">
            <div style="display: inline-block; background-color: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px;">Verified & Approved</div>
            <h2 style="margin-top: 0; color: #111827;">Your event is live!</h2>
            <p>Great news, ${userName}! Your event has been approved and is now visible to thousands of potential attendees on Eventra.</p>
            
            <div style="${detailsGrid}">
              ${formatDetails([
                { label: 'Event Date', value: new Date(eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                { label: 'Location', value: `${venue}, ${city}` }
              ])}
            </div>

            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL}/events" style="${buttonStyles}">View Your Event Page</a>
            </div>
          </div>
          <div style="${footerStyles}">
            <p>Good luck with your event! Let us know if you need any help promote it.</p>
            <p style="margin-top: 8px;">&copy; ${new Date().getFullYear()} Eventra for Organizers</p>
          </div>
        </div>
      </div>
    `,
  });

  return mail;
};

exports.ticketConfirmationMail = async (userName, email, ticketDetails) => {
  const { title, eventDate, venue, city, ticketLink, ticketId, ticketType, seatCount, bannerImage, price } = ticketDetails;

  let mail = await transport.sendMail({
    from: `"Eventra Tickets" <${process.env.EMAIL}>`,
    to: email,
    subject: `Your Tickets are Confirmed! 🎫 ${title}`,
    html: `
      <div style="${baseStyles}">
        <div style="${containerStyles}">
          <div style="height: 180px; background: url('${bannerImage}') center/cover no-repeat;"></div>
          <div style="${contentStyles}">
            <h1 style="margin-top: 0; font-size: 24px; color: #111827;">You're going to ${title}!</h1>
            <p>Hi ${userName}, your order is confirmed. Get ready for an amazing experience!</p>
            
            <div style="${detailsGrid}">
              ${formatDetails([
                { label: 'Event Title', value: title },
                { label: 'Date', value: new Date(eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                { label: 'Location', value: `${venue}, ${city}` },
                { label: 'Ticket Type', value: `${ticketType} (${seatCount} Seats)` },
                { label: 'Total Paid', value: `$${price}` },
                { label: 'Order ID', value: ticketId }
              ])}
            </div>

            <div style="text-align: center; background-color: #ec4899; padding: 20px; border-radius: 16px; color: #ffffff;">
              <p style="margin: 0 0 10px 0; font-weight: 600;">Access your digital tickets</p>
              <a href="${ticketLink}" style="${buttonStyles}; background-color: #ffffff; color: #ec4899; margin: 0; box-shadow: none;">Show Tickets</a>
            </div>
            
            <p style="margin-top: 24px; font-size: 14px; text-align: center; color: #6b7280;">Simply show the QR code at the entrance to gain entry.</p>
          </div>
          <div style="${footerStyles}">
            <p>Enjoy the show!</p>
            <p>&copy; ${new Date().getFullYear()} Eventra Tickets</p>
          </div>
        </div>
      </div>
    `,
  });

  return mail;
};

exports.eventRejectedMail = async (userName, email, eventName, reason = "It did not meet our community guidelines.") => {
  let mail = await transport.sendMail({
    from: `"Eventra Team" <${process.env.EMAIL}>`,
    to: email,
    subject: `Update regarding your event submission`,
    html: `
      <div style="${baseStyles}">
        <div style="${containerStyles}">
          <div style="${headerStyles}; background: #ef4444;">
             <h1 style="margin: 0; font-size: 24px;">Submission Update</h1>
          </div>
          <div style="${contentStyles}">
            <h2 style="margin-top: 0;">Hi ${userName},</h2>
            <p>Thank you for submitting your event <strong>${eventName}</strong>. Our team has reviewed your submission.</p>
            <p>Unfortunately, we are unable to approve your event at this time.</p>
            
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0;">
              <p style="margin: 0; color: #991b1b; font-weight: 600;">Reason for rejection:</p>
              <p style="margin: 8px 0 0 0; color: #b91c1c;">${reason}</p>
            </div>

            <p>You can edit your event details and resubmit for review through your dashboard.</p>
          </div>
          <div style="${footerStyles}">
            <p>&copy; ${new Date().getFullYear()} Eventra Organizers</p>
          </div>
        </div>
      </div>
    `,
  });

  return mail;
};

exports.eventCancelledBuyerMail = async (userName, email, eventName) => {
  let mail = await transport.sendMail({
    from: `"Eventra Support" <${process.env.EMAIL}>`,
    to: email,
    subject: `URGENT: Event Cancelled - ${eventName}`,
    html: `
      <div style="${baseStyles}">
        <div style="${containerStyles}">
          <div style="${headerStyles}; background: #111827;">
             <h1 style="margin: 0; font-size: 24px; color: #ef4444;">Event Cancelled</h1>
          </div>
          <div style="${contentStyles}">
            <h2 style="margin-top: 0;">Important Update</h2>
            <p>Hi ${userName}, we're writing to let you know that <strong>${eventName}</strong> has been cancelled by the organizers.</p>
            
            <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-weight: 600;">What happens next?</p>
              <p style="margin: 8px 0 0 0; color: #b45309;">A full refund has been initiated and will be credited back to your original payment method within 5-10 business days.</p>
            </div>

            <p>We apologize for this disappointment. We hope to see you at another event soon!</p>
          </div>
          <div style="${footerStyles}">
             <a href="${process.env.CLIENT_URL}" style="color: #6366f1; text-decoration: none; font-weight: 600;">Browse Other Events</a>
             <p style="margin-top: 16px;">&copy; ${new Date().getFullYear()} Eventra Support</p>
          </div>
        </div>
      </div>
    `,
  });

  return mail;
};