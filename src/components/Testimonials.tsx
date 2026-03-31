import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Coming Soon",
    role: "Verified Client",
    content: "Client feedback will be displayed here soon. I am committed to providing exceptional service to every partner.",
    rating: 5
  },
  {
    name: "Coming Soon",
    role: "Verified Client",
    content: "Client feedback will be displayed here soon. I am committed to providing exceptional service to every partner.",
    rating: 5
  },
  {
    name: "Coming Soon",
    role: "Verified Client",
    content: "Client feedback will be displayed here soon. I am committed to providing exceptional service to every partner.",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-white dark:bg-dark/30">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <Quote className="h-12 w-12 text-gold opacity-20" />
          <h2 className="mt-6 font-serif text-4xl font-light md:text-5xl">What Our <span className="italic text-gold">Clients Say</span></h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={`${t.name}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="rounded-3xl border border-dark/5 bg-white p-10 shadow-xl dark:border-white/5 dark:bg-white/5"
            >
              <div className="flex gap-1 text-gold">
                {[...Array(t.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-6 text-lg font-light italic leading-relaxed opacity-80">"{t.content}"</p>
              <div className="mt-8">
                <p className="font-medium uppercase tracking-widest">{t.name}</p>
                <p className="text-xs text-gold">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
