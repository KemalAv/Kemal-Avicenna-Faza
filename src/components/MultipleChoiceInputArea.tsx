import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Icons } from '../constants';
import { MultipleChoiceQuestion } from '../types';

interface MultipleChoiceInputAreaProps {
  onParse: (questions: MultipleChoiceQuestion[]) => void;
  t: any;
  onBack: () => void;
}

export const MultipleChoiceInputArea: React.FC<MultipleChoiceInputAreaProps> = ({ onParse, t, onBack }) => {
  const [text, setText] = useState('');

  const parseMCQs = () => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l !== '');
    const questions: MultipleChoiceQuestion[] = [];
    
    let currentQ: Partial<MultipleChoiceQuestion> = { options: [] };
    
    const questionRegex = /^(Soal|Question)\s+\d+\s*:/i;
    const optionRegex = /^[A-D](\.|\)|:)/i;
    const keyRegex = /^(Kunci|Correct)\s*:/i;
    const explanationRegex = /^(Penjelasan|Explanation)\s*:/i;

    lines.forEach((line) => {
      if (questionRegex.test(line)) {
        if (currentQ.question && currentQ.options?.length === 4 && currentQ.correctAnswer !== undefined) {
          questions.push(currentQ as MultipleChoiceQuestion);
        }
        currentQ = {
          id: questions.length + 1,
          question: line.replace(questionRegex, '').trim(),
          options: []
        };
      } else if (optionRegex.test(line)) {
        currentQ.options?.push(line.replace(/^[A-D](\.|\)|:)\s*/i, '').trim());
      } else if (keyRegex.test(line)) {
        const keyChar = line.replace(keyRegex, '').trim().toUpperCase();
        const index = keyChar.charCodeAt(0) - 65; // A=0, B=1, ...
        currentQ.correctAnswer = index;
      } else if (explanationRegex.test(line)) {
        currentQ.explanation = line.replace(explanationRegex, '').trim();
      }
    });

    if (currentQ.question && currentQ.options?.length === 4 && currentQ.correctAnswer !== undefined) {
      questions.push(currentQ as MultipleChoiceQuestion);
    }

    if (questions.length > 0) {
      onParse(questions);
    } else {
      alert('Invalid format. Please check the guide (must have exactly 4 options A-D and a Correct Key).');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack} icon={<Icons.Prev size={18} />} />
        <h2 className="text-2xl font-bold dark:text-white">{t.mcq} - {t.inputTitle}</h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <textarea
            className="w-full h-96 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:border-purple-500 focus:ring-0 transition-all resize-none dark:text-white font-mono text-sm"
            placeholder={t.inputPlaceholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700" 
            size="lg" 
            onClick={parseMCQs}
            disabled={!text.trim()}
          >
            {t.parse}
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/30">
            <h3 className="flex items-center gap-2 font-bold mb-4 text-purple-900 dark:text-purple-300">
              <Icons.Format size={18} />
              {t.formatGuide.title}
            </h3>
            <pre className="text-xs bg-white dark:bg-slate-800 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30 overflow-x-auto text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
              {t.formatGuide.mcq}
            </pre>
          </Card>
        </div>
      </div>
    </div>
  );
};
