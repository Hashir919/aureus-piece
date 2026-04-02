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
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;
        setTestimonials(data as any);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load insights.');
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section className="py-32 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-24">
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block text-white/40">
            Voices of Trust
          </span>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase">
            CLIENT REVIEWS<span className="text-white/20">.</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-12 bg-white/5 border border-white/5 rounded-3xl h-64" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-white/40">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative p-12 bg-white/5 border border-white/5 rounded-3xl hover:border-white/20 transition-colors"
              >
                <Quote className="absolute top-8 right-8 text-white/5" size={48} />
                <p className="text-lg text-white/70 italic leading-relaxed mb-10 relative z-10 font-medium">
                  "{testimonial.review}"
                </p>
                <div>
                  <h4 className="font-bold text-xl uppercase tracking-tight">{testimonial.name}</h4>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mt-2">
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
