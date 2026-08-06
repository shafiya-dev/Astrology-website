import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

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
      const res = await fetch('http://localhost:5000/api/register', {
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
        // Redirect to login after successful registration, passing intended destination
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
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full px-6">
        <div className="bg-card-bg p-8 rounded-2xl border border-white/10 shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
          <p className="text-text-muted text-center mb-8">Join us for personalized guidance</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-text-muted mb-2">Full Name</label>
              <input 
                type="text" 
                name="name" 
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent border border-white/20 rounded-md px-4 py-2.5 text-text focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-2">Email Address</label>
              <input 
                type="email" 
                name="email" 
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border border-white/20 rounded-md px-4 py-2.5 text-text focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm text-text-muted mb-2">Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-transparent border border-white/20 rounded-md px-4 py-2.5 text-text focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-white/20 rounded-md px-4 py-2.5 text-text focus:outline-none focus:border-accent transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-text-muted mb-2">Confirm Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword" 
                  required
                  minLength="6"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-white/20 rounded-md px-4 py-2.5 text-text focus:outline-none focus:border-accent transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-accent text-primary px-8 py-3 rounded-full font-semibold hover:bg-accent-hover transition-colors mt-2"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-text-muted mt-8 text-sm">
            Already have an account? <Link to="/login" state={{ from: location.state?.from }} className="text-accent hover:underline font-medium">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
