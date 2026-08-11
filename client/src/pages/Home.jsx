import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AreasOfGuidance = [
  { icon: <img src="/vedic-icon.png" alt="Vedic Astrology" className="w-full h-full object-cover rounded-full" />, title: 'Vedic Astrology', desc: 'Birth chart analysis, dasha predictions and remedies rooted in classical Vedic tradition.' },
  { icon: <img src="/palmistry-icon.png" alt="Palmistry" className="w-full h-full object-cover rounded-full" />, title: 'Palmistry', desc: 'Read the story written in your palm — career, relationships, health and destiny.' },
  { icon: <img src="/numerology-icon.png" alt="Numerology" className="w-full h-full object-cover rounded-full" />, title: 'Numerology', desc: 'Discover how your name and birth numbers shape your personality and life path.' },
  { icon: <img src="/vastu-icon.png" alt="Vastu Shastra" className="w-full h-full object-cover rounded-full" />, title: 'Vastu Shastra', desc: 'Harmonise your home or workplace with energy-aligned space consultations.' },
];

const Home = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen font-sans"
    >
      {/* Hero Section */}
      <section 
        className="relative pt-40 pb-20 overflow-hidden text-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/cosmic-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-primary/70 backdrop-blur-[1px]"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-primary to-transparent"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="px-6 max-w-4xl mx-auto z-10 relative flex flex-col items-center"
        >
          <p className="text-accent uppercase tracking-[0.2em] text-xs font-bold mb-6">
            VEDIC ASTROLOGY &bull; NUMEROLOGY &bull; PALMISTRY &bull; VASTU
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight leading-tight">
            Discover Your Cosmic Path
          </h1>
          <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            Personalised astrology, palmistry and numerology guidance from Aacharya Shwetaa Kapoor — helping you align with the stars for a life of clarity, purpose and peace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="w-full sm:w-auto bg-accent text-primary px-8 py-3.5 rounded-full font-bold text-sm hover:scale-105 transition-transform">
              Book a Consultation
            </Link>
            <Link to="/services" className="w-full sm:w-auto border border-accent text-accent px-8 py-3.5 rounded-full font-bold text-sm hover:bg-accent/10 transition-colors">
              Explore Services
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Areas of Guidance */}
      <section className="pt-10 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Areas of Guidance</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {AreasOfGuidance.map((area, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(212, 169, 74, 0.2)" }}
                className="bg-card-bg p-8 rounded-xl border border-transparent hover:border-accent/30 transition-colors"
              >
                <div className="mb-6 w-16 h-16">
                  {area.icon}
                </div>
                <h3 className="text-lg font-bold mb-3 text-accent">{area.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{area.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl relative border border-white/5 aspect-square">
              {/* Using the user's profile image */}
              <img src="/assets/img10.jpg" alt="Aacharya Shwetaa Kapoor" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-left"
          >
            <p className="text-accent uppercase tracking-wider text-xs font-bold mb-4">ABOUT AACHARYA SHWETAA KAPOOR</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">15+ Years of Guiding Souls Through the Stars</h2>
            <p className="text-text-muted mb-8 leading-relaxed text-sm">
              A trusted name in Vedic astrology, palmistry and numerology, Aacharya Shwetaa Kapoor has guided thousands of clients toward clarity in career, relationships and life decisions — blending ancient wisdom with practical, compassionate advice.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-accent font-bold text-sm hover:gap-3 transition-all">
              Read Full Story <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Testimonial */}
      <section className="py-24 px-6 bg-primary-light">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-xl md:text-2xl italic leading-relaxed mb-6 font-medium">
            “Aacharya ji's guidance during my career transition was uncannily accurate. Her remedies brought real peace and clarity.”
          </p>
          <p className="text-accent font-semibold text-sm">— Riya Sharma, Mumbai</p>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center bg-card-bg/50 border-y border-white/5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">Ready to Align With Your Destiny?</h2>
          <Link to="/contact" className="inline-block bg-accent text-primary px-8 py-3.5 rounded-full font-bold text-sm hover:scale-105 transition-transform">
            Book Your Consultation Today
          </Link>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default Home;
