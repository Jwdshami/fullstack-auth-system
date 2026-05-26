import nodemailer from "nodemailer";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import crypto from "crypto";
const sendEmail = async ({ email, userId, emailType }: any) => {
  try {
        const hashedtoken= crypto.randomBytes(32).toString("hex");

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(
        userId,
        { verifyToken: hashedtoken, verifyTokenExpiry: Date.now() + 3600000 },
        { new: true, runValidators: true },
      );
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(
        userId,
        {
          forgotPasswordToken: hashedtoken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        },
        { new: true, runValidators: true },
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

const link =
  emailType === "VERIFY"
    ? `${process.env.domain}/verifyemail?token=${hashedtoken}`
    : `${process.env.domain}/resetpassword?token=${hashedtoken}`; // ✅ separate route

const mailOptions = {
  from: "otd442@gmail.com",
  to: email,
  subject: emailType === "VERIFY" ? "Email Verification" : "Password Reset Request",
  html: `<p>${
    emailType === "VERIFY"
      ? "Please verify your email by clicking the link below:"
      : "Click here to reset your password:"
  } <a href="${link}">Click here</a></p>`,
};
    const mailResponse = await transporter.sendMail(mailOptions);

    console.log(`Email sent to ${email}:`, mailResponse);
    return mailResponse;
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
  }
};

export { sendEmail };

// export const sendPasswordResetEmail = async (userId: string) => {
//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       console.error(`User with ID ${userId} not found`);
//       return;
//     }

//     const resetToken = bcrypt.hashSync(user._id.toString(), 10);
//     const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&id=${user._id}`;
//     const message = `You requested a password reset. Click the link to reset your password: ${resetLink}`;

//     await sendEmail({
//       email: user.email,
//       subject: "Password Reset Request",
//       message,
//     });
//   } catch (error) {
//     console.error(
//       `Failed to send password reset email for user ID ${userId}:`,
//       error,
//     );
//   }
// };
