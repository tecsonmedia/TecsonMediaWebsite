import { motion } from 'motion/react';
import { Instagram, Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark py-20 px-6 text-paper">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <a href="#home" className="font-serif text-3xl font-bold tracking-tighter">
              TECSON<span className="text-gold italic">MEDIA</span>
            </a>
            <p className="text-sm font-light leading-relaxed opacity-60">
              Premium real estate photography for Toronto's most exclusive listings. Elevating property marketing through cinematic visuals.
            </p>
            <div className="flex gap-4">
              <a href="#" className="rounded-full border border-white/10 p-2 transition-colors hover:bg-gold hover:text-dark">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-full border border-white/10 p-2 transition-colors hover:bg-gold hover:text-dark">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-full border border-white/10 p-2 transition-colors hover:bg-gold hover:text-dark">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium uppercase tracking-widest">Quick Links</h4>
            <ul className="mt-6 space-y-4 text-sm font-light opacity-60">
              <li><a href="#home" className="hover:text-gold">Home</a></li>
              <li><a href="#portfolio" className="hover:text-gold">Portfolio</a></li>
              <li><a href="#services" className="hover:text-gold">Services</a></li>
              <li><a href="#about" className="hover:text-gold">About</a></li>
              <li><a href="#booking" className="hover:text-gold">Book a Shoot</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium uppercase tracking-widest">Contact</h4>
            <ul className="mt-6 space-y-4 text-sm font-light opacity-60">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gold" />
                hello@tecsonmedia.to
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gold" />
                +1 (416) 555-0123
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gold" />
                Downtown Toronto, ON
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium uppercase tracking-widest">Newsletter</h4>
            <p className="mt-6 text-sm font-light opacity-60">Get the latest real estate marketing tips and exclusive offers.</p>
            <form className="mt-6 flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-gold focus:outline-none"
              />
              <button className="rounded-xl bg-gold py-3 text-xs font-bold uppercase tracking-widest text-dark hover:bg-white transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-10 text-xs font-light opacity-40 md:flex-row">
          <p>© 2026 Tecson Media Toronto. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-gold">Privacy Policy</a>
            <a href="#" className="hover:text-gold">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
