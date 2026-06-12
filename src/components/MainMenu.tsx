import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Icons } from '../constants';
import { PracticeMode } from '../types';

interface MainMenuProps {
  onSelectMode: (mode: PracticeMode) => void;
  t: any;
  onBack: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onSelectMode, t, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white">
          {t.title}
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">
          {t.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card className="p-8 hover:border-blue-500 transition-all group cursor-pointer" id="flashcard-mode">
          <div onClick={() => onSelectMode('FLASHCARD')}>
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Icons.Flashcard size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3 dark:text-white">{t.flashcard}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{t.flashcardDesc}</p>
            <Button className="w-full" variant="primary">{t.chooseMode}</Button>
          </div>
        </Card>

        <Card className="p-8 hover:border-purple-500 transition-all group cursor-pointer" id="mcq-mode">
          <div onClick={() => onSelectMode('MCQ')}>
            <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <Icons.MCQ size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3 dark:text-white">{t.mcq}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{t.mcqDesc}</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700" variant="primary">{t.chooseMode}</Button>
          </div>
        </Card>
      </div>

      <div className="text-center">
        <Button variant="outline" onClick={onBack} icon={<Icons.Prev size={18} />}>
          {t.back} ke Kumpulan Karya
        </Button>
      </div>
    </div>
  );
};
