/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Project } from '../types';
import { ExternalLink, Globe, Layout } from 'lucide-react';

interface ProjectsProps {
  id: string;
  title: string;
  items: Project[];
  onItemClick?: (item: Project) => void;
}

export default function Projects({ id, title, items, onItemClick }: ProjectsProps) {
  return (
    <section id={id} className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-16"
        >
          <div className="flex items-center gap-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
            <h2 className="font-display text-4xl font-black text-slate-900 tracking-[0.2em] uppercase">{title}</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {items.map((item, index) => (
              <motion.a
                key={item.title}
                href={item.link}
                target={item.link.startsWith('#') ? undefined : "_blank"}
                rel={item.link.startsWith('#') ? undefined : "no-referrer"}
                onClick={(e) => {
                  if (onItemClick) {
                    e.preventDefault();
                    onItemClick(item);
                  }
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-10 glass-white tech-border rounded-sm hover:bg-white transition-all relative overflow-hidden block shadow-sm hover:shadow-xl hover:border-blue-300"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-colors" />
                
                <div className="flex items-start justify-between mb-8">
                  <div className="p-5 glass-blue text-blue-600 rounded-sm tech-border border-blue-100 group-hover:shadow-glow-blue transition-all">
                    {item.type === 'work' ? <Globe size={28} /> : <Layout size={28} />}
                  </div>
                  <div className="text-slate-200 group-hover:text-blue-500 transition-colors">
                    <ExternalLink size={20} />
                  </div>
                </div>
                
                <h3 className="font-display text-3xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors tracking-tight">
                  {item.title}
                </h3>
                <p className="text-slate-500 font-sans font-normal leading-relaxed">
                  {item.description}
                </p>
                
                <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between font-tech text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-blue-600 transition-colors">
                  <span>Lihat Proyek</span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-px bg-slate-200 group-hover:bg-blue-400/50 transition-colors" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:animate-ping" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
