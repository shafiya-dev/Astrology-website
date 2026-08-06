import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    setLoading(true);

    try {
      const endpoint = formData.email === 'admin@gmail.com' 
        ? 'http://localhost:5000/api/admin/login' 
        : 'http://localhost:5000/api/login';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user || { role: 'admin' })); // Fallback if user object is missing
        
        if (data.user?.role === 'admin' || formData.email === 'admin@gmail.com') {
          navigate('/admin/messages', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setError(data.message || 'Login failed');
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
          <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
          <p className="text-text-muted text-center mb-8">Login to continue your journey</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex justify-between mb-2">
                <label className="block text-sm text-text-muted">Password</label>
                <Link to="#" className="text-xs text-accent hover:underline">Forgot Password?</Link>
              </div>
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

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-accent text-primary px-8 py-3 rounded-full font-semibold hover:bg-accent-hover transition-colors"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-text-muted mt-8 text-sm">
            New user? <Link to="/register" state={{ from: location.state?.from }} className="text-accent hover:underline font-medium">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
