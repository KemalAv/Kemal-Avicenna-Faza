import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './Card';
import { Button } from './Button';
import { Icons } from '../constants';
import { MultipleChoiceQuestion } from '../types';
import { ContentRenderer } from './ContentRenderer';

interface MultipleChoiceAreaProps {
  questions: MultipleChoiceQuestion[];
  t: any;
  onBack: () => void;
  latexEnabled: boolean;
}

export const MultipleChoiceArea: React.FC<MultipleChoiceAreaProps> = ({ 
  questions, 
  t, 
  onBack,
  latexEnabled 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));

  const currentQ = questions[currentIndex];

  const handleSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = index;
    setUserAnswers(newAnswers);
    if (index === currentQ.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsFinished(false);
    setScore(0);
    setUserAnswers(new Array(questions.length).fill(null));
  };

  if (isFinished) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <Card className="p-12 text-center space-y-8">
          <div className="w-24 h-24 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400">
            <Icons.MCQ size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-display font-bold dark:text-white uppercase tracking-tight">{t.finish}</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400">
              {t.score.replace('{score}', `${score}/${questions.length}`)}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" onClick={reset} icon={<Icons.Reset size={20} />}>
              {t.repeat}
            </Button>
            <Button variant="outline" size="lg" onClick={onBack}>
              {t.newSet}
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <h3 className="text-xl font-bold dark:text-white px-4">{t.quiz.reviewResults}</h3>
          {questions.map((q, idx) => {
            const userAnswer = userAnswers[idx];
            const isCorrect = userAnswer === q.correctAnswer;
            
            return (
              <Card key={idx} className={`p-6 border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-400 uppercase">{t.questionCount.replace('{current}', idx + 1)}</span>
                    {isCorrect ? (
                      <span className="text-green-600 font-bold flex items-center gap-1">
                        <Icons.MCQ size={16} /> {t.quiz.correctLabel}
                      </span>
                    ) : (
                      <span className="text-red-600 font-bold">{t.quiz.wrongLabel}</span>
                    )}
                  </div>
                  
                  <ContentRenderer 
                    content={q.question} 
                    latexEnabled={latexEnabled} 
                    className="text-lg font-bold dark:text-white"
                  />

                  <div className="grid gap-3">
                    <div className="text-xs font-bold text-slate-400 uppercase">{t.quiz.optionsLabel}</div>
                    {q.options.map((option, optIdx) => {
                      const char = String.fromCharCode(65 + optIdx);
                      const isCorrect = optIdx === q.correctAnswer;
                      const isSelected = optIdx === userAnswer;
                      
                      let appearance = 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400';
                      
                      if (isCorrect) {
                        appearance = 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 ring-1 ring-green-500/20';
                      } else if (isSelected && !isCorrect) {
                        appearance = 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 ring-1 ring-red-500/20';
                      }

                      return (
                        <div key={optIdx} className={`p-4 rounded-xl border-2 flex items-start gap-4 ${appearance}`}>
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold flex-shrink-0 text-xs ${isCorrect ? 'bg-green-500 text-white' : isSelected ? 'bg-red-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                            {char}
                          </span>
                          <div className="flex-1">
                            <ContentRenderer content={option} latexEnabled={latexEnabled} className="text-sm font-medium" />
                          </div>
                          {isCorrect && <span className="text-[10px] font-black uppercase text-green-600 dark:text-green-400 self-center">{t.quiz.answerKey}</span>}
                          {isSelected && !isCorrect && <span className="text-[10px] font-black uppercase text-red-600 dark:text-red-400 self-center">{t.quiz.yourAnswer}</span>}
                          {isSelected && isCorrect && <span className="text-[10px] font-black uppercase text-green-600 dark:text-green-400 self-center ml-2">✓ {t.quiz.yourAnswer}</span>}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2">{t.explanation}</div>
                      <ContentRenderer content={q.explanation} latexEnabled={latexEnabled} className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed" />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={onBack} icon={<Icons.Prev size={18} />} />
        <div className="flex items-center gap-6">
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            {t.questionCount.replace('{current}', currentIndex + 1)}
          </div>
          <div className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            {t.score.replace('{score}', score)}
          </div>
        </div>
        <div className="w-10" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-8"
        >
          <Card className="p-8">
            <ContentRenderer 
              content={currentQ.question} 
              latexEnabled={latexEnabled} 
              className="text-xl font-bold dark:text-white leading-relaxed"
            />
          </Card>

          <div className="grid gap-4">
            {currentQ.options.map((option, idx) => {
              const char = String.fromCharCode(65 + idx);
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctAnswer;
              const showResult = selectedOption !== null;

              let variant: 'secondary' | 'primary' | 'outline' = 'secondary';
              let customStyle = '';

              if (showResult) {
                if (isCorrect) customStyle = 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400';
                else if (isSelected) customStyle = 'ring-2 ring-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400';
                else customStyle = 'opacity-50';
              } else {
                customStyle = 'hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-left flex items-start gap-4 ${customStyle}`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0 ${showResult && isCorrect ? 'bg-green-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {char}
                  </span>
                  <ContentRenderer content={option} latexEnabled={latexEnabled} className="text-lg font-medium" />
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-6"
            >
              <Card className={`p-6 border-l-4 ${selectedOption === currentQ.correctAnswer ? 'border-l-green-500 bg-green-50/30' : 'border-l-red-500 bg-red-50/30'}`}>
                <h4 className="font-bold mb-2 dark:text-white flex items-center gap-2">
                  {selectedOption === currentQ.correctAnswer ? (
                    <span className="text-green-600 flex items-center gap-2"><Icons.MCQ size={18}/> {t.correct}</span>
                  ) : (
                    <span className="text-red-600">{t.wrong}</span>
                  )}
                </h4>
                {currentQ.explanation && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2">{t.explanation}</div>
                    <ContentRenderer content={currentQ.explanation} latexEnabled={latexEnabled} className="text-slate-600 dark:text-slate-400" />
                  </div>
                )}
              </Card>

              <Button variant="primary" size="lg" className="w-full" onClick={handleNext}>
                {currentIndex === questions.length - 1 ? t.finish : t.next}
                <Icons.Next size={20} />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
