import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { About as AboutType } from '../types';

export default function About() {
  const [about, setAbout] = useState<AboutType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data, error } = await supabase
          .from('about')
          .select('*')
          .single();

        if (error) throw error;
        setAbout(data as any);
      } catch (err) {
        console.error('Error fetching about section:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) return null;

  return (
    <section id="about" className="py-32 bg-[#050505] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block text-white/40">
              Our Philosophy
            </span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-12 leading-none uppercase">
              {about?.title || 'BEYOND THE'} <br /> <span className="text-white/20">{about?.subtitle || 'VISIBLE.'}</span>
            </h2>
            <div className="space-y-8 text-base md:text-lg text-white/50 font-medium leading-relaxed max-w-lg whitespace-pre-line">
              {about?.description || `Aureus Studio operates at the intersection of technical precision and ethereal aesthetics. We don't just build brands; we architect digital universes. Our process is a dialogue between the structured and the surreal.`}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-square bg-white/5 overflow-hidden rounded-3xl border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1000"
                alt="Studio space"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale opacity-40 hover:opacity-60 transition-opacity duration-700"
              />
            </div>
          </motion.div>
        </div>

        <div className="mt-40 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/5 pt-16">
          {(about?.stats || []).map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-4xl md:text-6xl font-black tracking-tighter mb-3">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
