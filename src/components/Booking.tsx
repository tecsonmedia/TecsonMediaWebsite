import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Home, User, Mail, CheckCircle, Phone } from 'lucide-react';

export default function Booking() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    propertyType: 'Detached House',
    dateTime: ''
  });

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('Server health:', data);
      } catch (error) {
        console.error('Server health check failed:', error);
      }
    };
    checkServer();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/booking/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Booking confirm error response:', text);
        throw new Error('Failed to confirm booking');
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Booking error:', error);
      alert('There was an error processing your booking. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="booking" className="py-24 px-6 bg-paper dark:bg-dark/50">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl font-light md:text-6xl">Book Your <span className="italic text-gold">Session</span></h2>
            <p className="mt-6 text-lg font-light opacity-70">
              Ready to elevate your listing? Fill out the form below to request a booking. I will get back to you within 24 hours to confirm the details.
            </p>

            <div className="mt-12 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <MapPin className="text-gold" />
                  <p className="text-sm">Serving Toronto and surrounding areas</p>
                </div>
                <div className="flex items-center gap-4">
                  <Calendar className="text-gold" />
                  <p className="text-sm">Available Mon-Sat, 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-dark/5 bg-white p-8 shadow-2xl dark:border-white/5 dark:bg-white/5">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex h-full flex-col items-center justify-center text-center"
              >
                <div className="rounded-full bg-gold/10 p-6 text-gold">
                  <CheckCircle className="h-12 w-12" />
                </div>
                <h3 className="mt-6 font-serif text-3xl">Booking Received</h3>
                <p className="mt-4 opacity-60">I've sent a confirmation email with all the details. See you soon!</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 text-xs font-bold uppercase tracking-widest text-gold hover:underline"
                >
                  Book another shoot
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-30" />
                      <input 
                        required 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-dark/10 bg-transparent py-3 pl-12 pr-4 focus:border-gold focus:outline-none dark:border-white/10" 
                        placeholder="John Doe" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-30" />
                      <input 
                        required 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-dark/10 bg-transparent py-3 pl-12 pr-4 focus:border-gold focus:outline-none dark:border-white/10" 
                        placeholder="john@example.com" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-30" />
                    <input 
                      required 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-dark/10 bg-transparent py-3 pl-12 pr-4 focus:border-gold focus:outline-none dark:border-white/10" 
                      placeholder="+1 (416) 000-0000" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-60">Property Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-30" />
                    <input 
                      required 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-dark/10 bg-transparent py-3 pl-12 pr-4 focus:border-gold focus:outline-none dark:border-white/10" 
                      placeholder="123 Luxury Lane, Toronto" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Property Type</label>
                    <div className="relative">
                      <Home className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-30" />
                      <select 
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        className="w-full appearance-none rounded-xl border border-dark/10 bg-transparent py-3 pl-12 pr-4 focus:border-gold focus:outline-none dark:border-white/10"
                      >
                        <option>Detached House</option>
                        <option>Condo / Apartment</option>
                        <option>Commercial Space</option>
                        <option>Townhouse</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-60">Preferred Date</label>
                    <input 
                      required 
                      type="datetime-local" 
                      name="dateTime"
                      value={formData.dateTime}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-dark/10 bg-transparent py-3 px-4 focus:border-gold focus:outline-none dark:border-white/10" 
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-dark py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-gold hover:text-dark dark:bg-paper dark:text-dark dark:hover:bg-gold disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
