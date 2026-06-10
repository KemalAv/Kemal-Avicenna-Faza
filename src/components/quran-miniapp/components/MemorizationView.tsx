import React from 'react';
import { ArrowLeft, AlertCircle, RotateCcw, ArrowRight, ArrowLeftCircle, FastForward } from 'lucide-react';
import { Surah, Ayah, Mistake, MemorizationStats } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'motion/react';

interface MemorizationViewProps {
  surah: Surah;
  ayahs: Ayah[];
  startIndex: number;
  onBack: () => void;
  onFinish: (stats: MemorizationStats) => void;
}

export const MemorizationView: React.FC<MemorizationViewProps> = ({ 
  surah, ayahs, startIndex, onBack, onFinish 
}) => {
  const [currentAyahIdx, setCurrentAyahIdx] = React.useState(startIndex);
  const [visibleWordsCount, setVisibleWordsCount] = React.useState(0);
  const [mistakes, setMistakes] = React.useState<Mistake[]>([]);
  const [startTime] = React.useState(Date.now());
  
  const { t } = useLocalization();
  const { settings } = useTheme();

  const currentAyah = ayahs[currentAyahIdx];
  const words = currentAyah.text.split(' ');

  const handleNextWord = () => {
    if (visibleWordsCount < words.length) {
      setVisibleWordsCount(prev => prev + 1);
    } else if (currentAyahIdx < ayahs.length - 1) {
      setCurrentAyahIdx(prev => prev + 1);
      setVisibleWordsCount(0);
    } else {
      handleFinish();
    }
  };

  const handlePrevWord = () => {
    if (visibleWordsCount > 0) {
      setVisibleWordsCount(prev => prev - 1);
    } else if (currentAyahIdx > startIndex) {
      const prevIdx = currentAyahIdx - 1;
      const prevAyahWords = ayahs[prevIdx].text.split(' ');
      setCurrentAyahIdx(prevIdx);
      setVisibleWordsCount(prevAyahWords.length);
    }
  };

  const handleResetToStart = () => {
    setCurrentAyahIdx(startIndex);
    setVisibleWordsCount(0);
  };

  const addMistake = (type: 'forgot' | 'tajwid') => {
    if (visibleWordsCount === 0) return;
    
    // Remove existing mistake for same word if any, before adding new one
    const filteredMistakes = mistakes.filter(m => !(m.ayahIndex === currentAyahIdx && m.wordIndex === visibleWordsCount - 1));
    setMistakes([...filteredMistakes, {
      ayahIndex: currentAyahIdx,
      wordIndex: visibleWordsCount - 1,
      type
    }]);
  };

  const handleFinish = () => {
    let wordsReviewedCount = 0;
    // Count words in fully completed ayahs
    for (let i = 0; i < currentAyahIdx; i++) {
        wordsReviewedCount += ayahs[i].text.split(' ').length;
    }
    // Add words visible in current ayah
    wordsReviewedCount += visibleWordsCount;

    const accuracy = wordsReviewedCount === 0 ? 0 : Math.max(0, 100 - (mistakes.length / wordsReviewedCount * 100));
    
    onFinish({
      accuracy,
      totalWords: wordsReviewedCount,
      mistakes,
      startTime,
      endTime: Date.now()
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        </button>
        <div className="text-center">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">{surah.englishName}</h2>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider">{t('memoMode')} • Ayah {currentAyah.numberInSurah}</p>
        </div>
        <button 
          onClick={handleFinish}
          className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
        >
          {t('finish')}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 w-full max-w-2xl overflow-y-auto max-h-[50vh] custom-scrollbar px-4">
          <div 
            className="flex flex-wrap justify-center gap-x-3 gap-y-6 leading-loose font-serif select-none"
            style={{ fontSize: `${settings.fontSize * 1.5}px`, direction: 'rtl' }}
          >
            {words.map((word, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: i < visibleWordsCount ? 1 : 0.05,
                  scale: i < visibleWordsCount ? 1 : 0.9,
                  filter: i < visibleWordsCount ? 'blur(0px)' : 'blur(4px)'
                }}
                className={`transition-all duration-300 ${(() => {
                  const m = mistakes.find(m => m.ayahIndex === currentAyahIdx && m.wordIndex === i);
                  if (m?.type === 'forgot') return 'text-rose-500';
                  if (m?.type === 'tajwid') return 'text-amber-500';
                  return 'text-slate-900 dark:text-slate-100';
                })()}`}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button 
              onClick={() => addMistake('forgot')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 hover:bg-rose-100 transition-all border border-rose-100 dark:border-rose-900/50"
            >
              <RotateCcw className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{t('forgot')}</span>
            </button>
            <button 
              onClick={() => addMistake('tajwid')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 hover:bg-amber-100 transition-all border border-amber-100 dark:border-amber-900/50"
            >
              <AlertCircle className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{t('tajwid')}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
             <button 
              onClick={handleResetToStart}
              className="flex items-center justify-center p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              title={t('resetToStart')}
            >
              <FastForward className="w-5 h-5 rotate-180" />
            </button>
            <button 
              onClick={handlePrevWord}
              className="flex items-center justify-center p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              title={t('prevWord')}
            >
              <ArrowLeftCircle className="w-5 h-5" />
            </button>
          </div>

          <button 
            onClick={handleNextWord}
            className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold flex items-center justify-center space-x-3 shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all"
          >
            <span>{t('nextWord')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
