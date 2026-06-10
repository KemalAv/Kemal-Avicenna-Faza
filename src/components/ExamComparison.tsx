import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EXAM_COMPARISON_DATA, ComparisonRow } from '../data/examComparisonData';
import { 
  Trophy, 
  Search, 
  Gamepad2, 
  GraduationCap, 
  Brain, 
  Clock, 
  Percent, 
  Target,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  BarChart3,
  Eye,
  EyeOff,
  Filter,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  Settings2,
  Minimize2,
  Maximize2,
  Share2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type ViewMode = 'table' | 'chart' | 'calculator';
type ChartType = 'bar' | 'line' | 'area' | 'scatter';

interface ExamComparisonProps {
  t: any;
  language: string;
}

export const ExamComparison: React.FC<ExamComparisonProps> = ({ t, language }) => {
  // Column definitions
  const columns: { key: keyof ComparisonRow; label: string; icon: React.ReactNode; isChartable?: boolean }[] = [
    { key: 'jumlahBenar', label: t.cols.jumlahBenar, icon: <Target className="w-4 h-4" />, isChartable: true },
    { key: 'rankSNBT', label: t.cols.rankSNBT, icon: <Gamepad2 className="w-4 h-4" /> },
    { key: 'skorIRT', label: t.cols.skorIRT, icon: <GraduationCap className="w-4 h-4" />, isChartable: true },
    { key: 'posisiNasional', label: t.cols.posisiNasional, icon: <Trophy className="w-4 h-4" />, isChartable: true },
    { key: 'gdDifficulty', label: t.cols.gdDifficulty, icon: <Gamepad2 className="w-4 h-4" /> },
    { key: 'osuPP', label: t.cols.osuPP, icon: <Gamepad2 className="w-4 h-4" />, isChartable: true },
    { key: 'keketatan', label: t.cols.keketatan, icon: <Percent className="w-4 h-4" /> },
    { key: 'osuStar', label: t.cols.osuStar, icon: <Gamepad2 className="w-4 h-4" />, isChartable: true },
    { key: 'statusPenerimaan', label: t.cols.statusPenerimaan, icon: <Target className="w-4 h-4" /> },
    { key: 'gdMap', label: t.cols.gdMap, icon: <Gamepad2 className="w-4 h-4" /> },
    { key: 'chessElo', label: t.cols.chessElo, icon: <Brain className="w-4 h-4" />, isChartable: true },
    { key: 'sat', label: t.cols.sat, icon: <GraduationCap className="w-4 h-4" />, isChartable: true },
    { key: 'playHour', label: t.cols.playHour, icon: <Clock className="w-4 h-4" />, isChartable: true },
    { key: 'percentile', label: t.cols.percentile, icon: <Percent className="w-4 h-4" />, isChartable: true },
    { key: 'compoundDifficulty', label: t.cols.compoundDifficulty, icon: <Brain className="w-4 h-4" />, isChartable: true },
    { key: 'iq', label: t.cols.iq, icon: <Brain className="w-4 h-4" />, isChartable: true },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof ComparisonRow>('skorIRT');
  const [isSortedAsc, setIsSortedAsc] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [isNormalized, setIsNormalized] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // View Your Position State
  const [calcInput, setCalcInput] = useState<string>('');
  const [calcSubject, setCalcSubject] = useState<string>('IRT SNBT');
  
  // Axis selection for All Charts
  const chartableMetrics = useMemo(() => columns.filter(c => c.isChartable), []);
  const [xAxisMetric, setXAxisMetric] = useState<string>('Rank MLBB'); 
  const [yAxisMetrics, setYAxisMetrics] = useState<Set<string>>(new Set(['IRT SNBT']));

  const [visibleColumns, setVisibleColumns] = useState<Set<keyof ComparisonRow>>(
    new Set(columns.map(c => c.key))
  );

  const toggleYMetric = (label: string) => {
    const newSet = new Set(yAxisMetrics);
    if (newSet.has(label)) {
      if (newSet.size > 1) newSet.delete(label);
    } else {
      newSet.add(label);
    }
    setYAxisMetrics(newSet);
  };

  const parseValue = (val: string): number => {
    if (!val) return 0;
    const cleaned = val.replace(/[^0-9\- \.>★]/g, '').trim();
    const withoutPercent = cleaned.replace('%', '');
    if (withoutPercent.includes('-')) {
      const parts = withoutPercent.split('-').map(p => parseFloat(p.replace(/[^\d\.]/g, '')));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return (parts[0] + parts[1]) / 2;
      }
    }
    const fallback = parseFloat(withoutPercent.replace(/[^\d\.]/g, ''));
    return isNaN(fallback) ? 0 : fallback;
  };

  const filteredData = useMemo(() => {
    return EXAM_COMPARISON_DATA.filter(row => 
      Object.values(row).some(val => val.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  const chartData = useMemo(() => {
    let data = filteredData.map(row => {
      const entry: any = { 
        name: row.rankSNBT || row.statusPenerimaan,
        'Rank MLBB': row.rankSNBT 
      };
      columns.forEach(col => {
        if (col.isChartable) {
          entry[col.label] = parseValue(row[col.key]);
        }
      });
      return entry;
    });

    if (xAxisMetric !== 'Rank MLBB') {
      data = [...data].sort((a, b) => (a[xAxisMetric] || 0) - (b[xAxisMetric] || 0));
    } else {
      data = [...data].reverse();
    }

    if (isNormalized && data.length > 0) {
      const maxValues: any = {};
      columns.forEach(col => {
        if (col.isChartable) {
          maxValues[col.label] = Math.max(...data.map(d => d[col.label] || 0), 1);
        }
      });

      return data.map(d => {
        const normalizedEntry = { ...d };
        columns.forEach(col => {
          if (col.isChartable) {
            normalizedEntry[col.label] = (d[col.label] / maxValues[col.label]) * 100;
          }
        });
        return normalizedEntry;
      });
    }

    return data;
  }, [filteredData, isNormalized, xAxisMetric]);

  const matchingTier = useMemo(() => {
    if (!calcInput) return null;
    const val = parseFloat(calcInput);
    if (isNaN(val)) return null;

    const subjectCol = columns.find(c => c.label === calcSubject);
    if (!subjectCol) return null;

    return [...EXAM_COMPARISON_DATA].sort((a, b) => {
      const valA = parseValue(a[subjectCol.key]);
      const valB = parseValue(b[subjectCol.key]);
      return Math.abs(valA - val) - Math.abs(valB - val);
    })[0];
  }, [calcInput, calcSubject]);

  const activeColumns = columns.filter(col => visibleColumns.has(col.key));

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 60 }
    };

    const isXNumeric = xAxisMetric !== 'Rank MLBB';
    const activeYLabels = Array.from(yAxisMetrics);

    if (chartType === 'scatter') {
      const scatterY = (activeYLabels[0] || 'IRT SNBT') as string;
      return (
        <ScatterChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            type={isXNumeric ? "number" : "category"} 
            dataKey={xAxisMetric as any} 
            name={xAxisMetric} 
            unit={isNormalized ? '%' : ''} 
            label={{ value: xAxisMetric, position: 'insideBottom', offset: -40, fontSize: 12, fill: '#64748b', fontWeight: 800 }} 
            tick={{ fontSize: 10, fill: '#94a3b8' }}
          />
          <YAxis 
            type="number" 
            dataKey={scatterY as any} 
            name={scatterY} 
            unit={isNormalized ? '%' : ''} 
            label={{ value: scatterY, angle: -90, position: 'insideLeft', offset: 0, fontSize: 12, fill: '#64748b', fontWeight: 800 }} 
            tick={{ fontSize: 10, fill: '#94a3b8' }}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }} 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as any;
                return (
                  <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100">
                    <p className="font-black text-slate-800 border-b pb-1 mb-2 text-xs">{item.name}</p>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">{xAxisMetric}: {item[xAxisMetric]}</p>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">{scatterY}: {item[scatterY]}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter name="Data" data={chartData} fill="#3b82f6" />
        </ScatterChart>
      );
    }

    const XComponent = <XAxis 
      dataKey={xAxisMetric as any} 
      type={isXNumeric ? "number" : "category"}
      angle={-45} 
      textAnchor="end" 
      interval={isXNumeric ? 'preserveStartEnd' : 0} 
      height={60} 
      tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} 
      label={{ value: xAxisMetric, position: 'insideBottom', offset: -45, fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
    />;

    if (chartType === 'bar') {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          {XComponent}
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} unit={isNormalized ? '%' : ''} />
          <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f8fafc' }} />
          <Legend wrapperStyle={{ paddingTop: '40px' }} />
          {activeYLabels.map((label, index) => (
            <Bar key={label} dataKey={label as any} fill={`hsl(${210 + (index * 35)}, 75%, 55%)`} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      );
    }

    if (chartType === 'line') {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          {XComponent}
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} unit={isNormalized ? '%' : ''} />
          <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
          <Legend wrapperStyle={{ paddingTop: '40px' }} />
          {activeYLabels.map((label, index) => (
            <Line key={label} type="monotone" dataKey={label as any} stroke={`hsl(${210 + (index * 35)}, 75%, 55%)`} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          ))}
        </LineChart>
      );
    }

    return (
      <AreaChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        {XComponent}
        <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} unit={isNormalized ? '%' : ''} />
        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
        <Legend wrapperStyle={{ paddingTop: '40px' }} />
        {activeYLabels.map((label, index) => (
          <Area key={label} type="monotone" dataKey={label as any} stackId="1" stroke={`hsl(${210 + (index * 35)}, 75%, 55%)`} fill={`hsl(${210 + (index * 35)}, 75%, 55%)`} fillOpacity={0.6} />
        ))}
      </AreaChart>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center text-slate-900 border-b pb-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 inline-flex items-center gap-3 text-slate-900 uppercase">
              <Trophy className="w-10 h-10 text-blue-600" />
              {t.title}
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </motion.div>
        </header>

        {/* Toolbar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* View Switcher */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === 'table' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  {t.table}
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === 'chart' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <BarChart3 className="w-4 h-4" />
                  {t.chart}
                </button>
                <button
                  onClick={() => setViewMode('calculator')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === 'calculator' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Target className="w-4 h-4" />
                  {t.calculator}
                </button>
              </div>

              {/* Chart Options */}
              {viewMode === 'chart' && (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                    {[
                      { type: 'bar', icon: <BarChart3 className="w-4 h-4" /> },
                      { type: 'line', icon: <LineChartIcon className="w-4 h-4" /> },
                      { type: 'area', icon: <AreaChartIcon className="w-4 h-4" /> },
                      { type: 'scatter', icon: <Share2 className="w-4 h-4 rotate-90" /> }
                    ].map(t_icon => (
                      <button
                        key={t_icon.type}
                        onClick={() => setChartType(t_icon.type as ChartType)}
                        className={`p-2 rounded-xl transition-all ${chartType === t_icon.type ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
                        title={`${t_icon.type.charAt(0).toUpperCase()}${t_icon.type.slice(1)} Chart`}
                      >
                        {t_icon.icon}
                      </button>
                    ))}
                    <div className="w-[1px] h-4 bg-slate-200 mx-1" />
                    <button
                      onClick={() => setIsNormalized(!isNormalized)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${isNormalized ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
                      title={isNormalized ? "Disable Normalization" : "Normalize different scales (e.g. IQ vs SAT)"}
                    >
                      {isNormalized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                      {isNormalized ? t.fixed : t.normalized}
                    </button>
                  </div>

                  {/* Universal Axis Selectors */}
                  <div className="flex flex-wrap items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 px-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{t.xAxis}:</span>
                      <select 
                        value={xAxisMetric}
                        onChange={(e) => setXAxisMetric(e.target.value)}
                        className="text-xs font-bold bg-transparent border-none outline-none text-blue-600 cursor-pointer hover:text-blue-700"
                      >
                        <option value="Rank MLBB">Rank MLBB</option>
                        {chartableMetrics.map(m => <option key={m.label} value={m.label}>{m.label}</option>)}
                      </select>
                    </div>

                    <div className="w-[1px] h-4 bg-slate-200" />

                    <div className="flex items-center gap-2 px-3 max-w-[200px] sm:max-w-none overflow-x-auto no-scrollbar">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter whitespace-nowrap">{t.yAxis}:</span>
                      <div className="flex items-center gap-1">
                        {chartableMetrics.map(m => (
                          <button
                            key={m.label}
                            onClick={() => toggleYMetric(m.label)}
                            className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase transition-all border ${yAxisMetrics.has(m.label) ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'}`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all text-sm font-semibold ${showFilters ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-white border-slate-200 text-slate-600 shadow-sm hover:border-slate-300'}`}
              >
                <Settings2 className="w-4 h-4" />
                {t.columns}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {columns.map(col => (
                    <button
                      key={col.key}
                      onClick={() => {
                        const newSet = new Set(visibleColumns);
                        if (newSet.has(col.key)) newSet.delete(col.key);
                        else newSet.add(col.key);
                        setVisibleColumns(newSet);
                      }}
                      className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${visibleColumns.has(col.key) ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'}`}
                    >
                      <span className="truncate">{col.label}</span>
                      {visibleColumns.has(col.key) ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {viewMode === 'table' ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    {activeColumns.map((col) => (
                      <th 
                        key={col.key}
                        className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => {
                          if (sortField === col.key) setIsSortedAsc(!isSortedAsc);
                          else { setSortField(col.key); setIsSortedAsc(true); }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {col.icon}
                          <span>{col.label}</span>
                          {sortField === col.key && (isSortedAsc ? <ChevronUp className="w-3" /> : <ChevronDown className="w-3" />)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredData.map((row, idx) => (
                    <motion.tr key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.01 }} className="hover:bg-slate-50/80 transition-all group">
                      {activeColumns.map((col) => (
                        <td key={`${idx}-${col.key}`} className="px-6 py-4 text-sm text-slate-600 font-medium whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-lg ${col.key === 'statusPenerimaan' && row[col.key].includes('ACCEPTED') ? 'bg-emerald-50 text-emerald-700 font-bold' : ''} ${col.key === 'iq' && row[col.key].includes('145') ? 'bg-indigo-50 text-indigo-700 font-black' : ''} ${col.key === 'rankSNBT' && row[col.key].includes('Immortal') ? 'text-orange-600 font-black italic' : ''}`}>
                            {row[col.key]}
                          </span>
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredData.length === 0 && (
              <div className="py-20 text-center text-slate-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg">{t.noMatches}</p>
              </div>
            )}
          </motion.div>
        ) : viewMode === 'chart' ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 min-h-[600px] flex flex-col"
          >
            <div className="w-full h-[500px] relative">
              <div className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%" debounce={100}>
                  {renderChart()}
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-slate-50 rounded-2xl flex flex-col md:flex-row gap-6 md:items-center">
              <div className="flex-1">
                <p className="font-bold mb-1 text-slate-800 text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-600" />
                  Comparative Insights:
                </p>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {isNormalized 
                    ? "Currently in Normalized Mode: All subjects (IQ, SAT, etc.) are scaled to 0-100. This allows you to compare the relative difficulty curves of different subjects side-by-side."
                    : "Currently in Absolute Mode: Charts show raw values. Note that higher point values will dwarf smaller ones."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeColumns.filter(c => c.isChartable).map((col, i) => (
                  <div key={col.key} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `hsl(${210 + (i * 35)}, 75%, 55%)` }} />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">{col.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden max-w-4xl mx-auto"
          >
            <div className="grid md:grid-cols-2">
              <div className="p-8 border-r border-slate-100 bg-slate-50/30">
                <div className="mb-6">
                  <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{t.calcTitle}</h2>
                  <p className="text-sm text-slate-500 font-medium">{t.calcSubtitle}</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{t.chooseSubject}</label>
                    <select 
                      value={calcSubject}
                      onChange={(e) => setCalcSubject(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-bold text-slate-700"
                    >
                      {chartableMetrics.map(m => (
                        <option key={m.label} value={m.label}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{t.inputScore}</label>
                    <input 
                      type="number"
                      placeholder={t.scorePlaceholder}
                      value={calcInput}
                      onChange={(e) => setCalcInput(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-mono font-bold text-lg"
                    />
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <p className="text-[10px] text-blue-600 font-bold uppercase leading-tight italic">
                    {t.calcDesc}
                  </p>
                </div>
              </div>

              <div className="p-8">
                {matchingTier ? (
                  <div className="space-y-6">
                    <div className="pb-6 border-b border-slate-100">
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{t.standing}</p>
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                        {language === 'en' ? matchingTier.rankSNBT : matchingTier.rankSNBT}
                      </h3>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-black uppercase tracking-tight border border-green-100">
                        <Target className="w-3 h-3" />
                        {matchingTier.statusPenerimaan}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {columns.map(col => {
                        if (col.key === 'rankSNBT' || col.key === 'statusPenerimaan') return null;
                        return (
                          <motion.div 
                            key={col.key} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
                                {col.icon}
                              </div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter whitespace-nowrap">{col.label}</p>
                            </div>
                            <p className="text-xs font-black text-slate-800 tracking-tight leading-tight">
                              {matchingTier[col.key]}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="pt-4 mt-2">
                      <div className="p-4 bg-slate-900 rounded-2xl text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-4 h-4 text-blue-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{t.insight}</span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
                          {t.insightDesc
                            .replace('{subject}', calcSubject)
                            .replace('{percentile}', matchingTier.percentile)
                            .replace('{hours}', matchingTier.playHour)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                    <Brain className="w-16 h-16 mb-4 text-slate-300" />
                    <p className="font-bold text-slate-400 uppercase tracking-widest text-xs whitespace-pre-line">{t.enterStats}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <footer className="mt-16 text-center text-slate-400 text-sm py-8 border-t border-slate-200">
          <p>© 2026 Worldwide Exam Comparison Tool • Cultural Reference Benchmarks</p>
        </footer>
      </div>
    </div>
  );
};
