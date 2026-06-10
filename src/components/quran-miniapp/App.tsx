import React from 'react';
import { ThemeProvider } from './hooks/useTheme';
import { useLocalization } from './hooks/useLocalization';
import { ViewState, Surah, Ayah, MemorizationStats } from './types';
import { SurahList } from './components/SurahList';
import { ReadingView } from './components/ReadingView';
import { MemorizationView } from './components/MemorizationView';
import { AnalysisView } from './components/AnalysisView';
import { Loader2, ArrowLeft } from 'lucide-react';

interface QuranMiniAppProps {
  onClose?: () => void;
}

const QuranMiniAppContent: React.FC<QuranMiniAppProps> = ({ onClose }) => {
  const [view, setView] = React.useState<ViewState>('LIST_VIEW');
  const [surahs, setSurahs] = React.useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = React.useState<Surah | null>(null);
  const [ayahs, setAyahs] = React.useState<Ayah[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [stats, setStats] = React.useState<MemorizationStats | null>(null);
  const [memoStartIndex, setMemoStartIndex] = React.useState(0);

  const { t, currentLanguage } = useLocalization();

  React.useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://api.alquran.cloud/v1/surah');
      const data = await res.json();
      setSurahs(data.data);
    } catch (err) {
      console.error('Failed to fetch surahs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSurah = async (surah: Surah, startAyah: number) => {
    try {
      setLoading(true);
      setSelectedSurah(surah);
      
      // Fetch Arab text, translation, and audio
      // Using edition 'quran-uthmani' for text, 'ar.alafasy' for audio
      const edition = currentLanguage === 'id' ? 'id.indonesian' : currentLanguage === 'es' ? 'es.cortes' : 'en.ahmedali';
      
      const [arabRes, transRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-uthmani,ar.alafasy`),
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/editions/${edition}`)
      ]);

      const arabData = await arabRes.json();
      const transData = await transRes.json();

      const combinedAyahs: Ayah[] = arabData.data[0].ayahs.map((a: any, i: number) => {
        let text = a.text;
        // Filter Basmalah preamble for non-Al-Fatihah and non-At-Tawbah at first ayah
        if (surah.number !== 1 && surah.number !== 9 && i === 0) {
          text = text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim();
        }

        return {
          ...a,
          text,
          audio: arabData.data[1].ayahs[i].audio,
          translation: transData.data[0].ayahs[i].text
        };
      }).slice(startAyah - 1);

      setAyahs(combinedAyahs);
      setView('READING_VIEW');
    } catch (err) {
      console.error('Failed to fetch ayahs', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && view === 'LIST_VIEW' && surahs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#f8fafc] geometric-bg">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4 shadow-glow-blue" />
        <p className="text-slate-400 text-xs font-black font-tech uppercase tracking-[0.2em]">Synchronizing Holy Data...</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden font-sans bg-[#f8fafc]/50 backdrop-blur-sm">
      <div className="absolute inset-0 z-[-1] geometric-bg opacity-30" />
      {view === 'LIST_VIEW' && (
        <SurahList surahs={surahs} onSelect={handleSelectSurah} />
      )}

      {view === 'READING_VIEW' && selectedSurah && (
        <ReadingView 
          surah={selectedSurah} 
          ayahs={ayahs} 
          onBack={() => setView('LIST_VIEW')}
          onStartMemorizing={(idx) => {
            setMemoStartIndex(idx);
            setView('MEMORIZATION_VIEW');
          }}
        />
      )}

      {view === 'MEMORIZATION_VIEW' && selectedSurah && (
        <MemorizationView 
          surah={selectedSurah} 
          ayahs={ayahs} 
          startIndex={memoStartIndex}
          onBack={() => setView('READING_VIEW')}
          onFinish={(s) => {
            setStats(s);
            setView('ANALYSIS_VIEW');
          }}
        />
      )}

      {view === 'ANALYSIS_VIEW' && selectedSurah && stats && (
        <AnalysisView 
          surah={selectedSurah} 
          ayahs={ayahs} 
          stats={stats} 
          onBack={() => setView('LIST_VIEW')}
        />
      )}

      {loading && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center z-[100]">
          <div className="glass-white p-6 rounded-sm tech-border flex items-center space-x-4 shadow-glow-white border-blue-100">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            <span className="text-xs font-black font-tech uppercase tracking-widest text-slate-900">Accessing Metadata...</span>
          </div>
        </div>
      )}

      {/* Global Close Button to return to parent app */}
      {view === 'LIST_VIEW' && onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-20 p-2 glass-white shadow-sm rounded-sm tech-border hover:bg-white hover:text-blue-500 transition-all z-[60] border-blue-100"
        >
          <ArrowLeft className="w-5 h-5 text-slate-900 transition-colors" />
        </button>
      )}
    </div>
  );
};

export const QuranMiniApp: React.FC<QuranMiniAppProps> = (props) => (
  <ThemeProvider>
    <QuranMiniAppContent {...props} />
  </ThemeProvider>
);

export default QuranMiniApp;
