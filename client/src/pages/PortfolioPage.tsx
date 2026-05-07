import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Project, Category } from '../types';
import { X, ArrowRight } from 'lucide-react';

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [projRes, catRes] = await Promise.all([
          supabase.from('portfolio').select('*, categories(*)').order('created_at', { ascending: false }),
          supabase.from('categories').select('*').order('name')
        ]);

        if (isMounted) {
          if (projRes.data) setProjects(projRes.data as any);
          if (catRes.data) setCategories(catRes.data as any);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
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

  const filteredProjects = selectedCategory
    ? projects.filter(p => p.category_id === selectedCategory)
    : projects;

  return (
    <div className="min-h-screen bg-[#050505] pt-28 md:pt-40 pb-16 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Header */}
        <div className="mb-12 md:mb-24">
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block text-white/40">
            Curation
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter uppercase mb-8 md:mb-12">
            PORTFOLIO<span className="text-white/20">.</span>
          </h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 md:gap-4 items-center border-t border-white/5 pt-8 md:pt-12 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 md:px-8 py-2.5 md:py-4 rounded-full text-[9px] md:text-[10px] uppercase font-bold tracking-widest transition-all whitespace-nowrap ${
                selectedCategory === null 
                ? 'bg-white text-black' 
                : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
              }`}
            >
              All Artifacts
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 md:px-8 py-2.5 md:py-4 rounded-full text-[9px] md:text-[10px] uppercase font-bold tracking-widest transition-all whitespace-nowrap ${
                  selectedCategory === cat.id 
                  ? 'bg-white text-black' 
                  : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white/5 rounded-2xl md:rounded-3xl aspect-[4/5]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-12">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
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
                      {(project as any).categories?.name || 'Uncategorized'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Project Modal */}
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
    </div>
  );
}
