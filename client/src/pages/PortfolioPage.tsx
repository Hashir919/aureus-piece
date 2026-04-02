import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Project, Category } from '../types';
import { X, ArrowRight, Filter } from 'lucide-react';

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projRes, catRes] = await Promise.all([
        supabase.from('portfolio').select('*, categories(*)').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name')
      ]);

      if (projRes.data) setProjects(projRes.data as any);
      if (catRes.data) setCategories(catRes.data as any);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = selectedCategory
    ? projects.filter(p => p.category_id === selectedCategory)
    : projects;

  return (
    <div className="min-h-screen bg-[#050505] pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-24">
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block text-white/40">
            Curation
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-12">
            PORTFOLIO<span className="text-white/20">.</span>
          </h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center border-t border-white/5 pt-12">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-8 py-4 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all ${
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
                className={`px-8 py-4 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all ${
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white/5 rounded-3xl aspect-[4/5]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-white/5 mb-8 rounded-3xl border border-white/10">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight mb-2 uppercase">{project.title}</h3>
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">
                      {(project as any).categories?.name || 'Uncategorized'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Project Modal - Simplified */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 bg-black/95 backdrop-blur-3xl"
          >
            <button onClick={() => setSelectedProject(null)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors z-10"><X size={32}/></button>
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="aspect-[4/5] overflow-hidden rounded-3xl border border-white/10">
                <img src={selectedProject.image_url} alt={selectedProject.title} className="w-full h-full object-cover" />
              </motion.div>
              <div className="text-left">
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block text-white/30">
                  {(selectedProject as any).categories?.name || 'Artifact'}
                </span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 uppercase leading-none">{selectedProject.title}<span className="text-white/20">.</span></h2>
                <p className="text-base text-white/50 leading-relaxed mb-12 max-w-md font-medium">{selectedProject.description}</p>
                <div className="flex gap-4">
                    <button className="pill-button pill-button-primary">Launch Experience <ArrowRight size={18}/></button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
