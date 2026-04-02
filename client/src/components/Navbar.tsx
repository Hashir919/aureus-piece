import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'About', href: isHome ? '#about' : '/#about' },
    { name: 'Contact', href: isHome ? '#contact' : '/#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-black/60 backdrop-blur-xl py-4 border-b border-white/5' : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-black tracking-tighter flex items-center gap-2"
        >
          AUREUS<span className="text-white/40">PIECE</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link, index) => (
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
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 w-full bg-black border-b border-white/5 py-8 px-6 flex flex-col space-y-6 md:hidden"
        >
          {navLinks.map((link) => (
             link.href.startsWith('#') || (link.href.startsWith('/#')) ? (
                 <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-[10px] font-bold tracking-[0.2em] uppercase hover:text-white/60 transition-colors"
                  >
                    {link.name}
                </a>
            ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[10px] font-bold tracking-[0.2em] uppercase hover:text-white/60 transition-colors"
                >
                  {link.name}
                </Link>
            )
          ))}
          <a
            href="#contact"
            onClick={() => setIsMenuOpen(false)}
            className="pill-button pill-button-primary w-full"
          >
            Get in Touch
          </a>
        </motion.div>
      )}
    </nav>
  );
}

