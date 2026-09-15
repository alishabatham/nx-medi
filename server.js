require('dotenv').config();
const dns = require('dns');

// Custom DNS to resolve MongoDB SRV records on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5173;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(__dirname));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://alishabatham2_db_user:urq6lBf4WlNfk1Um@cluster0.upabs4c.mongodb.net/nx-medi?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 8000
})
  .then(() => {
    console.log('✅ Connected successfully to MongoDB Atlas (Database: nx-medi)');
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Warning:', err.message);
  });

// Define Mongoose Schema & Model for 'nx-medi' collection
const responseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  role: { type: String, required: true },
  message: { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now }
}, { 
  collection: 'nx-medi'
});

const FormResponse = mongoose.model('FormResponse', responseSchema);

// Configure Nodemailer Transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL || 'alisha.522373@gmail.com',
    pass: (process.env.SENDER_PASS || 'ylstrkpdtpvtdhsp').replace(/\s+/g, '')
  }
});

// Verify Nodemailer SMTP Connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Nodemailer Transporter Verification Error:', error.message);
  } else {
    console.log('📧 Nodemailer Transporter ready to send emails from alisha.522373@gmail.com');
  }
});

// Role Labels Helper
const getRoleLabel = (role) => {
  const roles = {
    family: 'Family Caregiver / Individual Patient',
    physician: 'Physician / Healthcare Provider',
    hospital: 'Hospital Administrator / Health System',
    pharmacy: 'Pharmacy Partner'
  };
  return roles[role] || role;
};

// API Endpoint to handle Form Submissions & Send Email Notifications
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, role, message } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email, and role fields are required.' 
      });
    }

    // 1. Save to MongoDB 'nx-medi' collection
    let savedData = null;
    try {
      const newResponse = new FormResponse({ name, email, role, message });
      savedData = await newResponse.save();
      console.log('📥 Saved Form Response to MongoDB nx-medi collection:', savedData);
    } catch (dbErr) {
      console.error('⚠️ Could not save to MongoDB (IP whitelist or timeout):', dbErr.message);
    }

    // 2. Send Email via Nodemailer to hr@nexisparkx.com
    const receiverEmail = process.env.RECEIVER_EMAIL || 'hr@nexisparkx.com';
    const roleLabel = getRoleLabel(role);

    const mailOptions = {
      from: `"NX Medi Web Form" <${process.env.SENDER_EMAIL || 'alisha.522373@gmail.com'}>`,
      to: receiverEmail,
      replyTo: email,
      subject: `🔔 New Lead Inquiry from ${name} [NX Medi Platform]`,
      html: `
        <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #F8FAFC; padding: 30px; color: #1E293B;">
          <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%); padding: 24px; color: #FFFFFF; text-align: center;">
              <h2 style="margin: 0; font-size: 22px;">NX Medi — New Inquiry Received</h2>
              <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Smart Medication Management Platform</p>
            </div>
            
            <div style="padding: 24px;">
              <h3 style="color: #0F172A; margin-top: 0; font-size: 18px; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px;">Inquiry Details</h3>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                <tr>
                  <td style="padding: 10px; font-weight: bold; width: 140px; color: #475569; background: #F1F5F9; border-bottom: 1px solid #E2E8F0;">Full Name:</td>
                  <td style="padding: 10px; color: #0F172A; border-bottom: 1px solid #E2E8F0;"><strong>${name}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: bold; color: #475569; background: #F1F5F9; border-bottom: 1px solid #E2E8F0;">Email Address:</td>
                  <td style="padding: 10px; color: #0F172A; border-bottom: 1px solid #E2E8F0;"><a href="mailto:${email}" style="color: #0D9488; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: bold; color: #475569; background: #F1F5F9; border-bottom: 1px solid #E2E8F0;">Inquiring As:</td>
                  <td style="padding: 10px; color: #0F172A; border-bottom: 1px solid #E2E8F0;"><span style="background: #E6FFFA; color: #0D9488; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 13px;">${roleLabel}</span></td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: bold; color: #475569; background: #F1F5F9; vertical-align: top;">Message:</td>
                  <td style="padding: 10px; color: #0F172A; white-space: pre-wrap;">${message || '<em>No message provided.</em>'}</td>
                </tr>
              </table>

              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #94A3B8; text-align: center;">
                Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST | Destination: ${receiverEmail}
              </div>
            </div>
          </div>
        </div>
      `
    };

    const emailInfo = await transporter.sendMail(mailOptions);
    console.log('✉️ Email notification sent successfully to hr@nexisparkx.com:', emailInfo.messageId);

    res.status(201).json({
      success: true,
      message: 'Form response saved and email sent to hr@nexisparkx.com successfully!',
      data: { name, email, role, message }
    });
  } catch (error) {
    console.error('❌ Error processing form response / sending email:', error.message || error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email notification.'
    });
  }
});

// API Endpoint to fetch saved responses
app.get('/api/responses', async (req, res) => {
  try {
    const responses = await FormResponse.find().sort({ submittedAt: -1 });
    res.json({ success: true, count: responses.length, responses });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch responses.' });
  }
});

// Fallback route for index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
