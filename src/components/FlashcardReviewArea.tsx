import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './Card';
import { Button } from './Button';
import { Icons } from '../constants';
import { Flashcard } from '../types';
import { ContentRenderer } from './ContentRenderer';

interface FlashcardReviewAreaProps {
  cards: Flashcard[];
  t: any;
  onBack: () => void;
  latexEnabled: boolean;
}

export const FlashcardReviewArea: React.FC<FlashcardReviewAreaProps> = ({ 
  cards, 
  t, 
  onBack,
  latexEnabled 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [direction, setDirection] = useState(0);

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={onBack} icon={<Icons.Prev size={18} />} />
        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
          {t.cardCount.replace('{current}', currentIndex + 1).replace('{total}', cards.length)}
        </div>
        <div className="w-10" />
      </div>

      <div className="relative h-[400px] mb-12 perspective-1000">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 100 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="w-full h-full"
          >
            <motion.div
              animate={{ rotateY: showAnswer ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
              className="w-full h-full relative preserve-3d cursor-pointer"
              onClick={() => setShowAnswer(!showAnswer)}
            >
              {/* Front */}
              <Card className="absolute inset-0 backface-hidden p-12 flex flex-col items-center justify-center text-center overflow-visible">
                <div className="text-blue-500 mb-6 uppercase tracking-widest font-bold text-xs">{t.review.question}</div>
                <ContentRenderer 
                  content={currentCard.question} 
                  latexEnabled={latexEnabled} 
                  className="text-2xl font-bold dark:text-white"
                />
                <div className="mt-8 text-slate-400 text-sm flex items-center gap-2">
                  <Icons.Show size={14} />
                  {t.review.clickReveal}
                </div>
              </Card>

              {/* Back */}
              <Card 
                className="absolute inset-0 backface-hidden p-12 flex flex-col items-center justify-center text-center rotate-y-180 bg-blue-50 dark:bg-slate-800 overflow-visible"
              >
                <div className="text-green-500 mb-6 uppercase tracking-widest font-bold text-xs">{t.review.answer}</div>
                <ContentRenderer 
                  content={currentCard.answer} 
                  latexEnabled={latexEnabled} 
                  className="text-2xl font-bold dark:text-white"
                />
                <div className="mt-8 text-slate-400 text-sm flex items-center gap-2">
                  <Icons.Hide size={14} />
                  {t.review.clickHide}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-6">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          icon={<Icons.Prev size={20} />}
        />
        <Button 
          variant="primary" 
          size="lg" 
          className="min-w-[200px]"
          onClick={() => setShowAnswer(!showAnswer)}
          icon={showAnswer ? <Icons.Hide size={20} /> : <Icons.Show size={20} />}
        >
          {showAnswer ? t.hideAnswer : t.showAnswer}
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handleNext} 
          disabled={currentIndex === cards.length - 1}
          icon={<Icons.Next size={20} />}
        />
      </div>
    </div>
  );
};
