/**
 * Utility functions for sending various types of emails using EJS templates and nodemailer.
 */
import ejs from "ejs"; // EJS templating engine for rendering HTML email templates
import path from "path"; // Node.js path module for handling file paths
import { sendEmail } from "@config/node-mailer"; // Custom email sending function using nodemailer

/**
 * Sends an OTP (One-Time Password) email for email verification.
 * @param {Object} data - The data object containing user email and other template variables.
 * @returns {Promise<void>} - Resolves when the email is sent.
 */
export const sendEmailOTP = async (data): Promise<void> => {
  // Render the email-verification EJS template with provided data
  const template = await ejs.renderFile(
    path.join(__dirname, "../../public/templates/email-verification.ejs"),
    { data },
  );

  // Send the rendered template as an email
  await sendEmail(data.email, "Email Verification", template);
};

/**
 * Sends a payment-related email using the email verification template.
 * @param {Object} data - The data object containing user email and other template variables.
 * @returns {Promise<void>} - Resolves when the email is sent.
 */
export const sendPayment = async (data): Promise<void> => {
  // Render the email-verification EJS template with provided data
  const template = await ejs.renderFile(
    path.join(__dirname, "../../public/templates/email-verification.ejs"),
    { data },
  );

  // Send the rendered template as an email
  await sendEmail(data.email, "Email Verification", template);
};

/**
 * Sends a forget password email using the email verification template.
 * @param {Object} data - The data object containing user email and other template variables.
 * @returns {Promise<void>} - Resolves when the email is sent.
 */
export const sendForgetPassword = async (data): Promise<void> => {
  // Render the email-verification EJS template with provided data
  const template = await ejs.renderFile(
    path.join(__dirname, "../../public/templates/email-verification.ejs"),
    { data },
  );

  // Send the rendered template as an email
  await sendEmail(data.email, "Email Verification", template);
};