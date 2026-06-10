/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { socials } from '../data';
import { Youtube, Music, Music2, Instagram, Github } from 'lucide-react';

const IconMap: Record<string, any> = {
  Youtube,
  Music,
  Music2,
  Instagram,
  Github
};

export default function Socials() {
  return (
    <section className="py-24 px-4 bg-white/[0.2]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-6">
          <h2 className="font-display text-4xl font-black text-slate-900 uppercase tracking-[0.3em]">Media Sosial</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-sans font-normal text-lg">Ikuti saya di berbagai platform media sosial.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {socials.map((social, index) => {
            const Icon = IconMap[social.icon] || Youtube;
            return (
              <motion.a
                key={social.platform}
                href={social.link}
                target="_blank"
                rel="no-referrer"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-8 p-10 glass-white tech-border rounded-sm hover:-translate-y-1 transition-all group shadow-sm border-blue-100/50"
              >
                <div className="p-5 glass-blue text-blue-600 rounded-sm tech-border border-blue-100 group-hover:shadow-glow-blue transition-all">
                  <Icon size={28} />
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="font-bold text-slate-900 uppercase tracking-widest text-lg font-display group-hover:text-blue-600 transition-colors">{social.platform}</h4>
                  <p className="text-sm text-blue-600/60 font-tech font-bold uppercase tracking-widest">{social.handle}</p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
