import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const fallbackTestimonials = [
  { quote: "Her prediction about my job change was spot on. I felt guided every step of the way.", name: "Riya Sharma", city: "Mumbai", image: "/riya_profile.jpg" },
  { quote: "The numerology report explained patterns in my life I could never understand before.", name: "Amit Verma", city: "Pune", image: "/amit_profile.jpg" },
  { quote: "Vastu changes she suggested for our home brought a noticeably calmer atmosphere.", name: "Sneha Joshi", city: "Nashik", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256" },
  { quote: "Very compassionate and honest. Her palmistry reading was detailed and accurate.", name: "Karan Mehta", city: "Delhi", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256&h=256" },
  { quote: "I consult her every year before major decisions — she's been right every time.", name: "Priya Nair", city: "Bengaluru", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=256&h=256" },
  { quote: "Professional, warm and deeply knowledgeable. Highly recommend her sessions.", name: "Rohit Deshmukh", city: "Nagpur", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256" }
];

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);

  useEffect(() => {
    fetch('http://localhost:5000/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setTestimonials(data);
        }
      })
      .catch(err => console.error("Error fetching testimonials, using fallback.", err));
  }, []);

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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Client Testimonials</h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Real stories from clients who found clarity through our guidance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(212, 169, 74, 0.2)" }}
              className="glass-card p-8 rounded-2xl flex flex-col h-full border-white/5 hover:border-accent/30 transition-all shadow-xl"
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-accent fill-accent" />
                ))}
              </div>
              <p className="text-text leading-relaxed mb-8 flex-grow text-lg">
                “{item.quote}”
              </p>
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/10">
                <img 
                  src={item.image || fallbackTestimonials[idx % 6].image} 
                  alt={item.name}
                  className="w-14 h-14 rounded-full object-cover border border-accent/30 shadow-sm"
                />
                <div>
                  <h4 className="text-white font-bold text-base">{item.name}</h4>
                  <p className="text-text-muted text-sm">{item.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Testimonial;
