import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const transporter = nodemailer.createTransport({
  host: 'mail-eu.smtp2go.com',
  port: 587,
  secure: false,
  auth: {
    user: 'website@day1.co.za',
    pass: '@@Day001@@'
  },
  tls: {
    rejectUnauthorized: false
  }
});

function isExistingMember(data) {
  return 'enquiry' in data;
}

function isProspectiveClient(data) {
  return 'infoAbout' in data && 'heardFrom' in data;
}

function isQuote(data) {
  return 'planCategory' in data;
}

function generateExistingMemberEmail(data, toEmail) {
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

function generateProspectiveClientEmail(data, toEmail) {
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

function generateQuoteEmail(data, toEmail) {
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

app.post('/api/send-email', async (req, res) => {
  try {
    const { formType, data } = req.body;

    if (!formType || !data) {
      return res.status(400).json({ error: 'Missing formType or data' });
    }

    let toEmail, fromEmail, subject, htmlContent;

    if (isExistingMember(data)) {
      toEmail = 'day1healthdeveloper@gmail.com';
      fromEmail = 'website@day1.co.za';
      subject = `[EXISTING MEMBER] ${data.firstName} ${data.lastName} - ${data.enquiry}`;
      htmlContent = generateExistingMemberEmail(data, 'day1healthdeveloper@gmail.com');
    } else if (isProspectiveClient(data)) {
      toEmail = 'day1healthdeveloper@gmail.com';
      fromEmail = 'website@day1.co.za';
      subject = `[PROSPECTIVE CLIENT] ${data.firstName} ${data.lastName} - ${data.infoAbout}`;
      htmlContent = generateProspectiveClientEmail(data, 'day1healthdeveloper@gmail.com');
    } else if (isQuote(data)) {
      toEmail = 'day1healthdeveloper@gmail.com';
      fromEmail = 'website@day1.co.za';
      subject = `[QUOTE REQUEST] ${data.firstName} ${data.lastName} - ${data.planCategory}`;
      htmlContent = generateQuoteEmail(data, 'day1healthdeveloper@gmail.com');
    } else {
      return res.status(400).json({ error: 'Invalid form data' });
    }

    // Send admin notification email FIRST
    console.log('ADMIN EMAIL SENDING TO:', toEmail);
    const adminResult = await transporter.sendMail({
      from: '"Day1 Health Website" <website@day1.co.za>',
      to: toEmail,
      subject: subject,
      html: htmlContent,
      replyTo: data.email
    });
    console.log('ADMIN EMAIL SENT:', adminResult.messageId);

    // Send confirmation email to client SECOND
    const confirmationHtml = `
      <h2>Thank you for contacting Day1 Health</h2>
      <p>Hi ${data.firstName},</p>
      <p>We've received your enquiry and will get back to you shortly.</p>
      <p>Best regards,<br>Day1 Health Team</p>
    `;

    console.log('USER CONFIRMATION SENDING TO:', data.email);
    const userResult = await transporter.sendMail({
      from: '"Day1 Health" <website@day1.co.za>',
      to: data.email,
      subject: 'We received your enquiry - Day1 Health',
      html: confirmationHtml
    });
    console.log('USER CONFIRMATION SENT:', userResult.messageId);

    return res.status(200).json({ success: true, message: 'Email sent successfully', adminMessageId: adminResult.messageId, userMessageId: userResult.messageId });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: String(error) });
  }
});

app.listen(3001, () => {
  console.log('API server running on http://localhost:3001');
});

// Sitemap generation endpoint
app.get('/api/sitemap.xml', async (req, res) => {
  try {
    // Fetch all providers
    let allProviders = [];
    let offset = 0;
    const pageSize = 500;
    let hasMore = true;

    while (hasMore) {
      const { data, error, count } = await supabase
        .from('providers')
        .select('id, updated_at', { count: 'exact' })
        .range(offset, offset + pageSize - 1);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        hasMore = false;
      } else {
        allProviders = [...allProviders, ...data];
        offset += pageSize;

        if (count !== null && allProviders.length >= count) {
          hasMore = false;
        }
      }
    }

    const baseUrl = 'https://day1health.co.za';
    const today = new Date().toISOString().split('T')[0];

    // Build sitemap XML
    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

    // Static pages
    const staticPages = [
      { loc: '/', changefreq: 'daily', priority: 1.0 },
      { loc: '/plans/day-to-day', changefreq: 'monthly', priority: 0.8 },
      { loc: '/plans/hospital', changefreq: 'monthly', priority: 0.8 },
      { loc: '/plans/comprehensive', changefreq: 'monthly', priority: 0.8 },
      { loc: '/plans/senior-plan', changefreq: 'monthly', priority: 0.8 },
      { loc: '/plans/junior-executive', changefreq: 'monthly', priority: 0.8 },
      { loc: '/procedures', changefreq: 'yearly', priority: 0.6 },
      { loc: '/regulatory-information', changefreq: 'yearly', priority: 0.6 },
      { loc: '/directory', changefreq: 'weekly', priority: 0.9 },
    ];

    staticPages.forEach((page) => {
      const lastmod = today;
      sitemapXml += `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    // Provider pages
    allProviders.forEach((provider) => {
      const lastmod = provider.updated_at
        ? new Date(provider.updated_at).toISOString().split('T')[0]
        : today;

      sitemapXml += `  <url>
    <loc>${baseUrl}/provider/${provider.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    sitemapXml += '</urlset>';

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.status(200).send(sitemapXml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
});
