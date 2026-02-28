import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export function Layout() {
  const location = useLocation();
  const outlet = useOutlet();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 16,
                    filter: 'blur(4px)',
                  }
            }
            animate={
              shouldReduceMotion
                ? {}
                : {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                  }
            }
            exit={
              shouldReduceMotion
                ? {}
                : {
                    opacity: 0,
                    y: -10,
                    filter: 'blur(2px)',
                  }
            }
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
