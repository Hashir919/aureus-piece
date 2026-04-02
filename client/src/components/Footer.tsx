export default function Footer() {
  return (
    <footer className="py-16 bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-8 md:mb-0">
          © 2026 AUREUS STUDIO. ARCHITECTING THE BEYOND.
        </p>
        
        <div className="flex space-x-10">
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
