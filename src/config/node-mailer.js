// node-mailer.js - Nodemailer configuration and email sending utility
//
// This module provides a function to send emails using Gmail via Nodemailer.
// It uses environment variables for credentials and a utility for API responses.

// Import Nodemailer's createTransport for sending emails
import { createTransport } from "nodemailer";
// Import custom API response utility
import { apiResponse } from "@utils/apiResponse";
// Import Gmail credentials from config
import {
  GOOGLE_EMAIL, // Gmail address used as sender
  GOOGLE_APP_PASSWORD, // App password for Gmail authentication
} from "@config/index";

/**
 * Sends an email using Gmail SMTP via Nodemailer.
 *
 * @param {string|string[]} to - Recipient email address(es).
 * @param {string} subject - Subject of the email.
 * @param {string} templates - HTML content of the email.
 * @returns {Promise<void>} Returns a promise that resolves when the email is sent.
 */
export const sendEmail = async (to, subject, templates) => {
  try {
    // Create a Nodemailer transporter using Gmail service and credentials
    const transporter = createTransport({
      service: "gmail", // Use Gmail as the email service
      auth: {
        user: GOOGLE_EMAIL, // Sender Gmail address
        pass: GOOGLE_APP_PASSWORD, // Gmail app password
      },
      // host: "smtp.gmail.com", // (Optional) SMTP host
      // port: 587, // (Optional) SMTP port
      // secure: false, // (Optional) Use TLS (true for port 465, false for others)
    });

    // Define email options
    const mailOptions = {
      from: "Bootcamp <no-reply@m-knowsconsulting.com>", // Sender name and email
      replyTo: "no-reply@m-knowsconsulting.com", // Reply-to address
      to, // Recipient(s)
      subject: `Bootcamp - ${subject}`, // Email subject
      html: templates, // Email HTML content
    };

    // Send the email using the transporter
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        // Log and return error response if sending fails
        console.error(`Error Transporter: ${err.message}`);
        return apiResponse(400, "INTERNAL SERVER ERROR", err.message);
      }

      // Log success information
      console.info(`Successfully sent email to ${to} with subject - ${mailOptions.subject}`);
      console.info(`Email sent: ${info.response}`);
    });
  } catch (error) {
    // Handle unexpected errors and return API response
    throw apiResponse(status.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR", error.message);
  }
};