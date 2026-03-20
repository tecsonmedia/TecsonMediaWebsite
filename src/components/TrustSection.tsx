import { motion } from 'motion/react';

const brands: string[] = [];

export default function TrustSection() {
  return (
    <section className="py-16 border-y border-dark/5 dark:border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] opacity-40">Trusted by Toronto's Top Brokerages</p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
          {brands.map((brand) => (
            <span key={brand} className="font-serif text-2xl font-bold tracking-tighter md:text-3xl">{brand}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
