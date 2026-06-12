/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { profile } from '../data';

export default function Header() {
  const navItems = [
    { name: 'Profil', href: '#profile' },
    { name: 'Kumpulan Karya', href: '#works' },
    { name: 'Kumpulan Aplikasi', href: '#apps' },
    { name: 'Media Sosial', href: '#socials' },
    { name: 'Artikel', href: '#articles' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-xl border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="font-display font-bold text-2xl tracking-tighter text-slate-900 flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-sm bg-blue-500 shadow-glow-blue" />
          <span className="uppercase tracking-widest">{profile.name}</span>
        </motion.div>
        
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <a 
              key={item.name}
              href={item.href}
              className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-all uppercase tracking-widest font-tech"
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-glow-blue" />
        </div>
      </div>
    </motion.header>
  );
}
