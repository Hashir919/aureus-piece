import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Project, Testimonial, About, Category, SocialLink } from '../types';
import {
  Plus, Trash2, Edit, LogOut,
  Layout, Users, FileText,
  Upload, CheckCircle2, AlertCircle, Grid, Link as LinkIcon
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

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

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
      'about': 'about'
    };
    const table = tableMapping[activeTab];

    try {
      if (activeTab === 'about') {
        const { error } = await supabase.from('about').upsert({
          id: about?.id || undefined,
          content: formData.content
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
    const table = tableMapping[activeTab];

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

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-80 border-r border-white/5 p-10 flex flex-col">
        <h1 className="text-2xl font-black tracking-tighter uppercase mb-20">AUREUS<span className="text-white/20">.</span>CMS</h1>
        <nav className="space-y-4 flex-grow">
          {[
            { id: 'projects', label: 'Portfolio', icon: Layout },
            { id: 'categories', label: 'Categories', icon: Grid },
            { id: 'testimonials', label: 'Testimonials', icon: Users },
            { id: 'social_links', label: 'Social Links', icon: LinkIcon },
            { id: 'about', label: 'About', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] uppercase font-bold tracking-[0.2em] transition-all ${activeTab === tab.id ? 'bg-white text-black' : 'text-white/40 hover:text-white'
                }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-4 text-white/40 hover:text-red-400 text-[10px] uppercase font-bold tracking-[0.2em]"><LogOut size={16} /> Sign Out</button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-20 overflow-y-auto">
        <header className="flex justify-between items-end mb-16">
          <h2 className="text-5xl font-black tracking-tighter uppercase">{activeTab}<span className="text-white/20">.</span></h2>
          {activeTab !== 'about' && (
            <button onClick={() => openEditModal()} className="pill-button pill-button-primary"><Plus size={18} /> New {activeTab.slice(0, -1)}</button>
          )}
        </header>

        {loading ? (
          <div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {activeTab === 'projects' && projects.map((p) => (
              <div key={p.id} className="bg-white/5 p-8 rounded-3xl border border-white/5 relative group">
                <img src={p.image_url} className="w-full aspect-video object-cover rounded-2xl mb-6 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute top-12 right-12 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(p)} className="p-3 bg-white/10 backdrop-blur-xl rounded-xl hover:bg-white hover:text-black"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-3 bg-white/10 backdrop-blur-xl rounded-xl hover:bg-red-500"><Trash2 size={16} /></button>
                </div>
                <h3 className="text-lg font-bold uppercase mb-2">{p.title}</h3>
                <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{(p as any).categories?.name || 'Uncategorized'}</p>
              </div>
            ))}

            {activeTab === 'categories' && categories.map((c) => (
              <div key={c.id} className="bg-white/5 p-8 rounded-3xl flex justify-between items-center border border-white/5">
                <h3 className="font-bold uppercase tracking-widest">{c.name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(c)} className="p-2 hover:text-white text-white/30"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 hover:text-red-400 text-white/30"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}

            {activeTab === 'testimonials' && testimonials.map((t) => (
              <div key={t.id} className="bg-white/5 p-8 rounded-3xl border border-white/5">
                <div className="flex justify-between mb-4">
                  <h4 className="font-bold uppercase tracking-tight">{t.name}</h4>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(t)} className="text-white/30 hover:text-white"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(t.id)} className="text-white/30 hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="text-sm text-white/50 italic mb-4">"{t.review}"</p>
                <p className="text-[10px] text-white/20 font-bold uppercase">{t.role}</p>
              </div>
            ))}

            {activeTab === 'social_links' && socialLinks.map((s) => (
              <div key={s.id} className="bg-white/5 p-8 rounded-3xl border border-white/5">
                <div className="flex justify-between mb-4">
                  <h4 className="font-bold uppercase tracking-tight">{s.platform}</h4>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(s)} className="text-white/30 hover:text-white"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(s.id)} className="text-white/30 hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="text-[10px] text-white/50 truncate mb-1">{s.url}</p>
              </div>
            ))}

            {activeTab === 'about' && (
              <div className="col-span-full bg-white/5 p-12 rounded-[40px] border border-white/5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-10">
                  <div>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2 block">{about?.caption || 'OUR PHILOSOPHY'}</span>
                    <h3 className="text-4xl font-black uppercase mb-4">{about?.title || 'BEYOND THE'} <span className="text-white/20">{about?.subtitle || 'VISIBLE.'}</span></h3>
                    <p className="text-lg text-white/50 leading-relaxed whitespace-pre-line">{about?.content || 'No story content yet.'}</p>
                  </div>
                  {about?.image_url && (
                    <img src={about.image_url} className="w-full aspect-square object-cover rounded-3xl grayscale opacity-50" />
                  )}
                </div>
                <button onClick={() => openEditModal(about)} className="pill-button pill-button-outline"><Edit size={16} /> Edit About Section</button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/[0.03] border border-white/10 p-12 rounded-[40px] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-10">
                {activeTab === 'projects' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <input value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-admin" placeholder="Title" required />
                      <select value={formData.category_id || ''} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} className="input-admin appearance-none" required>
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-admin h-32" placeholder="Description" required />
                    </div>
                    <div className="aspect-[4/5] bg-white/5 rounded-3xl relative overflow-hidden group border-2 border-dashed border-white/10">
                      {formData.image_url ? (
                        <>
                          <img src={formData.image_url} className="w-full h-full object-cover" />
                          <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer"><Upload size={24} /><input type="file" className="hidden" onChange={handleImageUpload} /></label>
                        </>
                      ) : (
                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5">
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
                  <div className="space-y-6">
                    <input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-admin" placeholder="Name" required />
                    <input value={formData.role || ''} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="input-admin" placeholder="Role" required />
                    <textarea value={formData.review || ''} onChange={(e) => setFormData({ ...formData, review: e.target.value })} className="input-admin h-32" placeholder="Review" required />
                  </div>
                )}
                {activeTab === 'social_links' && (
                  <div className="space-y-6">
                    <select value={formData.platform || ''} onChange={(e) => setFormData({ ...formData, platform: e.target.value })} className="input-admin appearance-none" required>
                      <option value="">Select Platform</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Twitter">Twitter</option>
                      <option value="discord">Discord</option>
                      <option value="bluesky">Bluesky</option>
                      <option value="tikTok">TikTok</option>
                      <option value="spotify">Spotify </option>
                      <option value="vgen">Vgen</option>
                    </select>
                    <input value={formData.url || ''} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className="input-admin" placeholder="Link URL" required />
                  </div>
                )}
                {activeTab === 'about' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <input value={formData.caption || ''} onChange={(e) => setFormData({ ...formData, caption: e.target.value })} className="input-admin" placeholder="Small Caption (e.g. OUR PHILOSOPHY)" required />
                      <input value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-admin" placeholder="Main Title (e.g. BEYOND THE)" required />
                      <input value={formData.subtitle || ''} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="input-admin" placeholder="Subtitle (e.g. VISIBLE.)" required />
                      <textarea value={formData.content || ''} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="input-admin h-48" placeholder="Story content..." required />
                    </div>
                    <div className="aspect-square bg-white/5 rounded-3xl relative overflow-hidden group border-2 border-dashed border-white/10">
                      {formData.image_url ? (
                        <>
                          <img src={formData.image_url} className="w-full h-full object-cover" />
                          <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer"><Upload size={24} /><input type="file" className="hidden" onChange={handleImageUpload} /></label>
                        </>
                      ) : (
                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5">
                          {uploadLoading ? <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white" /> : <Plus size={32} />}
                          <span className="text-[10px] font-bold uppercase mt-4">Upload About Image</span>
                          <input type="file" className="hidden" onChange={handleImageUpload} />
                        </label>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex gap-4"><button type="submit" className="pill-button pill-button-primary">Save Changes</button><button type="button" onClick={() => setIsModalOpen(false)} className="pill-button pill-button-outline">Cancel</button></div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-10 right-10 flex items-center gap-4 px-8 py-5 rounded-2xl border backdrop-blur-xl ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-[10px] uppercase font-bold tracking-widest">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
