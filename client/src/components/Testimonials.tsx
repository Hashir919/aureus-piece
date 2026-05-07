import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Testimonial } from '../types';
import { Quote } from 'lucide-react';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;
        if (isMounted) setTestimonials(data as any);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        if (isMounted) setError('Failed to load insights.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTestimonials();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="py-16 md:py-32 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center mb-12 md:mb-24">
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block text-white/40">
            Voices of Trust
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase">
            CLIENT REVIEWS<span className="text-white/20">.</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-8 md:p-12 bg-white/5 border border-white/5 rounded-2xl md:rounded-3xl h-48 md:h-64" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-white/40">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-12">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative p-6 md:p-12 bg-white/5 border border-white/5 rounded-2xl md:rounded-3xl hover:border-white/10 transition-colors"
              >
                <Quote className="absolute top-4 right-4 md:top-8 md:right-8 text-white/5" size={32} />
                <p className="text-sm md:text-lg text-white/70 italic leading-relaxed mb-6 md:mb-10 relative z-10 font-medium">
                  "{testimonial.review}"
                </p>
                <div>
                  <h4 className="font-bold text-base md:text-xl uppercase tracking-tight">{testimonial.name}</h4>
                  <p className="text-[9px] md:text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mt-1 md:mt-2">
                    {testimonial.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
