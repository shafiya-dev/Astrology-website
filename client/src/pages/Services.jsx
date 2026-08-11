import { motion } from 'framer-motion';

const services = [
  {
    title: 'Vedic Astrology Consultation',
    desc: 'In-depth birth chart reading covering career, marriage, health and finance with practical remedies.',
    duration: '60 min',
    price: '₹2,100',
  },
  {
    title: 'Palmistry Reading',
    desc: 'Detailed hand analysis revealing personality traits, life events and future tendencies.',
    duration: '45 min',
    price: '₹1,500',
  },
  {
    title: 'Numerology Report',
    desc: 'Personalised report based on your name and birth date numbers, with guidance for key decisions.',
    duration: '45 min',
    price: '₹1,800',
  },
  {
    title: 'Vastu Consultation',
    desc: 'On-site or virtual space assessment with energy-alignment recommendations for home or office.',
    duration: '90 min',
    price: '₹3,500',
  }
];

const Services = () => {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Personalised consultations tailored to your unique cosmic blueprint
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(212, 169, 74, 0.2)" }}
              className="glass-card p-10 rounded-2xl flex flex-col justify-center transition-all"
            >
              <h3 className="text-2xl font-semibold mb-4 text-accent">{service.title}</h3>
              <p className="text-text-muted leading-relaxed mb-6">{service.desc}</p>
              <p className="text-text font-medium">{service.duration} &bull; {service.price}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Services;
