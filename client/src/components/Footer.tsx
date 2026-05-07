export default function Footer() {
  return (
    <footer className="py-8 md:py-16 bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/20 text-center md:text-left">
          © 2026 AUREUS STUDIO. ARCHITECTING THE BEYOND.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-0 md:space-x-10">
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/20 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
