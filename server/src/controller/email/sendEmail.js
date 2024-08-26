const SibApiV3Sdk = require("sib-api-v3-sdk");
const fs = require("fs").promises;
const path = require("path");

SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
  process.env.BREVO_API_KEY;

const sendEmail = async (to, subject, templateFilePath, dynamicData) => {
  try {
    // Read the HTML template
    let htmlContent = await fs.readFile(templateFilePath, "utf8");

    // Replace placeholders with dynamic data
    Object.keys(dynamicData).forEach((key) => {
      const placeholder = `{{${key}}}`;
      const regex = new RegExp(placeholder, "g");
      htmlContent = htmlContent.replace(regex, dynamicData[key]);
    });

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = {
      email: process.env.FROM_EMAIL,
      name: process.env.SENDER_NAME,
    };
    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    if (error.response) {
      console.error("Error details:", error.response.body);
    }
  }
};

module.exports = sendEmail;