const Contact = require('../models/Contact');
const Booking = require('../models/Booking');
const Testimonial = require('../models/Testimonial');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    const { email, password } = req.body;
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Invalid email or password' }); // Generic error for login
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name, role: 'user' }, process.env.JWT_SECRET || 'your_jwt_secret_key', { expiresIn: '7d' });
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: 'user' } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.admin.id; // from auth middleware

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    let account = await User.findById(userId) || await Admin.findById(userId);
    
    if (!account) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, account.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    account.password = await bcrypt.hash(newPassword, 10);
    await account.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to change password' });
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
    const { email, password } = req.body;
    
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
      admin = await Admin.create({ email: 'admin@gmail.com', password: hashedPassword });
    } else if (admin && email === 'admin@gmail.com' && password === 'admin@123') {
      // If admin exists but password might be the old 'admin', let's update it to 'admin@123' if it matches the old one.
      const isOldMatch = await bcrypt.compare('admin', admin.password);
      if (isOldMatch) {
        admin.password = await bcrypt.hash('admin@123', 10);
        await admin.save();
      }
    }

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
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
    const userEmail = req.admin.email; // From auth middleware
    const notifications = await Notification.find({ userEmail }).sort({ createdAt: -1 });
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
