import nodemailer from 'nodemailer';
import { VercelRequest, VercelResponse } from '@vercel/node';

const transporter = nodemailer.createTransport({
  host: 'mail-eu.smtp2go.com',
  port: 587,
  secure: false,
  auth: {
    user: 'website@day1.co.za',
    pass: '@@Day001@@'
  }
});

interface ExistingMemberData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  enquiry: string;
  message: string;
}

interface ProspectiveClientData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  infoAbout: string;
  heardFrom: string;
  message: string;
}

interface QuoteData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  planCategory: string;
  seniorCategory?: string;
  tier?: string;
  subCategory: string;
  message: string;
  children?: Array<{ name: string; age: string }>;
}

type FormData = ExistingMemberData | ProspectiveClientData | QuoteData;

function isExistingMember(data: FormData): data is ExistingMemberData {
  return 'enquiry' in data;
}

function isProspectiveClient(data: FormData): data is ProspectiveClientData {
  return 'infoAbout' in data && 'heardFrom' in data;
}

function isQuote(data: FormData): data is QuoteData {
  return 'planCategory' in data;
}

function generateExistingMemberEmail(data: ExistingMemberData, toEmail: string): string {
  return `
    <h2>New Existing Member Enquiry</h2>
    <p><strong>Submitted to:</strong> ${toEmail}</p>
    <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Enquiry Type:</strong> ${data.enquiry}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message.replace(/\n/g, '<br>')}</p>
  `;
}

function generateProspectiveClientEmail(data: ProspectiveClientData, toEmail: string): string {
  return `
    <h2>New Prospective Client Enquiry</h2>
    <p><strong>Submitted to:</strong> ${toEmail}</p>
    <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Info Needed:</strong> ${data.infoAbout}</p>
    <p><strong>Heard From:</strong> ${data.heardFrom}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message.replace(/\n/g, '<br>')}</p>
  `;
}

function generateQuoteEmail(data: QuoteData, toEmail: string): string {
  let childrenHtml = '';
  if (data.subCategory === 'family' && data.children && data.children.length > 0) {
    childrenHtml = `
      <p><strong>Children:</strong></p>
      <ul>
        ${data.children.map(child => `<li>${child.name} (Age: ${child.age})</li>`).join('')}
      </ul>
    `;
  }

  return `
    <h2>New Quote Request</h2>
    <p><strong>Submitted to:</strong> ${toEmail}</p>
    <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Plan Category:</strong> ${data.planCategory}</p>
    ${data.seniorCategory ? `<p><strong>Senior Plan Type:</strong> ${data.seniorCategory}</p>` : ''}
    ${data.tier ? `<p><strong>Tier:</strong> ${data.tier}</p>` : ''}
    <p><strong>Subcategory:</strong> ${data.subCategory}</p>
    ${childrenHtml}
    <p><strong>Message:</strong></p>
    <p>${data.message.replace(/\n/g, '<br>')}</p>
  `;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formType, data } = req.body;

    if (!formType || !data) {
      return res.status(400).json({ error: 'Missing formType or data' });
    }

    let toEmail: string;
    let fromEmail: string;
    let subject: string;
    let htmlContent: string;

    if (isExistingMember(data)) {
      toEmail = 'info@day1.co.za';
      fromEmail = 'website@day1.co.za';
      subject = `[EXISTING MEMBER] ${data.firstName} ${data.lastName} - ${data.enquiry}`;
      htmlContent = generateExistingMemberEmail(data, 'info@day1.co.za');
    } else if (isProspectiveClient(data)) {
      toEmail = 'info@day1.co.za';
      fromEmail = 'website@day1.co.za';
      subject = `[PROSPECTIVE CLIENT] ${data.firstName} ${data.lastName} - ${data.infoAbout}`;
      htmlContent = generateProspectiveClientEmail(data, 'sales@day1.co.za');
    } else if (isQuote(data)) {
      toEmail = 'day1healthdeveloper@gmail.com';
      fromEmail = 'website@day1.co.za';
      subject = `[QUOTE REQUEST] ${data.firstName} ${data.lastName} - ${data.planCategory}`;
      htmlContent = generateQuoteEmail(data, 'day1healthdeveloper@gmail.com');
    } else {
      return res.status(400).json({ error: 'Invalid form data' });
    }

    // Send email to Day1 Health
    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject: subject,
      html: htmlContent,
      replyTo: data.email
    });

    // Send confirmation email to client
    const confirmationHtml = `
      <h2>Thank you for contacting Day1 Health</h2>
      <p>Hi ${data.firstName},</p>
      <p>We've received your enquiry and will get back to you shortly.</p>
      <p>Best regards,<br>Day1 Health Team</p>
    `;

    await transporter.sendMail({
      from: fromEmail,
      to: data.email,
      subject: 'We received your enquiry - Day1 Health',
      html: confirmationHtml
    });

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: String(error) });
  }
}
