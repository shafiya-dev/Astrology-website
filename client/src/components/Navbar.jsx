import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User as UserIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

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
    toast.success('Logged out successfully');
    navigate('/login');
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
        <NavLink to="/" className="text-xl font-semibold text-accent tracking-wide hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(227,181,42,0.8)] transition-all duration-300">
          Aacharya Shwetaa Kapoor
        </NavLink>
        
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          {links.map((link) => (
            <NavLink 
              key={link.path} 
              to={link.path}
              className={({ isActive }) => `relative pb-1 text-sm font-medium transition-all duration-300 group ${isActive ? 'text-accent' : 'text-text hover:text-accent'}`}
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-accent transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </>
              )}
            </NavLink>
          ))}
          {user && user.role === 'admin' ? (
            <NavLink to="/admin/messages" className="bg-gradient-to-r from-[#d4a94a] to-[#e3b52a] text-primary px-6 py-2.5 rounded-full font-bold shadow-[0_0_15px_rgba(227,181,42,0.4)] hover:shadow-[0_0_25px_rgba(227,181,42,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 text-sm ml-4 border border-white/20">
              Admin Dashboard
            </NavLink>
          ) : (
            <NavLink to="/contact" className="bg-accent text-primary px-6 py-2.5 rounded-full font-semibold hover:bg-accent-hover hover:scale-105 hover:shadow-[0_0_15px_rgba(227,181,42,0.4)] active:scale-95 transition-all duration-300 text-sm ml-4">
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
                    onClick={handleLogout}
                    className="px-4 py-3 text-sm text-left text-red-400 hover:bg-white/5 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="text-sm font-medium text-text hover:text-accent ml-6 border-l border-white/20 pl-6 transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_5px_rgba(227,181,42,0.5)]">
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


    </header>
  );
};

export default Navbar;
