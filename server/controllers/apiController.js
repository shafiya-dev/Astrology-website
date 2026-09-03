const Contact = require('../models/Contact');
const Booking = require('../models/Booking');
const Testimonial = require('../models/Testimonial');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const dns = require('dns');

// Force Node.js to use IPv4 instead of IPv6 to fix ENETUNREACH on Render
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  family: 4, // Force IPv4 to prevent ENETUNREACH IPv6 errors on Render
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

exports.submitContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

exports.userRegister = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password: rawPassword } = req.body;
    const password = rawPassword.trim();
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Invalid email or password' }); // Generic error for login
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Account not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password !== user.password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    if (!isMatch && password === user.password) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name, role: 'user' }, process.env.JWT_SECRET || 'your_jwt_secret_key', { expiresIn: '7d' });
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: 'user' } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email address is required' });

    const user = await User.findOne({ email }) || await Admin.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Password Reset OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #E3B52A; text-align: center;">Password Reset</h2>
          <p style="font-size: 16px;">Hello,</p>
          <p style="font-size: 16px;">You requested a password reset. Your OTP code is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 28px; font-weight: bold; background: #352055; color: #fff; padding: 10px 20px; border-radius: 8px; letter-spacing: 5px;">${otpCode}</span>
          </div>
          <p style="font-size: 14px; color: #777;">This code is valid for 5 minutes. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email OTP] Sent to ${email}`);

    await Otp.findOneAndDelete({ email }); // Remove existing OTP
    await Otp.create({ email, otp: otpCode });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: `Failed to send email. Error: ${error.message || 'Check App Password'}` });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const existingOtp = await Otp.findOne({ email, otp });
    if (!existingOtp) return res.status(400).json({ message: 'Invalid or expired OTP' });

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const existingOtp = await Otp.findOne({ email, otp });
    if (!existingOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    let account = await User.findOne({ email }) || await Admin.findOne({ email });
    if (!account) return res.status(404).json({ message: 'Account not found' });

    account.password = await bcrypt.hash(newPassword, 10);
    await account.save();
    
    await Otp.deleteOne({ _id: existingOtp._id });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};


exports.submitBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: 'Booking requested successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to request booking' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    // Send email notification
    let emailSubject = '';
    let emailText = '';
    
    if (status === 'Accepted') {
      emailSubject = 'Your Booking is Confirmed - Aacharya Shwetaa Kapoor';
      emailText = `Dear ${booking.name},\n\nGreat news! Your booking request for ${booking.service} on ${booking.preferredDateTime} has been accepted.\n\nWe look forward to connecting with you soon.\n\nWarm regards,\nAacharya Shwetaa Kapoor`;
    } else {
      emailSubject = 'Update on Your Booking Request - Aacharya Shwetaa Kapoor';
      emailText = `Dear ${booking.name},\n\nThank you for your interest. Unfortunately, we are unable to accommodate your booking request for ${booking.service} on ${booking.preferredDateTime} at this time.\n\nPlease feel free to request a different slot.\n\nWarm regards,\nAacharya Shwetaa Kapoor`;
    }

    const mailOptions = {
      from: `"Aacharya Shwetaa Kapoor" <${process.env.EMAIL_USER}>`,
      to: booking.email,
      subject: emailSubject,
      text: emailText
    };

    // Create in-app notification
    const notification = new Notification({
      userEmail: booking.email.toLowerCase(),
      title: status === 'Accepted' ? 'Booking Request Accepted' : 'Booking Request Declined',
      message: status === 'Accepted' 
        ? `Your booking for ${booking.service} on ${booking.preferredDateTime} has been accepted.` 
        : `Your booking request for ${booking.service} on ${booking.preferredDateTime} has been declined.`,
      type: 'booking_update'
    });
    await notification.save();

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending booking notification email:', error);
      }
    });

    res.status(200).json({ message: `Booking ${status.toLowerCase()} successfully`, booking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password: rawPassword } = req.body;
    const password = rawPassword.trim();
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    let admin = await Admin.findOne({ email });
    
    // Auto-create admin if it doesn't exist to satisfy the specific credentials request
    if (!admin && email === 'admin@gmail.com' && password === 'admin@123') {
      const hashedPassword = await bcrypt.hash('admin@123', 10);
      admin = await Admin.create({ email: 'admin@gmail.com', phone: '9999999999', password: hashedPassword });
    } else if (admin && email === 'admin@gmail.com' && password === 'admin@123') {
      // If admin exists but password might be the old 'admin', let's update it to 'admin@123' if it matches the old one.
      const isOldMatch = await bcrypt.compare('admin', admin.password);
      if (isOldMatch || admin.password === 'admin') {
        admin.password = await bcrypt.hash('admin@123', 10);
        await admin.save();
      }
    }

    if (!admin) {
      return res.status(404).json({ message: 'Account not found' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch && password !== admin.password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    if (!isMatch && password === admin.password) {
      admin.password = await bcrypt.hash(password, 10);
      await admin.save();
    }
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET || 'your_jwt_secret_key', { expiresIn: '1d' });
    res.status(200).json({ token, user: { id: admin._id, name: 'Admin', email: admin.email, role: 'admin' } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ contacts, bookings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    if (req.admin.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

exports.replyLead = async (req, res) => {
  try {
    if (req.admin.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const { userEmail, message } = req.body;
    const notification = new Notification({ userEmail, message });
    await notification.save();
    res.status(201).json({ message: 'Reply sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send reply' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    // Use explicitly requested email from query, or fallback to the token's email
    const userEmail = req.query.email || req.admin.email; 
    const notifications = await Notification.find({ 
      userEmail: new RegExp(`^${userEmail}$`, 'i') 
    }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

exports.seedDatabase = async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin', 10);
      await Admin.create({
        email: process.env.ADMIN_EMAIL || 'admin@shwetaakapoorastrology.com',
        phone: '9999999999',
        password: hashedPassword,
      });
    }

    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      const seedTestimonials = [
        { quote: "Her prediction about my job change was spot on. I felt guided every step of the way.", name: "Riya Sharma", city: "Mumbai" },
        { quote: "The numerology report explained patterns in my life I could never understand before.", name: "Amit Verma", city: "Pune" },
        { quote: "Vastu changes she suggested for our home brought a noticeably calmer atmosphere.", name: "Sneha Joshi", city: "Nashik" },
        { quote: "Very compassionate and honest. Her palmistry reading was detailed and accurate.", name: "Karan Mehta", city: "Delhi" },
        { quote: "I consult her every year before major decisions — she's been right every time.", name: "Priya Nair", city: "Bengaluru" },
        { quote: "Professional, warm and deeply knowledgeable. Highly recommend her sessions.", name: "Rohit Deshmukh", city: "Nagpur" }
      ];
      await Testimonial.insertMany(seedTestimonials);
    }
    res.status(200).json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed database' });
  }
};
