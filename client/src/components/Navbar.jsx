import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Password modal states
  const [pwdForm, setPwdForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdStatus, setPwdStatus] = useState({ type: '', message: '' });
  const [pwdLoading, setPwdLoading] = useState(false);

  const dropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    navigate('/login');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      return setPwdStatus({ type: 'error', message: 'New passwords do not match' });
    }
    setPwdLoading(true);
    setPwdStatus({ type: '', message: '' });

    try {
      const res = await fetch('http://localhost:5000/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ oldPassword: pwdForm.oldPassword, newPassword: pwdForm.newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setPwdStatus({ type: 'success', message: 'Password updated successfully!' });
        setPwdForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setShowPasswordModal(false), 2000);
      } else {
        setPwdStatus({ type: 'error', message: data.message || 'Failed to update password' });
      }
    } catch (err) {
      setPwdStatus({ type: 'error', message: 'Server error occurred' });
    } finally {
      setPwdLoading(false);
    }
  };

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Testimonial', path: '/testimonial' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className="fixed w-full z-50 bg-primary/95 backdrop-blur-md py-4 shadow-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <NavLink to="/" className="text-xl font-semibold text-accent tracking-wide">
          Aacharya Shwetaa Kapoor
        </NavLink>
        
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          {links.map((link) => (
            <NavLink 
              key={link.path} 
              to={link.path}
              className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-accent' : 'text-text hover:text-accent'}`}
            >
              {link.name}
            </NavLink>
          ))}
          {user && user.role === 'admin' ? (
            <NavLink to="/admin/messages" className="bg-white/10 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-white/20 transition-colors text-sm ml-4">
              Admin Dashboard
            </NavLink>
          ) : (
            <NavLink to="/contact" className="bg-accent text-primary px-6 py-2.5 rounded-full font-semibold hover:bg-accent-hover transition-colors text-sm ml-4">
              Book Consultation
            </NavLink>
          )}
          {user ? (
            <div className="relative ml-6 border-l border-white/20 pl-6" ref={dropdownRef}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 text-sm font-medium text-white hover:text-accent transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <UserIcon size={16} />
                </div>
                <span>Hi, {user.name.split(' ')[0]}</span>
                <ChevronDown size={16} />
              </button>

              {/* Desktop Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-4 w-64 bg-card-bg border border-white/10 rounded-xl shadow-2xl py-2 flex flex-col z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white font-semibold truncate">{user.name}</p>
                    <p className="text-text-muted text-xs truncate">{user.email}</p>
                  </div>
                  <NavLink 
                    to="/account"
                    onClick={() => setShowDropdown(false)}
                    className="px-4 py-3 text-sm text-left text-text hover:bg-white/5 transition-colors"
                  >
                    My Account & Notifications
                  </NavLink>
                  <button 
                    onClick={() => { setShowDropdown(false); setShowPasswordModal(true); }}
                    className="px-4 py-3 text-sm text-left text-text hover:bg-white/5 transition-colors"
                  >
                    Change Password
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-3 text-sm text-left text-red-400 hover:bg-white/5 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="text-sm font-medium text-text hover:text-accent ml-6 border-l border-white/20 pl-6 transition-colors">
              Login
            </NavLink>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-accent" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="lg:hidden absolute top-full left-0 w-full bg-primary shadow-xl py-6 flex flex-col items-center space-y-6 border-b border-white/5">
          {links.map((link) => (
            <NavLink 
              key={link.path} 
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `text-base font-medium ${isActive ? 'text-accent' : 'text-text'}`}
            >
              {link.name}
            </NavLink>
          ))}
          {user && user.role === 'admin' ? (
            <NavLink to="/admin/messages" onClick={() => setIsOpen(false)} className="bg-white/10 text-white px-8 py-3 rounded-full font-semibold">
              Admin Dashboard
            </NavLink>
          ) : (
            <NavLink to="/contact" onClick={() => setIsOpen(false)} className="bg-accent text-primary px-8 py-3 rounded-full font-semibold">
              Book Consultation
            </NavLink>
          )}
          {user ? (
            <div className="flex flex-col items-center space-y-4 pt-4 border-t border-white/10 w-full">
              <div className="text-center">
                <p className="text-base font-medium text-white">{user.name}</p>
                <p className="text-sm text-text-muted">{user.email}</p>
              </div>
              <NavLink 
                to="/account"
                onClick={() => setIsOpen(false)} 
                className="text-base text-text hover:text-accent"
              >
                My Account
              </NavLink>
              <button onClick={() => { setIsOpen(false); setShowPasswordModal(true); }} className="text-base text-text hover:text-accent">
                Change Password
              </button>
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-base text-red-400 hover:text-red-300">
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" onClick={() => setIsOpen(false)} className="text-base font-medium text-text hover:text-accent pt-4 border-t border-white/10 w-full text-center">
              Login
            </NavLink>
          )}
        </nav>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8">
          <div className="bg-card-bg border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-white">Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">Current Password</label>
                <input 
                  type="password" 
                  required
                  value={pwdForm.oldPassword}
                  onChange={(e) => setPwdForm({...pwdForm, oldPassword: e.target.value})}
                  className="w-full bg-transparent border border-white/20 rounded-md px-4 py-2.5 text-text focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">New Password</label>
                <input 
                  type="password" 
                  required
                  minLength="6"
                  value={pwdForm.newPassword}
                  onChange={(e) => setPwdForm({...pwdForm, newPassword: e.target.value})}
                  className="w-full bg-transparent border border-white/20 rounded-md px-4 py-2.5 text-text focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  required
                  minLength="6"
                  value={pwdForm.confirmPassword}
                  onChange={(e) => setPwdForm({...pwdForm, confirmPassword: e.target.value})}
                  className="w-full bg-transparent border border-white/20 rounded-md px-4 py-2.5 text-text focus:outline-none focus:border-accent"
                />
              </div>

              {pwdStatus.message && (
                <p className={`text-sm text-center ${pwdStatus.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                  {pwdStatus.message}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-6 py-2.5 rounded-full font-semibold border border-white/20 text-text hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={pwdLoading}
                  className="flex-1 px-6 py-2.5 rounded-full font-semibold bg-accent text-primary hover:bg-accent-hover transition-colors"
                >
                  {pwdLoading ? 'Saving...' : 'Save Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
