const Footer = () => {
  return (
    <footer className="bg-primary py-12 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
        <p className="text-accent font-medium mb-1">Aacharya Shwetaa Kapoor • <span className="text-accent">Astrology, Palmistry & Numerology</span></p>
        
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm text-text-muted mb-6">
          <a href="tel:+919876543210" className="hover:text-accent transition-colors">+91 98765 43210</a>
          <span className="hidden md:inline">•</span>
          <a href="mailto:contact@shwetaakapoorastrology.com" className="hover:text-accent transition-colors">contact@shwetaakapoorastrology.com</a>
          <span className="hidden md:inline">•</span>
          <span>Nashik, Maharashtra</span>
        </div>

        <p className="text-xs text-text-muted">
          © {new Date().getFullYear()} Aacharya Shwetaa Kapoor. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
