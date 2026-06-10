/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Socials from './components/Socials';
import DreamPlan from './components/DreamPlan';
import Articles from './components/Articles';
import { works, apps } from './data';
import spaceBg from './assets/images/starwars_space_background_1781099518964.png';

// Mini App Imports
import { MainMenu } from './components/MainMenu';
import { FlashcardInputArea } from './components/FlashcardInputArea';
import { FlashcardReviewArea } from './components/FlashcardReviewArea';
import { MultipleChoiceInputArea } from './components/MultipleChoiceInputArea';
import { MultipleChoiceArea } from './components/MultipleChoiceArea';
import { QuranMiniApp } from './components/quran-miniapp/App';
import { ExamComparison } from './components/ExamComparison';
import { useLocalization } from './hooks/useLocalization';
import { AppView, PracticeMode, PracticeView, Flashcard, MultipleChoiceQuestion } from './types';
import { Icons } from './constants';
import { Button } from './components/Button';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<AppView>('MAIN_SITE');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('FLASHCARD');
  const [practiceView, setPracticeView] = useState<PracticeView>('MENU');

  // App Settings
  const [latexEnabled, setLatexEnabled] = useState(true);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const { t, language, setLanguage, toggleLanguage } = useLocalization();

  // Data State
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [mcqs, setMcqs] = useState<MultipleChoiceQuestion[]>([]);

  // Handlers
  const openApp = useCallback((title: string) => {
    if (title === "Bikin Kuis Materi") {
      setLanguage('id'); // Force Indonesian for Practice App
      setCurrentView('PRACTICE_APP');
      setPracticeView('MENU');
      window.scrollTo(0, 0);
    } else if (title === "Belajar Al-Qur'an") {
      setCurrentView('QURAN_APP');
      window.scrollTo(0, 0);
    } else if (title === "Bandingkan Skor Ujian") {
      setCurrentView('EXAM_COMPARISON_APP');
      window.scrollTo(0, 0);
    }
  }, [setLanguage]);

  const handleFlashcardParse = (cards: Flashcard[]) => {
    let finalCards = [...cards];
    if (shuffleEnabled) {
      finalCards = finalCards.sort(() => Math.random() - 0.5);
    }
    setFlashcards(finalCards);
    setPracticeView('REVIEW');
  };

  const handleMCQParse = (questions: MultipleChoiceQuestion[]) => {
    let finalQs = [...questions];
    if (shuffleEnabled) {
      finalQs = finalQs.sort(() => Math.random() - 0.5);
    }
    setMcqs(finalQs);
    setPracticeView('QUIZ');
  };

  if (currentView === 'PRACTICE_APP') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300 pb-20">
        {/* App Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
              onClick={() => setCurrentView('MAIN_SITE')}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                K
              </div>
              <span className="font-display font-bold dark:text-white hidden sm:inline">Kuis Materi</span>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant={latexEnabled ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setLatexEnabled(!latexEnabled)}
                icon={<Icons.Math size={18} />}
              >
                <span className="hidden sm:inline">LaTeX</span>
              </Button>
              <Button 
                variant={shuffleEnabled ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setShuffleEnabled(!shuffleEnabled)}
                icon={<Icons.Reset size={18} />}
              >
                <span className="hidden sm:inline">{t.practice.settings.shuffle}</span>
              </Button>
            </div>
          </div>
        </header>

        {/* App Content */}
        <main className="container mx-auto">
          {practiceView === 'MENU' && (
            <MainMenu 
              onSelectMode={(mode) => {
                setPracticeMode(mode);
                setPracticeView('INPUT');
              }} 
              t={t.practice}
              onBack={() => setCurrentView('MAIN_SITE')}
            />
          )}

          {practiceView === 'INPUT' && practiceMode === 'FLASHCARD' && (
            <FlashcardInputArea 
              onParse={handleFlashcardParse}
              t={t.practice}
              onBack={() => setPracticeView('MENU')}
            />
          )}

          {practiceView === 'INPUT' && practiceMode === 'MCQ' && (
            <MultipleChoiceInputArea 
              onParse={handleMCQParse}
              t={t.practice}
              onBack={() => setPracticeView('MENU')}
            />
          )}

          {practiceView === 'REVIEW' && (
            <FlashcardReviewArea 
              cards={flashcards}
              t={t.practice}
              onBack={() => setPracticeView('INPUT')}
              latexEnabled={latexEnabled}
            />
          )}

          {practiceView === 'QUIZ' && (
            <MultipleChoiceArea 
              questions={mcqs}
              t={t.practice}
              onBack={() => setPracticeView('INPUT')}
              latexEnabled={latexEnabled}
            />
          )}
        </main>
      </div>
    );
  }

  if (currentView === 'QURAN_APP') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
        <QuranMiniApp onClose={() => setCurrentView('MAIN_SITE')} />
      </div>
    );
  }

  if (currentView === 'EXAM_COMPARISON_APP') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentView('MAIN_SITE')}
            icon={<Icons.Prev size={18} />}
            className="bg-white/80 backdrop-blur-sm shadow-sm"
          >
            Kembali
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleLanguage}
            className="bg-white/80 backdrop-blur-sm shadow-sm font-bold uppercase tracking-widest text-[10px]"
          >
            {language === 'id' ? 'English' : 'Indonesia'}
          </Button>
        </div>
        <ExamComparison t={t.exam} language={language} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 geometric-bg opacity-40" />
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-white/80 via-transparent to-blue-50/30" />

      <div className="relative z-10">
        <Header />
        
        <main>
          <Hero />
          
          <div id="works">
            <Projects id="works" title="Portofolio" items={works} />
          </div>

          <div id="apps">
            <Projects 
              id="apps" 
              title="Kumpulan Aplikasi" 
              items={apps} 
              onItemClick={(item) => openApp(item.title)}
            />
          </div>

          <Socials />
          
          <DreamPlan />
          
          <Articles />
        </main>

        <footer className="py-12 px-4 border-t border-slate-200 bg-white/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2">
              <h3 className="font-display font-bold text-2xl text-slate-900 tracking-tight">Kemal Avicenna Faza</h3>
              <p className="text-sm text-slate-500 font-tech">© 2026. Semua Hak Dilindungi.</p>
            </div>
            
            <div className="flex items-center gap-8 font-tech">
              <a href="#profile" className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em]">Profil</a>
              <a href="#works" className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em]">Karya</a>
              <a href="#articles" className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em]">Artikel</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
