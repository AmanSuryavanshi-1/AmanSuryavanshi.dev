export const UserConfirmationTemplate = (name: string, message: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for contacting Aman Suryavanshi</title>
  <style>
    @media only screen and (max-width: 600px) {
      .header-text {
        font-size: 20px !important;
      }
      .subheader-text {
        font-size: 12px !important;
      }
      .container {
        margin-top: 20px !important;
        margin-bottom: 20px !important;
      }
      .content {
        padding: 20px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-top: 40px; margin-bottom: 40px;">
    
    <!-- Header -->
    <div style="background-color: #064e3b; padding: 30px 40px; text-align: center;">
      <img src="https://amansuryavanshi.me/Profile/PFP-Cricular.png" alt="Aman Suryavanshi" width="60" height="60" style="border-radius: 50%; display: block; margin: 0 auto 15px auto; border: 2px solid #84cc16;">
      <h1 class="header-text" style="color: #d1f3e4; margin: 0; font-size: 24px; font-weight: 600;">Aman Suryavanshi</h1>
      <p class="subheader-text" style="color: #84cc16; margin: 5px 0 0 0; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">AI Automation & Full Stack Developer</p>
    </div>

    <!-- Content -->
    <div class="content" style="padding: 40px;">
      <h2 style="color: #064e3b; margin-top: 0; font-size: 20px;">Hello ${name},</h2>
      <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
        Thank you for reaching out! I've received your message and appreciate you taking the time to contact me.
      </p>
      <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
        I typically respond within 24-48 hours. Here's a copy of what you sent:
      </p>
      
      <div style="background-color: #f0fdf4; border-left: 4px solid #84cc16; padding: 20px; border-radius: 4px;">
        <p style="margin: 0; color: #064e3b; font-style: italic;">"${message.replace(/\n/g, '<br>')}"</p>
      </div>

      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
        <a href="https://amansuryavanshi-dev.vercel.app/" style="display: inline-block; background-color: #064e3b; color: #d1f3e4; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; transition: background-color 0.3s;">Visit Portfolio</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #064e3b; padding: 20px; text-align: center;">
      <p style="color: #d1f3e4; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Aman Suryavanshi. All rights reserved.</p>
      <div style="margin-top: 10px;">
        <a href="https://github.com/AmanSuryavanshi-1" style="color: #84cc16; text-decoration: none; margin: 0 10px; font-size: 12px;">GitHub</a>
        <a href="https://www.linkedin.com/in/aman-suryavanshi-6b0aba347/" style="color: #84cc16; text-decoration: none; margin: 0 10px; font-size: 12px;">LinkedIn</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

export const AdminNotificationTemplate = (name: string, email: string, message: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  <style>
    @media only screen and (max-width: 600px) {
      .header-text {
        font-size: 20px !important;
      }
      .subheader-text {
        font-size: 12px !important;
      }
      .container {
        margin-top: 20px !important;
        margin-bottom: 20px !important;
      }
      .content {
        padding: 20px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-top: 40px; margin-bottom: 40px;">
    
    <!-- Header -->
    <div style="background-color: #84cc16; padding: 20px 40px; text-align: center;">
      <img src="https://amansuryavanshi.me/Profile/PFP-Cricular.png" alt="Aman Suryavanshi" width="50" height="50" style="border-radius: 50%; display: block; margin: 0 auto 10px auto; border: 2px solid #064e3b;">
      <h1 class="header-text" style="color: #064e3b; margin: 0; font-size: 22px; font-weight: 700;">New Contact Submission</h1>
      <p class="subheader-text" style="color: #064e3b; margin: 5px 0 0 0; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">Portfolio Inquiry</p>
    </div>

    <!-- Content -->
    <div class="content" style="padding: 40px;">
      <div style="margin-bottom: 25px;">
        <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">From</p>
        <p style="color: #111827; font-size: 16px; font-weight: 600; margin: 0;">${name}</p>
        <a href="mailto:${email}" style="color: #064e3b; text-decoration: none; font-size: 14px;">${email}</a>
      </div>

      <div style="margin-bottom: 25px;">
        <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Message</p>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
          <p style="color: #374151; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
        <span style="color: #9ca3af; font-size: 12px;">${new Date().toLocaleString()}</span>
        <a href="mailto:${email}" style="background-color: #064e3b; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 500;">Reply via Email</a>
      </div>
    </div>
  </div>
</body>
</html>
`;
