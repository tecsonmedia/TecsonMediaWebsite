import { motion } from 'motion/react';
import { Camera, Video, Plane, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Hero() {
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Abstract Luxury Background with Warm Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1502239608882-93b729c6af43?auto=format&fit=crop&q=80&w=1920"
          alt="Abstract Luxury Texture"
          className="h-full w-full object-cover brightness-[0.4]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-dark/60 via-dark/40 to-gold/20" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="font-serif text-5xl font-light tracking-tight md:text-7xl lg:text-8xl">
            Toronto Real Estate Photography That <span className="italic text-gold">Sells Listings Faster</span>
          </h1>
          <p className="mt-6 text-lg font-light tracking-wide text-white/80 md:text-xl">
            Premium visual storytelling for the most exclusive properties in the GTA.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.a
              href="#booking"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-medium uppercase tracking-widest text-dark transition-colors hover:bg-white"
            >
              Book a Shoot <Calendar className="h-4 w-4" />
            </motion.a>
            <motion.a
              href="#portfolio"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-medium uppercase tracking-widest text-white backdrop-blur-md transition-colors hover:bg-white hover:text-dark"
            >
              View Portfolio <ArrowRight className="h-4 w-4" />
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-12 w-6 justify-center rounded-full border-2 border-white/30 p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-2 w-1 rounded-full bg-white"
          />
        </div>
      </motion.div>
    </section>
  );
}
