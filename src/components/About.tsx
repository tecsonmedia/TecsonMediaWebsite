import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="py-24 px-6 overflow-hidden bg-white dark:bg-dark/50">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative z-10 aspect-[3/4] overflow-hidden rounded-2xl bg-dark"
            >
              <img
                src="https://picsum.photos/seed/luxury-vision/800/1000"
                alt="Luxurious Vision"
                className="h-full w-full object-cover opacity-60 transition-transform duration-700 hover:scale-110 brightness-110 contrast-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gold/5 mix-blend-overlay" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-serif text-2xl italic text-gold">Coming soon</p>
                  <p className="mt-2 text-[10px] uppercase tracking-widest text-white/60">Tecson Media</p>
                </div>
              </div>
            </motion.div>
            <div className="absolute -bottom-10 -right-10 -z-0 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
          </div>

          <div>
            <h2 className="font-serif text-4xl font-light md:text-6xl">The <span className="italic text-gold">Vision</span></h2>
            <div className="mt-8 space-y-6 text-lg font-light leading-relaxed opacity-80">
              <p>
                Tecson Media was founded on a simple principle: every property has a story that deserves to be told with elegance and precision. Based in the heart of Toronto, I specialize in capturing the architectural brilliance of the city's most prestigious listings.
              </p>
              <p>
                With a fresh perspective and 1-2 years of dedicated experience in architectural photography, I combine technical curiosity with a natural eye for composition. I don't just take photos; I create visual experiences that resonate with high-end buyers.
              </p>
              <p>
                My 24-hour turnaround and seamless booking process make me a reliable partner for Toronto's realtors. When you work with Tecson Media, you're investing in a visual standard that sets your listings apart.
              </p>
            </div>
            
            <div className="mt-12 flex items-center gap-8">
              <div>
                <p className="text-3xl font-serif text-gold">1+</p>
                <p className="text-xs uppercase tracking-widest opacity-60">Properties Shot</p>
              </div>
              <div className="h-12 w-px bg-dark/10 dark:bg-paper/10" />
              <div>
                <p className="text-3xl font-serif text-gold">New</p>
                <p className="text-xs uppercase tracking-widest opacity-60">Business</p>
              </div>
              <div className="h-12 w-px bg-dark/10 dark:bg-paper/10" />
              <div>
                <p className="text-3xl font-serif text-gold">24h</p>
                <p className="text-xs uppercase tracking-widest opacity-60">Delivery Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
