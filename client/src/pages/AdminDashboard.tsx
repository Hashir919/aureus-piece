import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Project, Testimonial, About, Category, SocialLink } from '../types';
import {
  Plus, Trash2, Edit, LogOut,
  Layout, Users, FileText,
  Upload, CheckCircle2, AlertCircle, Grid, Link as LinkIcon, Menu, X
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'projects' | 'testimonials' | 'about' | 'categories' | 'social_links'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [uploadLoading, setUploadLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [projRes, catRes, testRes, socialRes, aboutRes] = await Promise.all([
        supabase.from('portfolio').select('*, categories(*)').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('testimonials').select('*').order('id', { ascending: false }),
        supabase.from('social_links').select('*').order('platform'),
        supabase.from('about').select('*').maybeSingle()
      ]);

      if (projRes.data) setProjects(projRes.data as any);
      if (catRes.data) setCategories(catRes.data as any);
      if (testRes.data) setTestimonials(testRes.data as any);
      if (socialRes.data) setSocialLinks(socialRes.data as any);
      if (aboutRes.data) setAbout(aboutRes.data as any);

    } catch (err) {
      showToast('Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      showToast('Image uploaded');
    } catch (err: any) {
      showToast('Upload failed', 'error');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tableMapping = {
      'projects': 'portfolio',
      'testimonials': 'testimonials',
      'categories': 'categories',
      'about': 'about',
      'social_links': 'social_links'
    };
    const table = (tableMapping as any)[activeTab];

    try {
      if (activeTab === 'about') {
        const { error } = await supabase.from('about').upsert({
          id: about?.id || undefined,
          ...formData
        });
        if (error) throw error;
      } else {
        if (editingItem) {
          const { error } = await supabase.from(table).update(formData).eq('id', editingItem.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from(table).insert(formData);
          if (error) throw error;
        }
      }
      showToast('Saved successfully');
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Delete this artifact?')) return;
    const tableMapping = {
      'projects': 'portfolio',
      'testimonials': 'testimonials',
      'categories': 'categories',
      'social_links': 'social_links'
    };
    const table = (tableMapping as any)[activeTab];

    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      showToast('Deleted');
      fetchData();
    } catch (err: any) {
      showToast('Delete failed', 'error');
    }
  };

  const openEditModal = (item: any = null) => {
    setEditingItem(item);
    setFormData(item || {});
    setIsModalOpen(true);
  };

  const handleTabChange = (tabId: any) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  const tabs = useMemo(() => [
    { id: 'projects', label: 'Portfolio', icon: Layout },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'testimonials', label: 'Testimonials', icon: Users },
    { id: 'social_links', label: 'Social Links', icon: LinkIcon },
    { id: 'about', label: 'About', icon: FileText },
  ], []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#050505] sticky top-0 z-[45]">
        <h1 className="text-lg font-black tracking-tighter uppercase">AUREUS<span className="text-white/20">.</span>CMS</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-50 top-0 left-0 h-full w-64 md:w-80 
        border-r border-white/5 p-6 md:p-10 flex flex-col bg-[#050505]
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <h1 className="hidden md:block text-2xl font-black tracking-tighter uppercase mb-20">AUREUS<span className="text-white/20">.</span>CMS</h1>
        <nav className="space-y-3 md:space-y-4 flex-grow">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`w-full flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] uppercase font-bold tracking-[0.2em] transition-all ${activeTab === tab.id ? 'bg-white text-black' : 'text-white/40 hover:text-white'
                }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 text-white/40 hover:text-red-400 text-[10px] uppercase font-bold tracking-[0.2em] transition-colors"><LogOut size={16} /> Sign Out</button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 md:p-12 lg:p-20 overflow-y-auto min-h-0">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter uppercase">{activeTab}<span className="text-white/20">.</span></h2>
          {activeTab !== 'about' && (
            <button onClick={() => openEditModal()} className="pill-button pill-button-primary text-[9px] md:text-xs"><Plus size={16} /> New {activeTab.slice(0, -1)}</button>
          )}
        </header>

        {loading ? (
          <div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
            {activeTab === 'projects' && projects.map((p) => (
              <div key={p.id} className="bg-white/5 p-4 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 relative group">
                <img src={`${p.image_url}?auto=format&fit=crop&q=70&w=600`} className="w-full aspect-video object-cover rounded-xl md:rounded-2xl mb-4 md:mb-6" loading="lazy" />
                <div className="absolute top-6 right-6 md:top-12 md:right-12 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                  <button onClick={() => openEditModal(p)} className="p-2 md:p-3 bg-white/10 backdrop-blur-xl rounded-lg md:rounded-xl hover:bg-white hover:text-black transition-colors"><Edit size={14} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 md:p-3 bg-white/10 backdrop-blur-xl rounded-lg md:rounded-xl hover:bg-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>
                <h3 className="text-sm md:text-lg font-bold uppercase mb-1 md:mb-2">{p.title}</h3>
                <p className="text-[9px] md:text-[10px] text-white/30 uppercase font-bold tracking-widest">{(p as any).categories?.name || 'Uncategorized'}</p>
              </div>
            ))}

            {activeTab === 'categories' && categories.map((c) => (
              <div key={c.id} className="bg-white/5 p-5 md:p-8 rounded-2xl md:rounded-3xl flex justify-between items-center border border-white/5">
                <h3 className="font-bold uppercase tracking-widest text-sm md:text-base">{c.name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(c)} className="p-2 hover:text-white text-white/30 transition-colors"><Edit size={14} /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 hover:text-red-400 text-white/30 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}

            {activeTab === 'testimonials' && testimonials.map((t) => (
              <div key={t.id} className="bg-white/5 p-5 md:p-8 rounded-2xl md:rounded-3xl border border-white/5">
                <div className="flex justify-between mb-3 md:mb-4">
                  <h4 className="font-bold uppercase tracking-tight text-sm md:text-base">{t.name}</h4>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(t)} className="text-white/30 hover:text-white transition-colors"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(t.id)} className="text-white/30 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-white/50 italic mb-3 md:mb-4">"{t.review}"</p>
                <p className="text-[9px] md:text-[10px] text-white/20 font-bold uppercase">{t.role}</p>
              </div>
            ))}

            {activeTab === 'social_links' && socialLinks.map((s) => (
              <div key={s.id} className="bg-white/5 p-5 md:p-8 rounded-2xl md:rounded-3xl border border-white/5">
                <div className="flex justify-between mb-3 md:mb-4">
                  <h4 className="font-bold uppercase tracking-tight text-sm md:text-base">{s.platform}</h4>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(s)} className="text-white/30 hover:text-white transition-colors"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(s.id)} className="text-white/30 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="text-[9px] md:text-[10px] text-white/50 truncate mb-1">{s.url}</p>
              </div>
            ))}

            {activeTab === 'about' && (
              <div className="col-span-full bg-white/5 p-6 md:p-12 rounded-2xl md:rounded-[40px] border border-white/5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-6 md:mb-10">
                  <div>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2 block">{about?.caption || 'OUR PHILOSOPHY'}</span>
                    <h3 className="text-2xl md:text-4xl font-black uppercase mb-3 md:mb-4">{about?.title || 'BEYOND THE'} <span className="text-white/20">{about?.subtitle || 'VISIBLE.'}</span></h3>
                    <p className="text-sm md:text-lg text-white/50 leading-relaxed whitespace-pre-line">{about?.content || 'No story content yet.'}</p>
                  </div>
                  {about?.image_url && (
                    <img src={`${about.image_url}?auto=format&fit=crop&q=60&w=800`} className="w-full aspect-square object-cover rounded-2xl md:rounded-3xl opacity-50" loading="lazy" />
                  )}
                </div>
                <button onClick={() => openEditModal(about)} className="pill-button pill-button-outline text-[9px] md:text-xs"><Edit size={16} /> Edit About Section</button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#0a0a0a] border border-white/10 p-6 md:p-12 rounded-2xl md:rounded-[40px] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
                {activeTab === 'projects' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div className="space-y-4 md:space-y-6">
                      <input value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-admin" placeholder="Title" required />
                      <select value={formData.category_id || ''} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} className="input-admin appearance-none" required>
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-admin h-32" placeholder="Description" required />
                    </div>
                    <div className="aspect-[4/5] bg-white/5 rounded-2xl md:rounded-3xl relative overflow-hidden group border-2 border-dashed border-white/10">
                      {formData.image_url ? (
                        <>
                          <img src={formData.image_url} className="w-full h-full object-cover" />
                          <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"><Upload size={24} /><input type="file" className="hidden" onChange={handleImageUpload} /></label>
                        </>
                      ) : (
                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                          {uploadLoading ? <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white" /> : <Plus size={32} />}
                          <span className="text-[10px] font-bold uppercase mt-4">Upload Fragment</span>
                          <input type="file" className="hidden" onChange={handleImageUpload} />
                        </label>
                      )}
                    </div>
                  </div>
                )}
                {activeTab === 'categories' && (
                  <input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-admin" placeholder="Category Name" required />
                )}
                {activeTab === 'testimonials' && (
                  <div className="space-y-4 md:space-y-6">
                    <input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-admin" placeholder="Name" required />
                    <input value={formData.role || ''} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="input-admin" placeholder="Role" required />
                    <textarea value={formData.review || ''} onChange={(e) => setFormData({ ...formData, review: e.target.value })} className="input-admin h-32" placeholder="Review" required />
                  </div>
                )}
                {activeTab === 'social_links' && (
                  <div className="space-y-4 md:space-y-6">
                    <select value={formData.platform || ''} onChange={(e) => setFormData({ ...formData, platform: e.target.value })} className="input-admin appearance-none" required>
                      <option value="">Select Platform</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Twitter">Twitter</option>
                      <option value="Discord">Discord</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="WhatsApp">WhatsApp</option>
                    </select>
                    <input value={formData.url || ''} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className="input-admin" placeholder="Link URL" required />
                  </div>
                )}
                {activeTab === 'about' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div className="space-y-4 md:space-y-6">
                      <input value={formData.caption || ''} onChange={(e) => setFormData({ ...formData, caption: e.target.value })} className="input-admin" placeholder="Small Caption" required />
                      <input value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-admin" placeholder="Main Title" required />
                      <input value={formData.subtitle || ''} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="input-admin" placeholder="Subtitle" required />
                      <textarea value={formData.content || ''} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="input-admin h-48" placeholder="Story content..." required />
                    </div>
                    <div className="aspect-square bg-white/5 rounded-2xl md:rounded-3xl relative overflow-hidden group border-2 border-dashed border-white/10">
                      {formData.image_url ? (
                        <>
                          <img src={formData.image_url} className="w-full h-full object-cover" />
                          <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"><Upload size={24} /><input type="file" className="hidden" onChange={handleImageUpload} /></label>
                        </>
                      ) : (
                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                          {uploadLoading ? <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white" /> : <Plus size={32} />}
                          <span className="text-[10px] font-bold uppercase mt-4">Upload About Image</span>
                          <input type="file" className="hidden" onChange={handleImageUpload} />
                        </label>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <button type="submit" className="pill-button pill-button-primary">Save Changes</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="pill-button pill-button-outline">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 md:bottom-10 md:right-10 flex items-center gap-3 md:gap-4 px-5 md:px-8 py-3 md:py-5 rounded-xl md:rounded-2xl border backdrop-blur-xl z-[60] ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
