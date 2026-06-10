import React from 'react';
import { ArrowLeft, Trophy, AlertTriangle, Hash, Clock } from 'lucide-react';
import { Surah, Ayah, MemorizationStats } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'motion/react';

interface AnalysisViewProps {
  surah: Surah;
  ayahs: Ayah[];
  stats: MemorizationStats;
  onBack: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ surah, ayahs, stats, onBack }) => {
  const { t } = useLocalization();
  const { settings } = useTheme();

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto custom-scrollbar">
      <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        </button>
        <span className="font-bold text-slate-800 dark:text-slate-100">{t('analysis')}</span>
        <div className="w-10"></div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="col-span-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white text-center shadow-xl shadow-emerald-500/20"
          >
            <Trophy className="w-10 h-10 mx-auto mb-4 opacity-50" />
            <h2 className="text-5xl font-black mb-2">{stats.accuracy.toFixed(1)}%</h2>
            <p className="text-emerald-100 font-medium uppercase tracking-widest text-xs">{t('accuracy')}</p>
          </motion.div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Hash className="w-6 h-6 text-blue-500 mb-2" />
            <h3 className="text-xl font-bold dark:text-slate-100">{stats.totalWords}</h3>
            <p className="text-slate-500 text-xs">{t('totalWords')}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <AlertTriangle className="w-6 h-6 text-rose-500 mb-2" />
            <h3 className="text-xl font-bold dark:text-slate-100">{stats.mistakes.length}</h3>
            <p className="text-slate-500 text-xs">{t('mistakes')}</p>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 px-2">{t('summary')}</h3>
          <div className="space-y-6">
            {ayahs.map((ayah, aIdx) => {
              const ayahMistakes = stats.mistakes.filter(m => m.ayahIndex === aIdx);
              if (ayahMistakes.length === 0) return null;

              return (
                <div key={aIdx} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                      Ayah {ayah.numberInSurah}
                    </span>
                    <span className="text-lg font-serif text-emerald-600">{surah.name}</span>
                  </div>

                  <p 
                    className="flex flex-wrap gap-2 font-serif text-right mb-4"
                    style={{ fontSize: `${settings.fontSize}px`, direction: 'rtl' }}
                  >
                    {ayah.text.split(' ').map((word, wIdx) => {
                      const mistake = ayahMistakes.find(m => m.wordIndex === wIdx);
                      return (
                        <span 
                          key={wIdx} 
                          className={mistake?.type === 'forgot' ? 'text-rose-500 underline decoration-2' : mistake?.type === 'tajwid' ? 'text-amber-500 underline decoration-2' : 'text-slate-800 dark:text-slate-200'}
                        >
                          {word}
                        </span>
                      );
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
