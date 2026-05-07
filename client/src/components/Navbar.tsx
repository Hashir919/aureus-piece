import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Throttled scroll handler
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 20;
          if (isScrolled !== scrolled) {
            setIsScrolled(scrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'About', href: isHome ? '#about' : '/#about' },
    { name: 'Contact', href: isHome ? '#contact' : '/#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/60 backdrop-blur-md py-3 md:py-4 border-b border-white/5' : 'bg-transparent py-4 md:py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex justify-between items-center">
        <Link
          to="/"
          className="text-lg md:text-xl font-black tracking-tighter flex items-center gap-2"
        >
          AUREUS<span className="text-white/40">PIECE</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            link.href.startsWith('#') || (link.href.startsWith('/#')) ? (
                 <a
                    key={link.name}
                    href={link.href}
                    className="text-[10px] font-bold tracking-[0.2em] uppercase hover:text-white/60 transition-colors"
                  >
                    {link.name}
                </a>
            ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-[10px] font-bold tracking-[0.2em] uppercase hover:text-white/60 transition-colors"
                >
                  {link.name}
                </Link>
            )
          ))}
          <a
            href="#contact"
            className="pill-button pill-button-primary"
          >
            Get in Touch
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white focus:outline-none p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-[52px] left-0 w-full h-[calc(100vh-52px)] bg-black/95 py-8 px-6 flex flex-col space-y-6 md:hidden z-50"
          >
            {navLinks.map((link) => (
               link.href.startsWith('#') || (link.href.startsWith('/#')) ? (
                   <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-sm font-bold tracking-[0.2em] uppercase hover:text-white/60 transition-colors py-2"
                    >
                      {link.name}
                  </a>
              ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-bold tracking-[0.2em] uppercase hover:text-white/60 transition-colors py-2"
                  >
                    {link.name}
                  </Link>
              )
            ))}
            <a
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="pill-button pill-button-primary w-full mt-4"
            >
              Get in Touch
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
