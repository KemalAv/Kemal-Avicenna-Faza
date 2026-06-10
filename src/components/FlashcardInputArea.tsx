import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Icons } from '../constants';
import { Flashcard } from '../types';

interface FlashcardInputAreaProps {
  onParse: (cards: Flashcard[]) => void;
  t: any;
  onBack: () => void;
}

export const FlashcardInputArea: React.FC<FlashcardInputAreaProps> = ({ onParse, t, onBack }) => {
  const [text, setText] = useState('');

  const parseFlashcards = () => {
    const lines = text.split('\n').filter(l => l.trim() !== '');
    const cards: Flashcard[] = [];
    let currentQuestion = '';

    const questionRegex = /^(Soal|Question)\s+\d+\s*:/i;
    const answerRegex = /^(Jawaban|Answer)\s*:/i;

    lines.forEach((line) => {
      if (questionRegex.test(line)) {
        currentQuestion = line.replace(questionRegex, '').trim();
      } else if (answerRegex.test(line) && currentQuestion) {
        const answer = line.replace(answerRegex, '').trim();
        cards.push({
          id: cards.length + 1,
          question: currentQuestion,
          answer: answer
        });
        currentQuestion = '';
      }
    });

    if (cards.length > 0) {
      onParse(cards);
    } else {
       alert('Invalid format. Please check the guide.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-6 mb-10">
        <Button variant="ghost" onClick={onBack} icon={<Icons.Prev size={20} />} />
        <h2 className="text-3xl font-black font-display text-slate-900 uppercase tracking-tighter">{t.flashcard} // {t.inputTitle}</h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <textarea
            className="w-full h-80 p-8 rounded-sm tech-border glass-white focus:border-blue-500 outline-none transition-all resize-none text-slate-900 font-tech text-sm tracking-wide border-blue-100"
            placeholder={t.inputPlaceholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button 
            className="w-full" 
            size="lg" 
            onClick={parseFlashcards}
            disabled={!text.trim()}
          >
            {t.parse}
          </Button>
        </div>

        <div className="space-y-8">
          <Card className="p-8 border-blue-200">
            <h3 className="flex items-center gap-3 font-black mb-6 text-blue-600 uppercase tracking-widest text-xs font-tech">
              <Icons.Format size={18} />
              {t.formatGuide.title}
            </h3>
            <div className="p-5 bg-blue-50/50 rounded-sm tech-border border-blue-100/50">
              <pre className="text-[10px] font-tech font-bold text-slate-500 overflow-x-auto">
                {t.formatGuide.flashcard}
              </pre>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
