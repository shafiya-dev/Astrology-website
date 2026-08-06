import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
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

function App() {
  return (
    <ReactLenis root>
      <Router>
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
