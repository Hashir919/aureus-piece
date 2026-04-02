import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=2000"
          alt="Celestial Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-30 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-8 block text-white/60">
            Concept Artist & Visual Designer
          </span>
          <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.85] mb-12 uppercase">
            AUREUS <br /> 
            <span className="text-white/30">STUDIO</span>
          </h1>
          
          <div className="max-w-xl mx-auto mb-12">
            <p className="text-sm md:text-base font-medium tracking-wide text-white/50 leading-relaxed">
              Crafting ethereal digital experiences for world-builders, game studios, and visionary brands. Focused on the intersection of dark aesthetics and technical precision.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <motion.a
              href="#portfolio"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="pill-button pill-button-primary w-full md:w-auto"
            >
              View Work <ArrowRight size={16} />
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="pill-button pill-button-outline w-full md:w-auto"
            >
              Contact
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-white/20 to-transparent" />
    </section>
  );
}
