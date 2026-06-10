import React from 'react';
import { ArrowLeft, Play, Pause, BrainCircuit } from 'lucide-react';
import { Surah, Ayah } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'motion/react';

interface ReadingViewProps {
  surah: Surah;
  ayahs: Ayah[];
  onBack: () => void;
  onStartMemorizing: (startIdx: number) => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ surah, ayahs, onBack, onStartMemorizing }) => {
  const [playingIdx, setPlayingIdx] = React.useState<number | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const { t } = useLocalization();
  const { settings } = useTheme();

  const handlePlay = (idx: number, audioUrl: string) => {
    if (playingIdx === idx) {
      audioRef.current?.pause();
      setPlayingIdx(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setPlayingIdx(idx);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{surah.englishName}</h2>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">{surah.name}</p>
        </div>
        <div className="w-10"></div>
      </div>

      <audio 
        ref={audioRef} 
        onEnded={() => setPlayingIdx(null)}
        onError={() => setPlayingIdx(null)}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
        {ayahs.map((ayah, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={ayah.number}
            className="group relative pb-8 border-b border-slate-50 dark:border-slate-900 last:border-0"
          >
            <div className="flex items-start justify-between mb-4 mt-2">
              <div className="flex flex-col space-y-2">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400">
                  {ayah.numberInSurah}
                </span>
                <button 
                  onClick={() => handlePlay(idx, ayah.audio)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                >
                  {playingIdx === idx ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current pl-0.5" />}
                </button>
                <button 
                  onClick={() => onStartMemorizing(idx)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100"
                >
                  <BrainCircuit className="w-4 h-4" />
                </button>
              </div>
              
              <p 
                className="flex-1 text-right leading-relaxed font-serif text-slate-900 dark:text-slate-100"
                style={{ fontSize: `${settings.fontSize}px`, direction: 'rtl' }}
              >
                {ayah.text}
              </p>
            </div>

            {settings.showTransliteration && ayah.transliteration && (
              <p className="text-sm text-emerald-600/70 dark:text-emerald-400/50 italic mb-2">
                {ayah.transliteration}
              </p>
            )}

            {settings.showTranslation && ayah.translation && (
              <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                {ayah.translation}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
