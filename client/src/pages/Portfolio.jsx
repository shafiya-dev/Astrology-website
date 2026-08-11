import { motion } from 'framer-motion';

const portfolioItems = [
  { id: 1, title: 'Astrology Workshop, Pune', src: '/portfolio-1.jpg' },
  { id: 2, title: 'Client Consultation Session', src: '/portfolio-2.jpg' },
  { id: 3, title: 'Numerology Talk, Nashik', src: '/portfolio-3.jpg' },
  { id: 4, title: 'Vastu Site Visit', src: '/portfolio-4.jpg' },
  { id: 5, title: 'Palmistry Demo, Mumbai Expo', src: '/portfolio-5.jpg' },
  { id: 6, title: 'Community Satsang Event', src: '/portfolio-6.jpg' },
];

const Portfolio = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24 pb-24 min-h-screen cosmic-bg"
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Portfolio</h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Events, workshops and moments from our astrology journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolioItems.map((item, idx) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col group cursor-pointer"
            >
              <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-4 border border-white/10 shadow-2xl">
                <img 
                  src={item.src} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="text-sm text-text-muted group-hover:text-accent transition-colors">{item.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Portfolio;
