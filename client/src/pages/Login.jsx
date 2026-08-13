import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Login = () => {
  // Login State
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot Password State
  const [step, setStep] = useState('login'); // 'login' | 'forgot-email' | 'forgot-otp' | 'forgot-reset'
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timer, setTimer] = useState(0);
  
  // Reset Password Visibility State
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    let interval;
    if (step === 'forgot-otp' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const endpoint = formData.email === 'admin@gmail.com' 
        ? 'https://astrology-backend-xhfi.onrender.com/api/admin/login' 
        : 'https://astrology-backend-xhfi.onrender.com/api/login';

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
          toast.success('Logged in successfully');
          navigate('/admin/messages', { replace: true });
        } else {
          toast.success('Logged in successfully');
          navigate(from, { replace: true });
        }
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      toast.error('Server connection failed. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://astrology-backend-xhfi.onrender.com/api/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setStep('forgot-otp');
        setTimer(60);
        toast.success('OTP has been sent to your email address.');
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      toast.error('Server connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://astrology-backend-xhfi.onrender.com/api/forgot-password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp })
      });
      const data = await res.json();
      if (res.ok) {
        setStep('forgot-reset');
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (err) {
      toast.error('Server connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://astrology-backend-xhfi.onrender.com/api/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password reset successfully! You can now login.');
        setStep('login');
        setForgotEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.message || 'Failed to reset password');
      }
    } catch (err) {
      toast.error('Server connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelForgotFlow = () => {
    setStep('login');
    setForgotEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center cosmic-bg relative">
      <div className="max-w-md w-full px-6 relative z-10">
        <div className="glass-card p-8 rounded-2xl animate-fade-in">
          
          {step === 'login' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
              <p className="text-text-muted text-center mb-8">Login to continue your journey</p>
              
              <form onSubmit={handleLoginSubmit} className="space-y-5">
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
                  <div className="flex justify-between mb-2">
                    <label className="block text-sm text-text-muted font-medium">Password</label>
                    <button type="button" onClick={() => { setStep('forgot-email'); }} className="text-xs text-accent hover:underline transition-colors">Forgot Password?</button>
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password" 
                      required
                      minLength="6"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full glass-input rounded-xl px-4 py-3 text-text outline-none pr-12"
                      placeholder="Enter your password"
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

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-accent text-primary px-8 py-3.5 rounded-xl font-bold hover:bg-accent-hover hover:scale-[1.02] shadow-lg hover:shadow-accent/20 transition-all duration-300 mt-4"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <p className="text-center text-text-muted mt-8 text-sm">
                New user? <Link to="/register" state={{ from: location.state?.from }} className="text-accent hover:underline font-medium transition-colors">Register here</Link>
              </p>
            </div>
          )}

          {step === 'forgot-email' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-center mb-2">Forgot Password</h2>
              <p className="text-text-muted text-center text-sm mb-8">Enter your registered email address to receive an OTP.</p>
              
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label className="block text-sm text-text-muted mb-2 font-medium">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full glass-input rounded-xl px-4 py-3 text-text outline-none"
                    placeholder="e.g. hello@example.com"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button 
                    type="button" 
                    onClick={cancelForgotFlow}
                    className="flex-1 border border-white/10 text-text bg-white/5 px-5 py-2.5 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-accent text-primary px-5 py-2.5 rounded-xl font-bold hover:bg-accent-hover hover:scale-[1.02] shadow-lg hover:shadow-accent/20 transition-all duration-300"
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'forgot-otp' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-center mb-2">Verify OTP</h2>
              <p className="text-text-muted text-center text-sm mb-8">Enter the 6-digit code sent to <span className="text-accent font-semibold">{forgotEmail}</span></p>
              
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-sm text-text-muted mb-2 font-medium">OTP Code</label>
                  <input 
                    type="text" 
                    required
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full glass-input rounded-xl px-4 py-3 text-text outline-none text-center tracking-[0.7em] font-mono text-xl font-bold"
                    placeholder="------"
                  />
                </div>

                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={timer > 0 || loading}
                    className={`text-sm font-medium transition-all ${timer > 0 ? 'text-text-muted cursor-not-allowed' : 'text-accent hover:underline'}`}
                  >
                    {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                  </button>
                </div>

                <div className="flex gap-4 pt-2">
                  <button 
                    type="button" 
                    onClick={cancelForgotFlow}
                    className="flex-1 border border-white/10 text-text bg-white/5 px-5 py-2.5 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-accent text-primary px-5 py-2.5 rounded-xl font-bold hover:bg-accent-hover hover:scale-[1.02] shadow-lg hover:shadow-accent/20 transition-all duration-300"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'forgot-reset' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>
              <p className="text-text-muted text-center text-sm mb-8">Create a new password for your account.</p>
              
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-sm text-text-muted mb-2 font-medium">New Password</label>
                  <div className="relative">
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      required
                      minLength="6"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full glass-input rounded-xl px-4 py-3 text-text outline-none pr-12"
                      placeholder="At least 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-2 font-medium">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      required
                      minLength="6"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full glass-input rounded-xl px-4 py-3 text-text outline-none pr-12"
                      placeholder="Repeat password"
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

                <div className="flex gap-4 pt-2">
                  <button 
                    type="button" 
                    onClick={cancelForgotFlow}
                    className="flex-1 border border-white/10 text-text bg-white/5 px-5 py-2.5 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-accent text-primary px-5 py-2.5 rounded-xl font-bold hover:bg-accent-hover hover:scale-[1.02] shadow-lg hover:shadow-accent/20 transition-all duration-300"
                  >
                    {loading ? 'Saving...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;
