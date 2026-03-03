'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Cpu, Sparkles, LayoutDashboard } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

const navLinks = [
  { href: '/', label: 'Generator', icon: Sparkles },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false); // controls DOM mount
  const [isAnimating, setIsAnimating] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const shapesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Run open animation once overlay is mounted
  useEffect(() => {
    if (!mounted || !overlayRef.current) return;

    document.body.style.overflow = 'hidden';
    const tl = gsap.timeline();

    tl.to(backdropRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: 'power3.inOut',
    });

    tl.fromTo(
      shapesRef.current.filter(Boolean),
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)' },
      '-=0.3'
    );

    tl.fromTo(
      linksRef.current.filter(Boolean),
      { opacity: 0, y: 60, rotateX: -15 },
      { opacity: 1, y: 0, rotateX: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
      '-=0.5'
    );
  }, [mounted]);

  const openMenu = useCallback(() => {
    setMounted(true);
  }, []);

  const closeMenu = useCallback(() => {
    if (!mounted || isAnimating) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setMounted(false);
        setIsAnimating(false);
        document.body.style.overflow = '';
      },
    });

    tl.to(linksRef.current.filter(Boolean), {
      opacity: 0,
      y: -30,
      duration: 0.3,
      stagger: 0.04,
      ease: 'power2.in',
    });

    tl.to(shapesRef.current.filter(Boolean), {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.in',
    }, '-=0.2');

    tl.to(backdropRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power3.inOut',
    }, '-=0.2');
  }, [mounted, isAnimating]);

  const toggleMenu = useCallback(() => {
    if (mounted) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [mounted, openMenu, closeMenu]);

  // Close on route change
  useEffect(() => {
    if (mounted) closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Keyboard escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mounted) closeMenu();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [mounted, closeMenu]);

  return (
    <>
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-[120] glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.4 }}
                className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30"
              >
                <Cpu className="w-5 h-5 text-accent-400" />
              </motion.div>
              <span className="text-lg font-bold text-gradient hidden sm:block">
                SysDesign AI
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-white bg-accent/15'
                          : 'text-dark-400 hover:text-white hover:bg-dark-700/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-accent rounded-full"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Hamburger toggle */}
            <button
              onClick={toggleMenu}
              className={`hamburger-btn rounded-xl hover:bg-dark-700/50 transition-colors ${mounted ? 'is-open' : ''}`}
              aria-label="Toggle navigation menu"
            >
              <span className="bar" />
              <span className="bar" />
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen GSAP overlay — only mount when open */}
      {mounted && (
        <div
          ref={overlayRef}
          className="nav-overlay is-open"
        >
          <div ref={backdropRef} className="backdrop" />

        {/* Floating ambient shapes */}
        <div
          ref={(el) => { shapesRef.current[0] = el; }}
          className="floating-shape"
        />
        <div
          ref={(el) => { shapesRef.current[1] = el; }}
          className="floating-shape"
        />
        <div
          ref={(el) => { shapesRef.current[2] = el; }}
          className="floating-shape"
        />

        <div className="menu-inner">
          {navLinks.map((item, i) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                ref={(el) => { linksRef.current[i] = el; }}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => closeMenu()}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
      )}
    </>
  );
}
