import { motion, AnimatePresence } from 'motion/react';
import { Instagram, Twitter, Linkedin, MessageCircle, ExternalLink, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SocialLink } from '../types';

const ICON_MAP: Record<string, any> = {
  Instagram,
  Twitter,
  LinkedIn: Linkedin,
  WhatsApp: MessageCircle
};

export default function Contact() {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const { data } = await supabase.from('social_links').select('*').order('platform');
        if (data) setSocials(data);
      } catch (err) {
        console.error('Error fetching socials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSocials();
  }, []);

  return (
    <section id="contact" className="py-32 bg-[#050505] min-h-[80vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-10 block text-white/40">
              Connection
            </span>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-12 uppercase leading-[0.85]">
              LET'S CREATE <br /> <span className="text-white/20">SOMETHING</span> <br /> TIMELESS.
            </h2>
            <div className="flex items-center gap-4 text-white/40 uppercase text-[10px] font-bold tracking-[0.3em] mt-10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Available for New Projects
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-6">
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-10 block text-white/40">
                Social Links
              </span>
              
              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode='popLayout'>
                    {socials.map((social, i) => {
                    const Icon = ICON_MAP[social.platform] || ExternalLink;
                    return (
                        <motion.a
                        key={social.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white hover:text-black transition-all duration-500"
                        >
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:border-black/5 group-hover:bg-black/5 transition-colors">
                            <Icon size={22} strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold uppercase tracking-tight">{social.platform}</span>
                                <span className="text-[10px] text-white/20 group-hover:text-black/30 font-bold uppercase tracking-widest transition-colors">Connect</span>
                            </div>
                        </div>
                        <ChevronRight size={20} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </motion.a>
                    );
                    })}
                </AnimatePresence>

                {!loading && socials.length === 0 && (
                    <div className="p-16 border border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center text-center">
                         <p className="text-white/20 uppercase text-[10px] font-bold tracking-[0.2em]">Contact details coming soon.</p>
                    </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
