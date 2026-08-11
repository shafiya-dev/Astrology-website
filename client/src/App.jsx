import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { Toaster, toast } from 'react-hot-toast';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Testimonial from './pages/Testimonial';
import Contact from './pages/Contact';
import AdminContact from './pages/AdminContact';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.role === 'admin') {
    return children;
  }
  return <Navigate to="/" />;
};

const AutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let timeout;
    
    const resetTimer = () => {
      clearTimeout(timeout);
      // 10 minutes = 600,000 ms
      timeout = setTimeout(() => {
        const token = localStorage.getItem('token');
        if (token) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          toast.error('Session expired due to inactivity', { duration: 4000 });
          navigate('/login', { replace: true });
        }
      }, 600000);
    };

    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [navigate]);

  return null;
};

function App() {
  return (
    <ReactLenis root>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#352055',
            color: '#F5F1E8',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          },
          success: { iconTheme: { primary: '#E3B52A', secondary: '#352055' } },
        }} 
      />
      <Router>
        <AutoLogout />
        <div className="flex flex-col min-h-screen bg-primary text-text font-sans selection:bg-accent selection:text-primary">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/testimonial" element={<Testimonial />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<Account />} />
              <Route path="/admin/messages" element={
                <AdminRoute>
                  <AdminContact />
                </AdminRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ReactLenis>
  );
}

export default App;
