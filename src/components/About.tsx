import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="py-24 px-6 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative z-10 aspect-[3/4] overflow-hidden rounded-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=800"
                alt="Photographer"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute -bottom-10 -right-10 -z-0 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
          </div>

          <div>
            <h2 className="font-serif text-4xl font-light md:text-6xl">The <span className="italic text-gold">Vision</span></h2>
            <div className="mt-8 space-y-6 text-lg font-light leading-relaxed opacity-80">
              <p>
                Tecson Media was founded on a simple principle: every property has a story that deserves to be told with elegance and precision. Based in the heart of Toronto, we specialize in capturing the architectural brilliance of the city's most prestigious listings.
              </p>
              <p>
                With over a decade of experience in architectural photography, our team combines technical mastery with an artistic eye. We don't just take photos; we create visual experiences that resonate with high-end buyers.
              </p>
              <p>
                Our 24-hour turnaround and seamless booking process make us the preferred partner for Toronto's top-producing realtors. When you work with Tecson Media, you're investing in a visual standard that sets your listings apart.
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
