import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react';

const servicesList = [
  { id: 'vedic', title: 'Vedic Astrology Consultation', duration: '60 min', price: 2100 },
  { id: 'palmistry', title: 'Palmistry Reading', duration: '45 min', price: 1500 },
  { id: 'numerology', title: 'Numerology Report', duration: '45 min', price: 1800 },
  { id: 'vastu', title: 'Vastu Consultation', duration: '90 min', price: 3500 },
];

const Book = () => {
  const [selectedService, setSelectedService] = useState(null);
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    if (name === 'name') {
      value = value.replace(/[^a-zA-Z\s]/g, '');
    }
    
    if (name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const isFormValid = selectedService && formData.date && formData.time && formData.name && formData.phone && formData.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    setLoading(true);
    const bookingData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service: selectedService.title,
      preferredDateTime: `${formData.date} at ${formData.time}`,
      notes: formData.message
    };

    try {
      const res = await fetch('https://astrology-backend-xhfi.onrender.com/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert('Failed to submit booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-primary pt-32 pb-20 flex items-center justify-center px-4 cosmic-bg relative">
        <div className="max-w-md w-full glass-card p-10 rounded-2xl text-center">
          <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
          <h2 className="text-3xl font-heading font-bold text-accent mb-4">Thank You!</h2>
          <p className="text-text-muted mb-8 text-lg">Your booking request has been received. We'll confirm your slot shortly.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-accent hover:bg-accent-hover text-primary font-bold py-3 rounded-xl transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary pt-28 pb-20 px-4 md:px-8 cosmic-bg relative">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-accent mb-4">Book Your Consultation</h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">Choose your service and share your details — we'll confirm your slot shortly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Step 1 */}
          <section>
            <h2 className="text-2xl font-heading text-accent mb-6 flex items-center"><span className="bg-accent text-primary w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">1</span> Select Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicesList.map(service => (
                <div 
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`cursor-pointer border-2 rounded-xl p-6 transition-all ${selectedService?.id === service.id ? 'border-accent bg-accent/10 shadow-[0_0_15px_rgba(227,181,42,0.2)]' : 'border-white/10 glass-card hover:border-white/30'}`}
                >
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-text-muted mb-4">{service.duration}</p>
                  <p className="text-accent font-bold text-lg">₹{service.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Step 2 */}
          <section>
            <h2 className="text-2xl font-heading text-accent mb-6 flex items-center"><span className="bg-accent text-primary w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">2</span> Date & Time</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-text-muted mb-2 font-medium">Preferred Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/70 w-5 h-5" />
                  <input 
                    type="date" 
                    name="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-white/20 rounded-xl pl-12 pr-4 py-3 text-text focus:outline-none focus:border-accent [color-scheme:dark]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2 font-medium">Preferred Time (Mon–Sat, 10 AM–7 PM)</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/70 w-5 h-5" />
                  <input 
                    type="time" 
                    name="time"
                    required
                    min="10:00"
                    max="19:00"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-white/20 rounded-xl pl-12 pr-4 py-3 text-text focus:outline-none focus:border-accent [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Step 3 */}
          <section>
            <h2 className="text-2xl font-heading text-accent mb-6 flex items-center"><span className="bg-accent text-primary w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">3</span> Your Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/70 w-5 h-5" />
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="Full Name *"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-white/20 rounded-xl pl-12 pr-4 py-3 text-text focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/70 w-5 h-5" />
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    pattern="^[7-9]\d{9}$"
                    onInvalid={(e) => e.target.setCustomValidity('Please enter a valid 10-digit Indian mobile number')}
                    onInput={(e) => e.target.setCustomValidity('')}
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-white/20 rounded-xl pl-12 pr-4 py-3 text-text focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/70 w-5 h-5" />
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-white/20 rounded-xl pl-12 pr-4 py-3 text-text focus:outline-none focus:border-accent"
                />
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-accent/70 w-5 h-5" />
                <textarea 
                  name="message"
                  placeholder="Message / Guidance Required (Optional)"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-white/20 rounded-xl pl-12 pr-4 py-3 text-text focus:outline-none focus:border-accent resize-none"
                ></textarea>
              </div>
            </div>
          </section>

          {/* Summary & Submit */}
          <section className="glass-card p-6 md:p-8 rounded-2xl border border-accent/30">
            <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Booking Summary</h3>
            {selectedService ? (
              <div className="space-y-3 mb-8">
                <div className="flex justify-between">
                  <span className="text-text-muted">Service</span>
                  <span className="font-bold">{selectedService.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Duration</span>
                  <span>{selectedService.duration}</span>
                </div>
                <div className="flex justify-between text-lg pt-3 border-t border-white/10">
                  <span className="font-bold text-accent">Consultation Fee</span>
                  <span className="font-bold text-accent">₹{selectedService.price.toLocaleString()}</span>
                </div>
                <p className="text-xs text-text-muted mt-2 italic text-center">* No payment is required right now. You will pay after confirmation.</p>
              </div>
            ) : (
              <p className="text-text-muted mb-8 italic">Please select a service above to see the summary.</p>
            )}
            
            <button 
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full font-bold py-4 rounded-xl transition-all ${
                !isFormValid 
                  ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                  : 'bg-accent hover:bg-accent-hover text-primary shadow-[0_0_20px_rgba(227,181,42,0.4)] hover:shadow-[0_0_30px_rgba(227,181,42,0.6)]'
              }`}
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </section>
        </form>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="glass-card rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">Login Required</h3>
            <p className="text-text-muted mb-8 text-lg">
              Please log in to your account before booking a service.
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
    </div>
  );
};

export default Book;
