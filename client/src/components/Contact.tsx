import { motion } from 'motion/react';
import { Instagram, Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-32 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block text-white/40">
              Get in Touch
            </span>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-12 uppercase leading-[0.9]">
              LET'S CREATE <br /> <span className="text-white/20">SOMETHING</span> <br /> TIMELESS.
            </h2>
            
            <div className="space-y-10 mt-16">
              <div className="flex items-center space-x-8">
                <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                  <Mail size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 mb-1">Email us</p>
                  <a href="mailto:hello@aureuspiece.com" className="text-xl font-bold hover:text-white/60 transition-colors">
                    hello@aureus.studio
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-10 border-t border-white/5">
                <div className="flex space-x-4">
                  {[
                    { icon: Instagram, label: 'Instagram' },
                    { icon: Twitter, label: 'Twitter' },
                    { icon: Linkedin, label: 'LinkedIn' },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href="#"
                      className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all bg-white/5"
                      aria-label={social.label}
                    >
                      <social.icon size={18} strokeWidth={1.5} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 p-10 md:p-16 rounded-[2.5rem]"
          >
            <form className="space-y-10">
              <div className="space-y-3">
                <label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-white transition-colors font-medium text-lg"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-3">
                <label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-white transition-colors font-medium text-lg"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="message" className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full bg-transparent border-b border-white/10 py-4 focus:outline-none focus:border-white transition-colors font-medium text-lg resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                className="pill-button pill-button-primary w-full py-6 text-sm"
              >
                <span>Send Message</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
