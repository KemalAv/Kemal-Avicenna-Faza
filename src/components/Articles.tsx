/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { articles } from '../data';
import { ArrowRight, BookOpen } from 'lucide-react';
import { BlogPost } from '../types';

interface ArticlesProps {
  onArticleClick?: (article: BlogPost) => void;
}

export default function Articles({ onArticleClick }: ArticlesProps) {
  return (
    <section id="articles" className="py-24 px-4 bg-white/[0.2] border-y border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-blue-500/10 text-blue-600 rounded-sm tech-border border-blue-100 shadow-glow-blue">
              <BookOpen size={36} />
            </div>
            <div className="space-y-1">
              <h2 className="font-display text-4xl font-black text-slate-900 uppercase tracking-wider">Artikel</h2>
              <p className="text-[10px] font-tech text-blue-600 font-bold uppercase tracking-[0.4em]">Tulisan dan Catatan Terbaru</p>
            </div>
          </div>
          <button className="flex items-center gap-3 text-[10px] font-black text-slate-900 hover:text-blue-600 transition-all font-tech tracking-[0.3em] uppercase group">
            Lihat Semua <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article, index) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => onArticleClick?.(article)}
              className="group glass-white p-10 rounded-sm tech-border hover:bg-white transition-all shadow-sm border-blue-100/50 flex flex-col cursor-pointer"
            >
              {article.image && (
                <div className="mb-8 aspect-video overflow-hidden rounded-sm tech-border border-slate-100 relative group-hover:border-blue-200 transition-colors">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                  {article.title}
                </h3>
              </div>
              <p className="text-slate-500 font-sans font-normal text-sm leading-relaxed mb-10 line-clamp-3">
                {article.summary}
              </p>
              <button className="flex items-center gap-3 text-[10px] font-black text-slate-900 group-hover:text-blue-600 transition-all font-tech tracking-[0.3em] uppercase">
                Baca Selengkapnya <ArrowRight size={16} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
