import { useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';

const AnimatedCounter = ({ from = 0, to, suffix = "", duration = 2, decimals = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && ref.current) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          ref.current.textContent = value.toFixed(decimals) + suffix;
        }
      });
      return () => controls.stop();
    }
  }, [isInView, from, to, suffix, duration, decimals]);

  return <span ref={ref}>{from}{suffix}</span>;
};

const About = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24 min-h-screen cosmic-bg"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-7xl mx-auto px-6 text-center mb-16"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">About Us</h1>
        <p className="text-text-muted text-lg">The journey, philosophy and credentials behind the guidance</p>
      </motion.div>

      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 mb-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex-1 w-full flex justify-center"
        >
          <div className="rounded-xl overflow-hidden w-full max-w-[400px]">
            <img src="/about-profile.jpg" alt="Aacharya Shwetaa Kapoor" className="w-full h-auto" />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex-1 text-left"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Meet Aacharya Shwetaa Kapoor</h2>
          <div className="space-y-4 text-text-muted leading-relaxed">
            <p>
              With over 15 years of practice in Vedic astrology, palmistry, numerology and Vastu Shastra, Aacharya Shwetaa Kapoor has helped thousands of clients across India and abroad navigate career, relationship and health decisions with confidence.
            </p>
            <p>
              Her approach blends deep-rooted classical texts with a warm, modern counselling style — making ancient wisdom feel personal and practical for everyday life.
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto px-6 text-center mb-20"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Guiding Philosophy</h2>
        <p className="text-lg md:text-xl text-text-muted leading-relaxed">
          “Astrology does not remove your free will — it simply lights the path so you can walk it with confidence.”
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 pb-24">
        {[
          { to: 15, suffix: "+", label: "Years of Practice" },
          { to: 8000, suffix: "+", label: "Clients Guided" },
          { to: 4, suffix: "", label: "Areas of Expertise" },
          { to: 4.9, suffix: "★", label: "Average Rating", decimals: 1 }
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className="glass-card p-8 rounded-xl text-center hover:border-accent/30 transition-all hover:scale-[1.02]"
          >
            <h3 className="text-4xl font-bold text-accent mb-3">
              <AnimatedCounter to={stat.to} suffix={stat.suffix} decimals={stat.decimals} />
            </h3>
            <p className="text-text-muted text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default About;
