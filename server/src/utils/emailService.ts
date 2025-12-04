import nodemailer from 'nodemailer';

const SMTP_CONFIG = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
    },
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ownsangeet.com';
const FROM_EMAIL = process.env.SMTP_USER || 'noreply@ownsangeet.com';

// Create reusable transporter
const transporter = nodemailer.createTransport(SMTP_CONFIG);

interface InquiryData {
    name: string;
    email: string;
    phone: string;
    eventType?: string;
    serviceRequired?: string;
    language?: string;
    style?: string;
    message: string;
}

export async function sendInquiryNotification(inquiry: InquiryData & { id: string }) {
    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️  SMTP not configured. Email notification skipped.');
        return { success: false, message: 'SMTP not configured' };
    }

    try {
        // Email to admin
        const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 15px; padding: 15px; background: white; border-left: 4px solid #667eea; border-radius: 5px; }
        .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
        .value { color: #333; }
        .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
        .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎵 New Inquiry Received!</h1>
            <p>Someone is interested in your custom music services</p>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">Name</div>
                <div class="value">${inquiry.name}</div>
            </div>
            <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${inquiry.email}">${inquiry.email}</a></div>
            </div>
            <div class="field">
                <div class="label">Phone</div>
                <div class="value"><a href="tel:${inquiry.phone}">${inquiry.phone}</a></div>
            </div>
            ${inquiry.eventType ? `
            <div class="field">
                <div class="label">Event Type</div>
                <div class="value">${inquiry.eventType}</div>
            </div>` : ''}
            ${inquiry.serviceRequired ? `
            <div class="field">
                <div class="label">Service Required</div>
                <div class="value">${inquiry.serviceRequired}</div>
            </div>` : ''}
            ${inquiry.language ? `
            <div class="field">
                <div class="label">Preferred Language</div>
                <div class="value">${inquiry.language}</div>
            </div>` : ''}
            ${inquiry.style ? `
            <div class="field">
                <div class="label">Musical Style</div>
                <div class="value">${inquiry.style}</div>
            </div>` : ''}
            <div class="field">
                <div class="label">Message</div>
                <div class="value">${inquiry.message}</div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="tel:${inquiry.phone}" class="button">📞 Call Now</a>
                <a href="mailto:${inquiry.email}" class="button">📧 Email</a>
                <a href="https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}" class="button">💬 WhatsApp</a>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <p><a href="http://localhost:5173/admin/inquiries/${inquiry.id}" style="color: #667eea;">View in Admin Panel →</a></p>
            </div>
        </div>
        <div class="footer">
            <p>This is an automated notification from Own Sangeet</p>
        </div>
    </div>
</body>
</html>`;

        await transporter.sendMail({
            from: `"Own Sangeet" <${FROM_EMAIL}>`,
            to: ADMIN_EMAIL,
            subject: `🎵 New Inquiry from ${inquiry.name}`,
            html: adminEmailHtml,
        });

        // Confirmation email to customer
        const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎵 Thank You for Your Inquiry!</h1>
        </div>
        <div class="content">
            <p>Dear ${inquiry.name},</p>
            <p>Thank you for reaching out to Own Sangeet! We've received your inquiry and are excited to help you create something special.</p>
            <p><strong>What happens next?</strong></p>
            <ul>
                <li>Our team will review your requirements</li>
                <li>We'll contact you within 24-48 hours</li>
                <li>We'll discuss your vision and provide a quote</li>
            </ul>
            <p>If you have any urgent questions, feel free to contact us:</p>
            <p>📞 <a href="tel:+919098019901">+91 9098019901</a><br>
            💬 <a href="https://wa.me/919098019901">WhatsApp</a></p>
            <p>Looking forward to creating something amazing together!</p>
            <p><strong>The Own Sangeet Team</strong></p>
        </div>
        <div class="footer">
            <p>© 2024 Own Sangeet. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

        await transporter.sendMail({
            from: `"Own Sangeet" <${FROM_EMAIL}>`,
            to: inquiry.email,
            subject: 'Thank you for your inquiry - Own Sangeet',
            html: customerEmailHtml,
        });

        console.log('✅ Email notifications sent successfully');
        return { success: true, message: 'Emails sent' };
    } catch (error) {
        console.error('❌ Email send error:', error);
        return { success: false, message: 'Email send failed', error };
    }
}

export async function testEmailConnection() {
    try {
        await transporter.verify();
        console.log('✅ SMTP connection verified');
        return true;
    } catch (error) {
        console.error('❌ SMTP connection failed:', error);
        return false;
    }
}
