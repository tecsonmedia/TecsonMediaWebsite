import { motion } from 'motion/react';
import { Camera, Video, Plane, Zap, Clock, Award } from 'lucide-react';

const services = [
  {
    icon: <Camera className="h-8 w-8" />,
    title: "Real Estate Photography",
    description: "High-end HDR photography with professional retouching. I focus on composition and lighting to make spaces feel expansive and inviting.",
    price: "Starting at $50"
  },
  {
    icon: <Video className="h-8 w-8" />,
    title: "Cinematic Videography",
    description: "4K cinematic property tours that tell a story. Includes drone footage, music licensing, and agent branding.",
    price: "Starting at $150"
  },
  {
    icon: <Plane className="h-8 w-8" />,
    title: "Aerial Drone Services",
    description: "Licensed drone pilots capturing stunning aerial perspectives of the property and its surrounding neighborhood.",
    price: "Starting at $100"
  }
];

const features = [
  { icon: <Clock />, title: "24h Turnaround", desc: "Next-day delivery for all photography." },
  { icon: <Zap />, title: "Instant Booking", desc: "Schedule your shoot in seconds online." },
  { icon: <Award />, title: "Premium Quality", desc: "Magazine-quality visuals for every listing." }
];

export default function Services() {
  return (
    <section id="services" className="bg-dark py-24 px-6 text-paper">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="font-serif text-4xl font-light md:text-6xl">Our <span className="italic text-gold">Services</span></h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-light opacity-70">
            Comprehensive visual marketing solutions designed to elevate your brand and sell listings faster.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="group rounded-2xl border border-white/10 bg-white/5 p-10 transition-all hover:border-gold/50 hover:bg-gold/5"
            >
              <div className="text-gold">{service.icon}</div>
              <h3 className="mt-6 font-serif text-2xl">{service.title}</h3>
              <p className="mt-4 text-sm font-light leading-relaxed opacity-60">{service.description}</p>
              <div className="mt-8 flex items-center justify-between">
                <span className="text-lg font-medium text-gold">{service.price}</span>
                <a href="#booking" className="text-xs font-bold uppercase tracking-widest hover:text-gold">Request Quote</a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-1 gap-8 border-t border-white/10 pt-24 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-6">
              <div className="rounded-full bg-gold/10 p-4 text-gold">{feature.icon}</div>
              <div>
                <h4 className="font-medium uppercase tracking-widest">{feature.title}</h4>
                <p className="mt-2 text-sm font-light opacity-60">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
