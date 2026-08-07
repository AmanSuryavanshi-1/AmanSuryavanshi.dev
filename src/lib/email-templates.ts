export const UserConfirmationTemplate = (name: string, message: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for contacting Aman Suryavanshi</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; -webkit-font-smoothing: antialiased; }
    table { border-spacing: 0; border-collapse: collapse; }
    td { padding: 0; }
    img { border: 0; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #f3f4f6; padding-bottom: 40px; }
    .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { padding: 40px 20px; background-color: #064e3b; text-align: center; }
    .content { padding: 40px 30px; background-color: #ffffff; }
    .footer { padding: 20px; background-color: #111827; text-align: center; }
    @media screen and (max-width: 600px) {
      .content { padding: 30px 20px !important; }
      .main { border-radius: 0 !important; }
    }
  </style>
</head>
<body>
  <center class="wrapper">
    <div style="padding: 20px 0;">
      <table class="main" width="100%">
        <tr>
          <td class="header">
            <img src="https://amansuryavanshi.me/Profile/PFP-Cricular.webp" alt="Aman Suryavanshi" width="70" height="70" style="border-radius: 50%; border: 3px solid #84cc16; margin-bottom: 15px;">
            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Aman Suryavanshi</h1>
            <p style="margin: 8px 0 0 0; color: #84cc16; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">AI Automation & Full Stack Developer</p>
          </td>
        </tr>
        <tr>
          <td class="content">
            <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 20px; font-weight: 600;">Hello \${name},</h2>
            <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
              Thank you for reaching out! I've received your message and appreciate you taking the time to contact me.
            </p>
            <p style="margin: 0 0 25px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
              I typically respond within 24-48 hours. Here's a copy of what you sent:
            </p>
            
            <table width="100%">
              <tr>
                <td style="background-color: #f9fafb; border-left: 4px solid #84cc16; padding: 20px; border-radius: 0 8px 8px 0;">
                  <p style="margin: 0; color: #374151; font-size: 15px; font-style: italic; line-height: 1.6;">"\${message.replace(/\\n/g, '<br>')}"</p>
                </td>
              </tr>
            </table>

            <table width="100%" style="margin-top: 35px;">
              <tr>
                <td align="center">
                  <a href="https://amansuryavanshi.me" style="background-color: #064e3b; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-size: 16px; font-weight: 600; display: inline-block;">Visit Portfolio</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td class="footer">
            <p style="margin: 0 0 12px 0; color: #9ca3af; font-size: 12px;">&copy; \${new Date().getFullYear()} Aman Suryavanshi. All rights reserved.</p>
            <p style="margin: 0; font-size: 12px;">
              <a href="https://github.com/AmanSuryavanshi-1" style="color: #84cc16; text-decoration: none; margin: 0 8px;">GitHub</a>
              <span style="color: #4b5563;">|</span>
              <a href="https://www.linkedin.com/in/amansuryavanshi-ai/" style="color: #84cc16; text-decoration: none; margin: 0 8px;">LinkedIn</a>
              <span style="color: #4b5563;">|</span>
              <a href="https://x.com/_AmanSurya" style="color: #84cc16; text-decoration: none; margin: 0 8px;">X</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  </center>
</body>
</html>
\`;

export const AdminNotificationTemplate = (name: string, email: string, message: string) => \`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; -webkit-font-smoothing: antialiased; }
    table { border-spacing: 0; border-collapse: collapse; }
    td { padding: 0; }
    img { border: 0; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #f3f4f6; padding-bottom: 40px; }
    .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { padding: 30px 20px; background-color: #84cc16; text-align: center; border-bottom: 4px solid #064e3b; }
    .content { padding: 40px 30px; background-color: #ffffff; }
    @media screen and (max-width: 600px) {
      .content { padding: 30px 20px !important; }
      .main { border-radius: 0 !important; }
    }
  </style>
</head>
<body>
  <center class="wrapper">
    <div style="padding: 20px 0;">
      <table class="main" width="100%">
        <tr>
          <td class="header">
            <h1 style="margin: 0; color: #064e3b; font-size: 22px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.5px;">New Inquiry</h1>
            <p style="margin: 5px 0 0 0; color: #064e3b; font-size: 14px; font-weight: 500;">Portfolio Contact Form</p>
          </td>
        </tr>
        <tr>
          <td class="content">
            <table width="100%" style="margin-bottom: 25px;">
              <tr>
                <td style="padding-bottom: 5px;">
                  <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Sender Details</p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 5px 0; color: #111827; font-size: 16px; font-weight: 600;">\${name}</p>
                  <a href="mailto:\${email}" style="color: #064e3b; text-decoration: none; font-size: 15px;">\${email}</a>
                </td>
              </tr>
            </table>

            <table width="100%" style="margin-bottom: 30px;">
              <tr>
                <td style="padding-bottom: 5px;">
                  <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Message</p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; border-radius: 6px; border: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">\${message}</p>
                </td>
              </tr>
            </table>

            <table width="100%" style="border-top: 1px solid #e5e7eb; padding-top: 25px;">
              <tr>
                <td align="left" valign="middle">
                  <p style="margin: 0; color: #9ca3af; font-size: 13px;">Received: \${new Date().toLocaleString()}</p>
                </td>
                <td align="right" valign="middle">
                  <a href="mailto:\${email}" style="background-color: #064e3b; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; display: inline-block;">Reply Now</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </center>
</body>
</html>
\`;
