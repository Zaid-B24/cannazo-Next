import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPrescriptionEmail(
  toEmail: string, 
  patientName: string, 
  pdfBuffer: Buffer
) {
  try {
    
    const info = await transporter.sendMail({
      from: `"Cannazo India" <${process.env.SMTP_USER}>`, 
      to: toEmail, 
      subject: `Prescription for ${patientName}`,
      text: `Dear ${patientName},\n\nPlease find the attached Cannazo India e-prescription.\n\nRegards,\nDr. Abdul Shafiz Shaikh`,
      attachments: [
        {
          filename: `Prescription-${patientName.replace(/\s+/g, '_')}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    console.log("Email sent info:", info.messageId);

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}