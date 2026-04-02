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
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio')
          .select('*, categories(*)')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;
        setProjects(data as any);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Failed to load portfolio artifacts.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section id="portfolio" className="py-32 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24">
          <div>
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block text-white/40">
              Selected Works
            </span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">
              FEATURED<span className="text-white/20">.</span>
            </h2>
          </div>
          <p className="mt-8 md:mt-0 text-white/40 max-w-sm text-sm leading-relaxed font-medium">
            A curated selection of digital artifacts and visual experiences that define our technical precision.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse aspect-[4/5] bg-white/5 rounded-3xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20 text-left">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-white/5 mb-8 rounded-3xl border border-white/10">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight mb-2 uppercase">{project.title}</h3>
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">
                      {(project as any).categories?.name || 'Artifact'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-32">
              <Link to="/portfolio" className="pill-button pill-button-outline flex items-center gap-4">
                View Full Curation <ArrowRight size={18} />
              </Link>
            </div>
          </>
        )}
      </div>

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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
