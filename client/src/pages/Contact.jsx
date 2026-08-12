import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    if (name === 'name') {
      value = value.replace(/[^a-zA-Z\s]/g, '');
    }
    
    if (name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData({ ...formData, [name]: value });
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: null });
    }
  };

  const validate = () => {
    let errors = {};
    if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      errors.name = "Full Name must contain only letters and spaces.";
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone number must be exactly 10 digits.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    if (!validate()) return;
    
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('https://astrology-backend-xhfi.onrender.com/api/contact', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus({ type: 'success', message: 'Your message has been sent successfully.' });
        setFormData({ name: '', email: '', phone: '', message: '' });
        setValidationErrors({});
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to send message.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Database connection failed. Please ensure MongoDB is running.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24 pb-24 min-h-screen cosmic-bg"
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Book a consultation or ask a question — we usually reply within a day
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          {/* Left: Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1 glass-card p-8 md:p-12 rounded-3xl"
          >
            <h2 className="text-2xl font-bold mb-8">Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-sm text-text-muted mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-transparent border ${validationErrors.name ? 'border-red-400' : 'border-white/20'} rounded-md px-4 py-2.5 text-text focus:outline-none focus:border-accent`}
                  />
                  {validationErrors.name && <p className="text-red-400 text-xs mt-1">{validationErrors.name}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-text-muted mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full bg-transparent border ${validationErrors.phone ? 'border-red-400' : 'border-white/20'} rounded-md px-4 py-2.5 text-text focus:outline-none focus:border-accent`}
                  />
                  {validationErrors.phone && <p className="text-red-400 text-xs mt-1">{validationErrors.phone}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-text-muted mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-transparent border ${validationErrors.email ? 'border-red-400' : 'border-white/20'} rounded-md px-4 py-2.5 text-text focus:outline-none focus:border-accent`}
                />
                {validationErrors.email && <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-2">Your Message</label>
                <textarea 
                  name="message" 
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-white/20 rounded-md px-4 py-2.5 text-text focus:outline-none focus:border-accent resize-none"
                  placeholder="Tell us what you'd like guidance on..."
                ></textarea>
              </div>

              {status.message && (
                <div className={`p-4 rounded-md text-sm ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {status.message}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-accent text-primary px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform mt-2"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>

          {/* Right: Info */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1 glass-card p-8 md:p-12 rounded-3xl h-fit"
          >
            <div className="space-y-8">
              <div>
                <h4 className="text-xs font-semibold text-accent uppercase mb-1">PHONE</h4>
                <a href="tel:+919876543210" className="text-text hover:text-accent transition-colors block">+91 98765 43210</a>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-accent uppercase mb-1">EMAIL</h4>
                <a href="mailto:contact@shwetaakapoorastrology.com" className="text-text hover:text-accent transition-colors block">contact@shwetaakapoorastrology.com</a>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-accent uppercase mb-1">STUDIO ADDRESS</h4>
                <a 
                  href="https://maps.google.com/?q=204,+Om+Sai+Complex,+College+Road,+Nashik,+Maharashtra" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-text hover:text-accent transition-colors block cursor-pointer"
                >
                  204, Om Sai Complex, College Road, Nashik,<br />Maharashtra
                </a>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-accent uppercase mb-1">CONSULTATION HOURS</h4>
                <p className="text-text">Mon – Sat, 10:00 AM – 7:00 PM</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="glass-card rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">Login Required</h3>
            <p className="text-text-muted mb-8 text-lg">
              Please log in to your account before sending a message.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowLoginModal(false)}
                className="px-6 py-3 rounded-full font-semibold border border-white/20 text-text hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <Link 
                to="/login"
                state={{ from: location }}
                className="px-8 py-3 rounded-full font-semibold bg-accent text-primary hover:bg-accent-hover transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Contact;
