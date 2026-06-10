import React from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Surah } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import { useTheme } from '../hooks/useTheme';
import { motion, AnimatePresence } from 'motion/react';

import { surahTranslations } from '../data/surahTranslations';

interface SurahListProps {
  surahs: Surah[];
  onSelect: (surah: Surah, startAyah: number) => void;
}

export const SurahList: React.FC<SurahListProps> = ({ surahs, onSelect }) => {
  const [search, setSearch] = React.useState('');
  const [selectedSurah, setSelectedSurah] = React.useState<Surah | null>(null);
  const [startAyah, setStartAyah] = React.useState(1);
  
  const { t, currentLanguage } = useLocalization();
  const { settings, updateSettings } = useTheme();

  const getTranslatedName = (surah: Surah) => {
    const trans = surahTranslations[surah.number.toString()];
    if (!trans) return surah.englishNameTranslation;
    return currentLanguage === 'id' ? trans[0] : trans[1];
  };

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(search.toLowerCase()) || 
    s.number.toString() === search ||
    getTranslatedName(s).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative flex flex-col h-full bg-[#f8fafc]/50 p-6 space-y-6">
      <div className="flex items-center justify-between relative z-10">
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter font-display">{t('title')}</h1>
      </div>

      <div className="flex flex-col space-y-4 glass-white p-6 rounded-sm tech-border shadow-sm border-blue-100">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black font-tech uppercase tracking-widest text-slate-400">{t('language')}</span>
          <div className="flex bg-slate-100 rounded-sm p-1 border border-slate-200">
            <button 
              onClick={() => updateSettings({ language: 'id' })}
              className={`px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${settings.language === 'id' ? 'bg-blue-600 text-white shadow-glow-blue' : 'text-slate-500'}`}
            >
              ID
            </button>
            <button 
              onClick={() => updateSettings({ language: 'en' })}
              className={`px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${settings.language === 'en' ? 'bg-blue-600 text-white shadow-glow-blue' : 'text-slate-500'}`}
            >
              EN
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black font-tech uppercase tracking-widest text-slate-400">{t('fontSize')}</span>
          <div className="flex bg-slate-100 rounded-sm p-1 border border-slate-200">
            {[18, 24, 32, 40].map((size) => (
              <button 
                key={size}
                onClick={() => updateSettings({ fontSize: size })}
                className={`px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${settings.fontSize === size ? 'bg-blue-600 text-white shadow-glow-blue' : 'text-slate-500'}`}
              >
                {size === 18 ? 'S' : size === 24 ? 'M' : size === 32 ? 'L' : 'XL'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text"
          placeholder={t('searchSurah')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-sm tech-border glass-white text-slate-900 border-blue-100 focus:border-blue-600 outline-none transition-all font-tech text-xs tracking-wider uppercase placeholder:text-slate-400 placeholder:font-bold"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {filteredSurahs.map((surah) => (
          <motion.div
            layout
            key={surah.number}
            onClick={() => {
              setSelectedSurah(surah);
              setStartAyah(1);
            }}
            className={`p-6 rounded-sm cursor-pointer transition-all border tech-border ${
              selectedSurah?.number === surah.number 
              ? 'border-blue-500 bg-blue-50/50 shadow-glow-blue' 
              : 'border-blue-100 bg-white/70 hover:border-blue-400 hover:bg-white shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <span className="w-10 h-10 flex items-center justify-center rounded-sm bg-blue-500 text-xs font-black text-white font-tech shadow-glow-blue">
                  {surah.number}
                </span>
                <div>
                  <h3 className="font-display font-bold text-slate-900 tracking-tight text-lg">{surah.englishName}</h3>
                  <p className="text-[10px] font-tech font-bold uppercase tracking-widest text-slate-400">{getTranslatedName(surah)} • {surah.numberOfAyahs} Ayahs</p>
                </div>
              </div>
              <span className="text-2xl font-serif text-blue-600">{surah.name}</span>
            </div>

            <AnimatePresence>
              {selectedSurah?.number === surah.number && (
                <motion.div 
                   initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-6 pt-6 border-t border-slate-200 flex items-center space-x-6"
                >
                  <div className="flex-1">
                    <label className="text-[10px] font-black font-tech uppercase tracking-widest text-slate-400 mb-2 block">{t('startAyah')}</label>
                    <input 
                      type="number"
                      min={1}
                      max={surah.numberOfAyahs}
                      value={startAyah}
                      onChange={(e) => setStartAyah(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-sm bg-slate-100 border-none outline-none text-slate-900 font-tech font-bold"
                    />
                  </div>
                  <button 
                    onClick={() => onSelect(surah, startAyah)}
                    className="mt-6 p-4 rounded-sm bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-glow-blue active:scale-95"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
