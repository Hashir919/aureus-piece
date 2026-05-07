import { useEffect, memo } from 'react';
import { motion, useScroll, useSpring, useMotionValue } from 'motion/react';
import Hero from '../components/Hero';
import Portfolio from '../components/Portfolio';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';

// Memoize sections to prevent unnecessary re-renders when scroll or other state changes
const MemoHero = memo(Hero);
const MemoPortfolio = memo(Portfolio);
const MemoAbout = memo(About);
const MemoTestimonials = memo(Testimonials);
const MemoContact = memo(Contact);

export default function Home() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 12);
      mouseY.set(e.clientY - 12);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative min-h-screen bg-[#050505]">
      {/* Custom Cursor - Using useMotionValue to avoid React re-renders on mousemove */}
      <motion.div
        className="custom-cursor hidden md:block"
        style={{
          x: mouseX,
          y: mouseY,
        }}
      />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 md:h-1 bg-white z-[60] origin-left"
        style={{ scaleX }}
      />
      
      <main>
        <MemoHero />
        <MemoPortfolio />
        <MemoAbout />
        <MemoTestimonials />
        <MemoContact />
      </main>
    </div>
  );
}
