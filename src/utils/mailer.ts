import ejs from "ejs";
import path from "path";
import { sendEmail } from "@config/node-mailer";

export const sendEmailOTP = async (data: { email: string; full_name?: string; otp?: string; expiration_time?: number; }): Promise<void> => {
  const template = await ejs.renderFile(
    path.join(__dirname, "../../public/templates/email-verification.ejs"),
    { data },
  );

  await sendEmail(data.email, "Email Verification", template);
};