import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Add same typing restrictions as Contact form
    if (name === 'name') value = value.replace(/[^a-zA-Z\s]/g, '');
    if (name === 'phone') value = value.replace(/\D/g, '').slice(0, 10);
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return setError('Please enter a valid email address');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.phone.length !== 10) {
      return setError('Phone number must be exactly 10 digits');
    }

    setLoading(true);

    try {
      const res = await fetch('https://astrology-backend-xhfi.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success('Account created successfully!');
        navigate('/login', { state: { from: location.state?.from } });
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center cosmic-bg relative">
      <div className="max-w-md w-full px-6 relative z-10">
        <div className="glass-card p-8 rounded-2xl animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
          <p className="text-text-muted text-center mb-8">Join us for personalized guidance</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-text-muted mb-2 font-medium">Full Name</label>
              <input 
                type="text" 
                name="name" 
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full glass-input rounded-xl px-4 py-3 text-text outline-none"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-2 font-medium">Email Address</label>
              <input 
                type="email" 
                name="email" 
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full glass-input rounded-xl px-4 py-3 text-text outline-none"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm text-text-muted mb-2 font-medium">Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                required
                pattern="^[7-9]\d{9}$"
                onInvalid={(e) => e.target.setCustomValidity('Please enter a valid 10-digit Indian mobile number')}
                onInput={(e) => { e.target.setCustomValidity(''); handleChange(e); }}
                value={formData.phone}
                className="w-full glass-input rounded-xl px-4 py-3 text-text outline-none"
                placeholder="10-digit mobile number"
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-2 font-medium">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  required
                  pattern="(?=.*\d)(?=.*[!@#$%^&*]).{6,}"
                  onInvalid={(e) => e.target.setCustomValidity('Password must be at least 6 characters with at least one number and one special character')}
                  onInput={(e) => e.target.setCustomValidity('')}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full glass-input rounded-xl px-4 py-3 text-text outline-none pr-12"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-text-muted mb-2 font-medium">Confirm Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword" 
                  required
                  pattern="(?=.*\d)(?=.*[!@#$%^&*]).{6,}"
                  onInvalid={(e) => e.target.setCustomValidity('Password must be at least 6 characters with at least one number and one special character')}
                  onInput={(e) => e.target.setCustomValidity('')}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full glass-input rounded-xl px-4 py-3 text-text outline-none pr-12"
                  placeholder="Repeat your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center font-medium bg-red-400/10 py-2 rounded-lg border border-red-400/20">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-accent text-primary px-8 py-3.5 rounded-xl font-bold hover:bg-accent-hover hover:scale-[1.02] shadow-lg hover:shadow-accent/20 transition-all duration-300 mt-4"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-text-muted mt-8 text-sm">
            Already have an account? <Link to="/login" state={{ from: location.state?.from }} className="text-accent hover:underline font-medium transition-colors">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
