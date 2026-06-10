/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { profile } from '../data';
import { Calendar, Code2, Sparkles } from 'lucide-react';
import profilePic from '../assets/profile.jpg';

export default function Hero() {
  return (
    <section id="profile" className="pt-40 pb-20 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-8 mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              className="relative w-40 h-40 md:w-56 md:h-56 shrink-0"
            >
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-30 animate-pulse" />
              <div className="absolute inset-0 border-2 border-blue-400 rounded-full animate-[spin_10s_linear_infinite]" style={{ borderDasharray: '20 40' }} />
              <img 
                src={profilePic} 
                alt={profile.name}
                className="w-full h-full object-cover rounded-full border-2 border-white shadow-glow-white relative z-10 grayscale-[0.2] contrast-[1.1]"
              />
            </motion.div>
            
            <div className="space-y-6 flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-sm glass-blue text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] font-tech border border-blue-200">
                <Sparkles size={14} className="animate-pulse" />
                <span>Profil Ditemukan</span>
              </div>
              
              <h1 className="font-display text-6xl md:text-8xl font-bold text-slate-900 leading-[0.9] tracking-tighter">
                {profile.name}
              </h1>
              <p className="text-2xl text-blue-600/80 font-tech font-bold uppercase tracking-widest">
                Kreator Digital
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <p className="text-xl text-slate-600 leading-relaxed font-sans font-normal">
                {profile.description}
              </p>
              
              <div className="flex flex-wrap gap-3">
                {profile.roles.map((role) => (
                  <span key={role} className="px-5 py-2 glass-white text-slate-700 rounded-sm text-xs font-bold uppercase tracking-widest font-tech tech-border shadow-sm border-blue-100/50">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-8 glass-white rounded-sm tech-border space-y-6 shadow-sm border-blue-100/50"
            >
              <h3 className="font-display font-bold text-sm uppercase tracking-[0.4em] text-blue-600">Data Pribadi</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="p-3 glass-blue text-blue-600 rounded-sm border border-blue-100">
                    <Calendar size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 font-tech">Tanggal Lahir</p>
                    <p className="font-display text-lg text-slate-900 font-bold tracking-tight">{profile.birthDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="p-3 glass-blue text-blue-600 rounded-sm border border-blue-100">
                    <Code2 size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 font-tech">Fokus Sekarang</p>
                    <p className="font-display text-lg text-slate-900 font-bold tracking-tight">{profile.currentFocus}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
