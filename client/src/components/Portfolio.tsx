import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Project } from '../types';
import { X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio')
          .select('*, categories(*)')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;
        if (isMounted) setProjects(data as any);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        if (isMounted) setError('Failed to load portfolio artifacts.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProjects();
    return () => { isMounted = false; };
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  return (
    <section id="portfolio" className="py-16 md:py-32 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-24">
          <div>
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block text-white/40">
              Selected Works
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter uppercase">
              FEATURED<span className="text-white/20">.</span>
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-white/40 max-w-sm text-xs sm:text-sm leading-relaxed font-medium">
            A curated selection of digital artifacts and visual experiences that define our technical precision.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse aspect-[4/5] bg-white/5 rounded-2xl md:rounded-3xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-12 mb-12 md:mb-20 text-left">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-white/5 mb-3 md:mb-8 rounded-2xl md:rounded-3xl border border-white/10">
                    <img
                      src={`${project.image_url}?auto=format&fit=crop&q=70&w=600`}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      style={{ willChange: 'transform' }}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-xl font-bold tracking-tight mb-1 md:mb-2 uppercase">{project.title}</h3>
                    <p className="text-[9px] md:text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">
                      {(project as any).categories?.name || 'Artifact'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-16 md:mt-32">
              <Link to="/portfolio" className="pill-button pill-button-outline flex items-center gap-4">
                View Full Curation <ArrowRight size={18} />
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 md:backdrop-blur-xl"
            onClick={() => setSelectedProject(null)}
          >
            {/* Close button */}
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedProject(null); }}
              className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all z-20"
            >
              <X size={20} />
            </button>

            {/* Mobile: fullscreen image only */}
            <div className="flex lg:hidden items-center justify-center w-full h-full p-4">
              <motion.img
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={selectedProject.image_url}
                alt={selectedProject.title}
                onClick={(e) => e.stopPropagation()}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl"
              />
            </div>

            {/* Desktop: image + details side by side */}
            <div className="hidden lg:flex items-center justify-center w-full h-full p-12" onClick={(e) => e.stopPropagation()}>
              <div className="max-w-6xl w-full grid grid-cols-2 gap-16 items-center">
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                  <img src={selectedProject.image_url} alt={selectedProject.title} className="w-full h-auto max-h-[80vh] object-contain" />
                </motion.div>
                <div className="text-left">
                  <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block text-white/30">
                    {(selectedProject as any).categories?.name || 'Artifact'}
                  </span>
                  <h2 className="text-5xl xl:text-7xl font-black tracking-tighter mb-10 uppercase leading-none">{selectedProject.title}<span className="text-white/20">.</span></h2>
                  <p className="text-base text-white/50 leading-relaxed mb-12 max-w-md font-medium">{selectedProject.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
