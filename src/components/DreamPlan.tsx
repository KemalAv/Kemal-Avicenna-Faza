/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { masterPlanData } from '../data/masterPlanData';
import { 
  Target, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Cpu, 
  Gamepad2, 
  User, 
  Zap,
  Smartphone,
  Bike,
  Laptop,
  Lock,
  Unlock,
  Key,
  GraduationCap,
  Briefcase,
  Home,
  ShieldCheck,
  TrendingUp,
  Layout,
  Music,
  BookOpen,
  Info
} from 'lucide-react';

export default function DreamPlan() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'KemalAv 5125') {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const { 
    profile, 
    interests, 
    education, 
    career, 
    familyBusiness, 
    recommendations, 
    integration, 
    offGrid, 
    lifePhases, 
    skillTargets, 
    deviceSpecs,
    physical 
  } = masterPlanData;

  return (
    <section id="dreams" className="py-24 px-4 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <motion.div
              key="auth-gate"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-md mx-auto"
            >
              <div className="glass-white p-12 rounded-sm tech-border shadow-2xl text-center relative overflow-hidden border-blue-100">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse" />
                <div className="w-24 h-24 bg-blue-500/10 text-blue-600 rounded-sm tech-border flex items-center justify-center mx-auto mb-10 shadow-glow-blue border-blue-100">
                  <Lock size={48} strokeWidth={1} />
                </div>
                <h2 className="text-3xl font-display font-black text-slate-900 mb-4 uppercase tracking-[0.2em]">Halaman Terkunci</h2>
                <p className="text-slate-500 mb-12 leading-relaxed font-tech font-bold uppercase text-xs tracking-widest">Silakan masukkan kode akses untuk melihat isi rencana masa depan.</p>
                
                <form onSubmit={handleLogin} className="space-y-8">
                   <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <Key size={20} />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="KODE AKSES..."
                      className={`w-full h-16 pl-14 pr-4 glass-white tech-border ${error ? 'border-red-500' : 'focus:border-blue-500 shadow-glow-blue'} outline-none transition-all font-tech font-black tracking-[0.5em] text-slate-900 text-center uppercase placeholder:text-slate-300 placeholder:tracking-normal placeholder:font-bold placeholder:text-[10px]`}
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full h-16 bg-blue-600 text-white font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all font-tech rounded-sm"
                  >
                    <Unlock size={20} /> Buka Halaman
                  </motion.button>
                  
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-[10px] font-black font-tech tracking-widest uppercase mt-4"
                    >
                      Kode Akses Salah
                    </motion.p>
                  )}
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-24"
            >
              <div className="flex flex-col items-center text-center">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-3 bg-indigo-600 text-white rounded-2xl mb-6 shadow-lg shadow-indigo-200"
                >
                  <Target size={32} />
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                  className="font-display text-5xl font-bold text-slate-900 mb-4"
                >
                  RENCANA MASA DEPAN
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-slate-500 max-w-2xl text-lg font-medium"
                >
                  Strategi Hibrida Tekno-Finansial & Kemandirian Energi.
                </motion.p>
              </div>

              {/* Profile & Interests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="text-indigo-600" />
                    <h3 className="text-xl font-bold text-slate-900">Profil & Latar Belakang</h3>
                  </div>
                  <div className="space-y-4 text-slate-600">
                    <p><strong>Nama:</strong> {profile.name}</p>
                    <p><strong>Domisili:</strong> {profile.domisili}</p>
                    <p><strong>Kelebihan:</strong> {profile.kelebihan}</p>
                    <div className="pt-2">
                      <p className="font-bold text-slate-800 mb-2">Proyek Berjalan:</p>
                      <ul className="space-y-2">
                        {profile.proyek.map((p, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm bg-slate-50 px-3 py-2 rounded-xl">
                            <Layout size={14} className="text-indigo-400" /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="text-indigo-600" />
                    <h3 className="text-xl font-bold text-slate-900">Minat & Gaya Hidup</h3>
                  </div>
                  <ul className="space-y-4">
                    {interests.map((interest, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl">
                        <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 size={14} />
                        </div>
                        <span className="text-sm text-slate-600 leading-relaxed font-medium">{interest}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Higher Education Targets */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <GraduationCap className="text-indigo-600" />
                  <h3 className="text-2xl font-bold text-slate-900">Target Pendidikan Tinggi</h3>
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-indigo-600 mb-4 tracking-widest uppercase">Pilihan Strata 1 (S1)</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {education.s1.map((edu, i) => (
                      <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <h5 className="font-bold text-slate-900 mb-1">{edu.title}</h5>
                        <p className="text-indigo-600 text-sm font-bold mb-4">{edu.campus}</p>
                        <div className="space-y-3">
                          <div className="text-xs bg-emerald-50 text-emerald-700 p-3 rounded-xl">
                            <strong>Strategi:</strong> {edu.strategy}
                          </div>
                          <div className="text-xs bg-indigo-50 text-indigo-700 p-3 rounded-xl">
                            <strong>Manfaat:</strong> {edu.perks}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-indigo-600 mb-4 tracking-widest uppercase">Pilihan Strata 2 (S2)</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {education.s2.map((edu, i) => (
                      <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <h5 className="font-bold text-slate-900 mb-1">{edu.title}</h5>
                        <p className="text-indigo-600 text-sm font-bold mb-4">{edu.campus}</p>
                        <div className="space-y-3">
                          <div className="text-xs bg-amber-50 text-amber-700 p-3 rounded-xl">
                            <strong>Detail:</strong> {edu.strategy}
                          </div>
                          <div className="text-xs bg-slate-50 text-slate-700 p-3 rounded-xl">
                            <strong>Fokus:</strong> {edu.perks}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Career Ambition & Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8 md:p-10 bg-indigo-900 text-white rounded-3xl relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                      <Briefcase className="text-indigo-300" />
                      <h3 className="text-2xl font-bold">Ambisi & Target Karir</h3>
                    </div>
                    <div className="space-y-6 text-indigo-100">
                      <div>
                        <p className="text-xs uppercase tracking-widest font-bold text-indigo-400 mb-1">Target Gaji</p>
                        <p className="text-lg font-bold">{career.targetGaji}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest font-bold text-indigo-400 mb-1">Lokasi & Karakter</p>
                        <p className="text-sm leading-relaxed">{career.lokasi} • {career.karakter}</p>
                      </div>
                      <div className="pt-4 border-t border-indigo-800">
                        <p className="text-xs uppercase tracking-widest font-bold text-indigo-400 mb-1">Tujuan Akhir</p>
                        <p className="text-xl font-bold text-indigo-300">{career.tujuanAkhir}</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl" />
                </div>

                <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="text-indigo-600" />
                    <h3 className="text-xl font-bold text-slate-900">Analisis Aset Keluarga</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Retail</p>
                      <p className="text-xs font-bold text-slate-700 leading-relaxed">{familyBusiness.retail}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Properti</p>
                      <p className="text-xs font-bold text-slate-700 leading-relaxed">{familyBusiness.properti}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Finansial</p>
                      <p className="text-xs font-bold text-slate-700 leading-relaxed">{familyBusiness.finansial}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations & Integration Phases */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-indigo-600" />
                  <h3 className="text-2xl font-bold text-slate-900">Integrasi Bisnis & Karir (Aman AI)</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex flex-col items-center text-center">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                        <Cpu size={20} />
                      </div>
                      <h5 className="font-bold text-slate-900 mb-2">{rec.title}</h5>
                      <p className="text-xs text-slate-600 italic mb-4 leading-relaxed">{rec.reason}</p>
                      <span className="text-xs font-bold text-indigo-700 bg-white px-3 py-1 rounded-full shadow-sm">
                        Est. Gaji: {rec.salary}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {integration.map((phase, i) => (
                    <div key={i} className="relative pl-8 border-l-2 border-indigo-100">
                      <div className="absolute -left-[5px] top-0 w-2 h-2 bg-indigo-600 rounded-full" />
                      <p className="text-[10px] font-bold text-indigo-600 uppercase mb-1 tracking-widest">{phase.phase}</p>
                      <h5 className="font-bold text-slate-900 mb-2">{phase.title}</h5>
                      <p className="text-xs text-slate-500 leading-relaxed">{phase.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Life Phases Timeline */}
              <div className="relative pt-12">
                <div className="flex flex-col items-center text-center mb-16">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl mb-4">
                    <Calendar size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Timeline Alur Kehidupan (Plan A)</h3>
                </div>
                
                <div className="absolute left-1/2 -translate-x-1/2 top-32 bottom-0 w-0.5 bg-indigo-100 hidden lg:block" />
                
                <div className="space-y-12">
                  {lifePhases.map((phase, index) => (
                    <motion.div
                      key={phase.title}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8`}
                    >
                      <div className="flex-1 w-full">
                        <div className={`p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                          <div className={`flex items-center gap-3 mb-4 ${index % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'}`}>
                            <span className="text-indigo-600 font-bold tracking-wider text-sm bg-indigo-50 px-3 py-1 rounded-full uppercase">
                              {phase.age}
                            </span>
                            {phase.status === 'in-progress' && (
                              <span className="flex items-center gap-1 text-amber-600 text-xs font-bold bg-amber-50 px-2 py-1 rounded-full">
                                <Clock size={12} /> SEDANG BERJALAN
                              </span>
                            )}
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-3">{phase.title}</h3>
                          <p className="text-slate-600 mb-6 font-medium">{phase.description}</p>
                          <ul className={`space-y-3 text-slate-500 text-sm ${index % 2 === 0 ? 'lg:items-end' : 'lg:items-start'} flex flex-col`}>
                            {phase.items.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                {index % 2 !== 0 && <CheckCircle2 size={16} className="text-indigo-400 mt-0.5 shrink-0" />}
                                <span className="max-w-md">{item}</span>
                                {index % 2 === 0 && <CheckCircle2 size={16} className="text-indigo-400 mt-0.5 shrink-0" />}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="z-10 w-12 h-12 bg-indigo-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white hidden lg:flex shrink-0">
                        <Calendar size={20} />
                      </div>
                      <div className="flex-1 w-full hidden lg:block" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Misi Akhir: Off-Grid Projects */}
              <div className="p-8 md:p-12 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Home className="text-indigo-400" />
                      <h3 className="text-3xl font-bold">Projek Akhir: Rumah Off-Grid</h3>
                    </div>
                    <div className="space-y-6 mb-10">
                      <p className="text-slate-400 text-lg leading-relaxed">
                        Implementasi total sistem kemandirian energi dan pangan berbasis IoT & AI di Gunungpati.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <div className="px-4 py-2 bg-slate-800 rounded-2xl border border-slate-700 text-sm font-bold">
                          Anggaran: {offGrid.budget}
                        </div>
                        <div className="px-4 py-2 bg-slate-800 rounded-2xl border border-slate-700 text-sm font-bold">
                          Status: {offGrid.timeline}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {deviceSpecs.map((v, i) => (
                        <div key={i} className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 flex items-center gap-4">
                          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                            {v.name === 'Ponsel' && <Smartphone size={18} />}
                            {v.name === 'Motor' && <Bike size={18} />}
                            {v.name === 'Laptop' && <Laptop size={18} />}
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{v.name}</h4>
                            <p className="text-sm font-bold text-slate-200">{v.model}</p>
                          </div>
                          {v.status === 'completed' && <CheckCircle2 size={16} className="text-emerald-400 ml-auto" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {offGrid.pillars.map((pillar, i) => (
                      <div key={i} className="p-6 bg-slate-800/50 rounded-3xl border border-slate-700">
                        <h5 className="font-bold text-indigo-300 mb-4 flex items-center gap-2">
                          <Info size={16} /> {pillar.title}
                        </h5>
                        <ul className="space-y-2">
                          {pillar.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-600 opacity-10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500 opacity-5 rounded-full blur-3xl" />
              </div>

              {/* Physical & Skill Targets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="text-indigo-600" />
                    <h3 className="text-xl font-bold text-slate-900">Target Fisik</h3>
                  </div>
                  {physical.map((p, i) => (
                    <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                      <h5 className="font-bold text-indigo-600 text-sm uppercase mb-4 tracking-widest">Target {p.category}</h5>
                      <p className="text-lg font-bold text-slate-900 mb-4">{p.target}</p>
                      <ul className="space-y-2">
                        {p.items.map((item, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-slate-500">
                            <CheckCircle2 size={14} className="text-indigo-400" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-2 space-y-8">
                  {skillTargets.map((group) => (
                    <div key={group.category}>
                      <div className="flex items-center gap-3 mb-6">
                        {group.category === 'Gaming' ? <Gamepad2 className="text-indigo-600" /> : <BookOpen className="text-indigo-600" />}
                        <h3 className="text-xl font-bold text-slate-900">Target {group.category}</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {group.skills.map((skill, idx) => (
                          <div key={skill.name} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-slate-900">{skill.name}</span>
                              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                                {skill.name === 'Musik' ? <Music size={14} /> : <Target size={14} />}
                              </div>
                            </div>
                            <p className="text-xs font-bold text-indigo-600 mb-2">{skill.target}</p>
                            <p className="text-[10px] text-slate-400 leading-relaxed italic border-l-2 border-indigo-50 pl-3">
                              {skill.plan}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
