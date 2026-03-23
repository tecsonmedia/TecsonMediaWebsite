import { motion } from 'motion/react';
import { useState } from 'react';
import { X } from 'lucide-react';
import { PortfolioItem } from '@/src/types';
import { cn } from '@/src/lib/utils';

const portfolioItems: PortfolioItem[] = [
  { id: '1', title: 'Modern Waterfront Estate', category: 'Exterior', imageUrl: 'https://picsum.photos/seed/estate-luxury/800/1000' },
  { id: '2', title: 'Minimalist Penthouse', category: 'Interior', imageUrl: 'https://picsum.photos/seed/penthouse-interior/800/1000' },
  { id: '3', title: 'Luxury Condo Lounge', category: 'Condo', imageUrl: 'https://picsum.photos/seed/condo-lounge/800/1000' },
  { id: '4', title: 'Corporate Headquarters', category: 'Commercial', imageUrl: 'https://picsum.photos/seed/office-modern/800/1000' },
  { id: '5', title: 'Victorian Cabbagetown Semi', category: 'Exterior', imageUrl: 'https://picsum.photos/seed/victorian-house/800/1000' },
  { id: '6', title: 'Modern Annex Kitchen', category: 'Interior', imageUrl: 'https://picsum.photos/seed/kitchen-luxury/800/1000' },
];

export default function Portfolio() {
  const [filter, setFilter] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categories = ['All', 'Interior', 'Exterior', 'Condo', 'Commercial'];
  const filteredItems = filter === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  return (
    <section id="portfolio" className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="max-w-xl">
            <h2 className="font-serif text-4xl font-light md:text-6xl">Selected <span className="italic text-gold">Works</span></h2>
            <p className="mt-4 text-sm uppercase tracking-widest opacity-60">Capturing the essence of Toronto's finest architecture.</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "text-xs font-medium uppercase tracking-widest transition-all",
                  filter === cat ? "text-gold underline underline-offset-8" : "opacity-50 hover:opacity-100"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="group relative cursor-pointer overflow-hidden rounded-lg aspect-[4/5] bg-dark"
              onClick={() => setSelectedImage(item.imageUrl)}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-80 brightness-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gold/5 mix-blend-overlay" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center transition-all duration-500 group-hover:scale-110">
                  <p className="font-serif text-2xl italic text-gold">Coming soon</p>
                  <p className="mt-2 text-[10px] uppercase tracking-widest text-white/60">Tecson Media</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute bottom-6 left-6">
                  <p className="text-xs font-medium uppercase tracking-widest text-gold">{item.category}</p>
                  <h3 className="mt-1 font-serif text-xl text-white">{item.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-10 right-10 text-white hover:text-gold"
          >
            <X className="h-8 w-8" />
          </button>
          {selectedImage ? (
            <img 
              src={selectedImage} 
              className="max-h-full max-w-full object-contain" 
              alt="Selected"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="text-center">
              <p className="font-serif text-3xl italic text-gold">Coming soon</p>
              <p className="mt-4 text-xs uppercase tracking-widest text-white/60">Tecson Media</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
