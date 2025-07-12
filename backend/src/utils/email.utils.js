import nodemailer from "nodemailer"
import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
});

const passwordForgotHelper = async (email_id, unique_key, username) => {
    const from = '"SiteBuilder Team"  <sitebhuilder803@gmail.com>'
    const to = `${email_id}`;
    const resetLink = `https://it-project-2025.vercel.app/resetpassword?token=${unique_key}`;
    const subject = "Reset Your SiteBuilder Password";
    const text = `Hey ${username},
We’ve received a request to reset your password for your SiteBuilder account.
If you made this request, click the link below to reset your password:
${resetLink}
If you didn’t request a password reset, you can safely ignore this email. Your account is still secure.
Thanks,  
The SiteBuilder Team
`;
    const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>Hey <strong>${username}</strong>,</p>

    <p>We’ve received a request to reset your password for your <strong>SiteBuilder</strong> account.</p>

    <p>If you made this request, click the link below to reset your password:</p>

    <p>
      <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
    </p>

    <p>If you didn’t request a password reset, you can safely ignore this email. Your account is still secure.</p>

    <p>Thanks,<br><strong>The SiteBuilder Team</strong></p>
  </div>
`;

    const info = await transporter.sendMail({ from, to,resetLink, subject, text, html });
    console.log(info)
    return true;

}

export { passwordForgotHelper };