import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EXAM_COMPARISON_DATA, ComparisonRow, INTERPOLATION_DATA, InterpolationPoint } from '../data/examComparisonData';
import { TIER_VISUAL_DATA, TierVisualInfo } from '../data/tierVisualData';
import { PercentileBellCurve } from './PercentileBellCurve';
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
  Share2,
  Terminal,
  Zap,
  Rocket,
  Flame,
  Activity,
  ShieldAlert,
  Thermometer,
  CloudLightning
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
    { key: 'keketatan', label: t.cols.keketatan, icon: <Percent className="w-4 h-4" />, isChartable: true },
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
    
    // Clean string but keep meaningful characters for ranges and numbers
    let cleaned = val.replace(/[^0-9\-– \.,>★]/g, '').trim();
    
    const processNumber = (s: string) => {
      if (s.includes(':')) {
        return parseFloat(s.split(':')[1]) || 1;
      }
      if (s.toLowerCase().includes('accepted')) return 1;

      // Remove internal dots/commas as thousand separators
      // Heuristic: if a dot/comma is followed by 3 digits, it's a separator
      let res = s.replace(/[\.,](\d{3})(?![0-9])/g, '$1');
      // Replace remaining comma with dot for Indonesian decimal format support if needed
      // but in this specific dataset, we mainly use dot for decimal in some and comma in others.
      // Normalize to dot.
      res = res.replace(',', '.');
      // If there's still more than one dot, it might be multiple thousand separators.
      // But process above should have handled it.
      return parseFloat(res.replace(/[^\d\.]/g, ''));
    };

    // Handle ranges like "140–149" or "3.000–4.000"
    if (cleaned.includes('-') || cleaned.includes('–')) {
      const parts = cleaned.split(/[–-]/).map(p => processNumber(p));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return (parts[0] + parts[1]) / 2;
      }
    }
    
    const result = processNumber(cleaned);
    return isNaN(result) ? 0 : result;
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
        'Rank MLBB': row.rankSNBT,
        _row: row
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
      const fixedMax: Record<string, number> = {
        [t.cols.skorIRT]: 850,
        [t.cols.jumlahBenar]: 160,
        [t.cols.percentile]: 100,
        [t.cols.posisiNasional]: 1000000, 
        [t.cols.sat]: 1600,
        [t.cols.iq]: 160,
        [t.cols.playHour]: 5000,
        [t.cols.chessElo]: 3000,
        [t.cols.osuPP]: 1500,
        [t.cols.osuStar]: 12,
        [t.cols.keketatan]: 150,
        [t.cols.compoundDifficulty]: 5000000,
      };

      return data.map(d => {
        const normalizedEntry = { ...d };
        columns.forEach(col => {
          if (col.isChartable) {
            const val = d[col.label] || 0;
            const max = fixedMax[col.label] || Math.max(...data.map(item => item[col.label] || 0), 1);
            
            if (col.label === t.cols.posisiNasional) {
              // Rank: lower is better, so 1 -> 100%, 1,000,000 -> 0%
              normalizedEntry[col.label] = Math.max(0, ((max - val) / max) * 100);
            } else {
              normalizedEntry[col.label] = (val / max) * 100;
            }
          }
        });
        return normalizedEntry;
      });
    }

    return data;
  }, [filteredData, isNormalized, xAxisMetric, t]);

  const colToInterpKey: Record<string, keyof InterpolationPoint> = useMemo(() => ({
    [t.cols.jumlahBenar]: 'benar',
    [t.cols.rankSNBT]: 'mlbb',
    [t.cols.skorIRT]: 'irt',
    [t.cols.posisiNasional]: 'rank',
    [t.cols.gdDifficulty]: 'gd',
    [t.cols.osuPP]: 'pp',
    [t.cols.keketatan]: 'sel',
    [t.cols.osuStar]: 'star',
    [t.cols.sat]: 'sat',
    [t.cols.playHour]: 'jam',
    [t.cols.percentile]: 'pct',
    [t.cols.compoundDifficulty]: 'comp',
    [t.cols.iq]: 'iq',
    [t.cols.chessElo]: 'elo',
    [t.cols.statusPenerimaan]: 'univ',
    [t.cols.gdMap]: 'map'
  }), [t]);

  const interpolationResult = useMemo(() => {
    if (!calcInput) return null;
    const inputNum = parseFloat(calcInput);
    if (isNaN(inputNum)) return null;

    const subjectKey = colToInterpKey[calcSubject];
    if (!subjectKey) return null;

    const cleanNum = (s: string) => {
      if (!s) return 0;
      // Remove thousand separators (dot followed by 3 digits, or comma in some contexts)
      // Heuristic: if a dot/comma is followed by 3 digits, it's a separator
      let res = s.replace(/[\.,](\d{3})(?![0-9])/g, '$1');
      // Normalize remaining comma to dot for decimal
      res = res.replace(',', '.');
      // Extract first number found (handle negative if needed, but here mostly positive)
      const match = res.match(/[\d\.]+/);
      return match ? parseFloat(match[0]) : 0;
    };

    // Check if the key is numeric in INTERPOLATION_DATA
    const isNumeric = typeof INTERPOLATION_DATA[0][subjectKey] === 'number';
    if (!isNumeric) return null;

    const sorted = [...INTERPOLATION_DATA].sort((a, b) => (a[subjectKey] as number) - (b[subjectKey] as number));
    
    let lower = sorted[0];
    let upper = sorted[sorted.length - 1];

    if (inputNum <= (lower[subjectKey] as number)) {
      upper = sorted[1];
    } else if (inputNum >= (upper[subjectKey] as number)) {
      lower = sorted[sorted.length - 2];
    } else {
      for (let i = 0; i < sorted.length - 1; i++) {
        if (inputNum >= (sorted[i][subjectKey] as number) && inputNum <= (sorted[i+1][subjectKey] as number)) {
          lower = sorted[i];
          upper = sorted[i+1];
          break;
        }
      }
    }

    const lVal = lower[subjectKey] as number;
    const uVal = upper[subjectKey] as number;
    
    // Avoid division by zero
    const t_factor = uVal === lVal ? 0 : (inputNum - lVal) / (uVal - lVal);

    const result: any = { _t: t_factor, _lower: lower, _upper: upper };
    
    const romanToNum: Record<string, number> = { 'V': 5, 'IV': 4, 'III': 3, 'II': 2, 'I': 1 };
    const numToRoman = ['?', 'I', 'II', 'III', 'IV', 'V'];

    (Object.keys(lower) as Array<keyof InterpolationPoint>).forEach(key => {
      const l = lower[key];
      const u = upper[key];
      
      if (typeof l === 'number' && typeof u === 'number') {
        const interpolated = l + t_factor * (u - l);
        // Round to nearest integer for these specific keys
        if (['rank', 'comp', 'jam', 'benar', 'iq', 'pp', 'elo', 'sat', 'irt', 'sel'].includes(key)) {
          result[key] = Math.round(interpolated);
        } else {
          result[key] = Number(interpolated.toFixed(2));
        }
      } else if (typeof l === 'string' && typeof u === 'string') {
        // Handle ranges like "Name (X-Y)" or "Name (X-Y★)"
        // Updated regex to include A-Z for Roman Numerals
        const rangeMatch = l.match(/(.+)\s+\((?:[><])?([A-Z\d,.]+)(?:-([A-Z\d,.]+))?(★)?\)/);
        
        if (rangeMatch && rangeMatch[3]) {
          const name = rangeMatch[1];
          const startStr = rangeMatch[2];
          const endStr = rangeMatch[3];
          const unit = rangeMatch[4] || '';
          
          const startNum = cleanNum(startStr);
          const endNum = cleanNum(endStr);

          if (!isNaN(startNum)) {
            const current = startNum + t_factor * (endNum - startNum);
            
            if (key === 'mlbb') {
              // Convert to Roman for Warrior-Legend
              const mlbbRankNames = ['Warrior', 'Elite', 'Master', 'Grandmaster', 'Epic', 'Legend'];
              const isRomanRank = mlbbRankNames.some(r => name.includes(r));
              
              if (isRomanRank) {
                const startTier = romanToNum[startStr] || 0;
                const endTier = romanToNum[endStr] || 0;
                if (startTier && endTier) {
                  const currentTierIdx = Math.round(startTier + t_factor * (endTier - startTier));
                  result[key] = `${name} ${numToRoman[currentTierIdx] || startStr}`;
                } else {
                  // Fallback if no subdivisions found in string
                  result[key] = t_factor < 1.0 ? l : u;
                }
              } else {
                result[key] = `${name} (${Math.round(current).toLocaleString('en-US')}★)`;
              }
            } else if (key === 'gd') {
              // User requested no decimals for GD difficulty
              result[key] = `${name} ${Math.round(current)}★`;
            } else {
              result[key] = `${name} ${Math.round(current)}${unit}`;
            }
          } else {
            // Handle Roman numeral ranges like (V-I) or (III-I)
            const startTier = romanToNum[startStr];
            const endTier = romanToNum[endStr];
            if (startTier && endTier) {
              const currentTierIdx = Math.round(startTier + t_factor * (endTier - startTier));
              result[key] = `${name} ${numToRoman[currentTierIdx] || startStr}`;
            } else {
              result[key] = t_factor < 1.0 ? l : u;
            }
          }
        } else {
          // Fallback: Check if names match between l and u and they are star-based
          const starMatchL = l.match(/(.+)\s+\((?:[><])?([\d,.]+)(?:-([\d,.]+))?★\)/);
          const starMatchU = u.match(/(.+)\s+\((?:[><])?([\d,.]+)(?:-([\d,.]+))?★\)/);

          if (starMatchL && starMatchU && starMatchL[1] === starMatchU[1]) {
            const start = cleanNum(starMatchL[3] || starMatchL[2]);
            const end = cleanNum(starMatchU[3] || starMatchU[2]);
            const currentStars = Math.round(start + t_factor * (end - start));
            result[key] = `${starMatchL[1]} (${currentStars.toLocaleString('en-US')}★)`;
          } else {
            // General text fields: pick lower label until next point reached
            result[key] = t_factor < 1.0 ? l : u;
          }
        }
      }
    });

    return result;
  }, [calcInput, calcSubject, colToInterpKey]);

  const activeTierVisual = useMemo(() => {
    if (!interpolationResult) return null;
    const benar = interpolationResult.benar;
    
    let tierId = "<2";
    if (benar >= 150) tierId = "150-160";
    else if (benar >= 140) tierId = "140–149";
    else if (benar >= 130) tierId = "130–139";
    else if (benar >= 120) tierId = "120–129";
    else if (benar >= 110) tierId = "110–119";
    else if (benar >= 100) tierId = "100–109";
    else if (benar >= 90) tierId = "90–99";
    else if (benar >= 80) tierId = "80–89";
    else if (benar >= 70) tierId = "70–79";
    else if (benar >= 60) tierId = "60–69";
    else if (benar >= 50) tierId = "50–59";
    else if (benar >= 40) tierId = "40–49";
    else if (benar >= 2) tierId = "2–39";
    
    return TIER_VISUAL_DATA[tierId] || null;
  }, [interpolationResult]);

  const activeColumns = columns.filter(col => visibleColumns.has(col.key));

  const formatValue = (val: any, colKey: string) => {
    if (colKey === 'mlbb' || colKey === 'rankSNBT') {
      if (typeof val === 'string') {
        if (language === 'en') {
          let translated = val;
          if (translated.includes('Zona Manusia')) {
            translated = translated.replace('Zona Manusia', t.zones.humanZone || 'Human Zone');
          }
          return translated;
        }
      }
    }

    if (typeof val === 'number') {
      const formatted = val.toLocaleString('en-US');
      if (colKey === 'percentile' || colKey === 'pct') return `${formatted}%`;
      if (colKey === 'posisiNasional' || colKey === 'rank') return `#${formatted}`;
      if (colKey === 'osuStar' || colKey === 'star') return `${formatted}★`;
      if (colKey === 'playHour' || colKey === 'jam') return `${formatted}h`;
      if (colKey === 'keketatan' || colKey === 'sel') {
        return `1:${formatted}`;
      }
      return formatted;
    }
    return val;
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 90, bottom: 100 }
    };

    const isXNumeric = xAxisMetric !== 'Rank MLBB';
    const activeYLabels = Array.from(yAxisMetrics);
    const yAxisLabelText = activeYLabels.length > 2 
      ? "Selected Metrics" 
      : activeYLabels.join(', ');

    const getOriginalValue = (item: any, label: string) => {
      const col = columns.find(c => c.label === label);
      if (col && item._row) return item._row[col.key];
      return item[label];
    };

    const isRankSNBT = activeYLabels.length === 1 && activeYLabels[0] === t.cols.posisiNasional;

    const getYAxisProps = () => {
      const props: any = {
        tick: { fontSize: 10, fill: '#94a3b8' },
        unit: isNormalized ? '%' : '',
        label: { value: yAxisLabelText, angle: -90, position: 'insideLeft', offset: -70, fontSize: 10, fontWeight: 800, fill: '#94a3b8' }
      };

      if (isNormalized) {
        props.domain = [0, 100];
      } else if (activeYLabels.length === 1) {
        const label = activeYLabels[0];
        if (label === t.cols.skorIRT) props.domain = [0, 850];
        else if (label === t.cols.jumlahBenar) props.domain = [0, 160];
        else if (label === t.cols.percentile) props.domain = [0, 100];
        else if (label === t.cols.sat) props.domain = [400, 1600];
        else if (label === t.cols.iq) props.domain = [40, 160];
        else if (label === t.cols.playHour) props.domain = [0, 'auto'];
        else if (label === t.cols.posisiNasional) {
          props.domain = [0, 'auto'];
          props.reversed = false;
        }
        else if (label === t.cols.keketatan) props.domain = [0, 150];
      }
      return props;
    };

    if (chartType === 'scatter') {
      const scatterY = (activeYLabels[0] || 'IRT SNBT') as string;
      const yAxisProps = getYAxisProps();
      
      return (
        <ScatterChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            type={"category"} 
            dataKey={xAxisMetric as any} 
            name={xAxisMetric} 
            unit={isNormalized ? '%' : ''} 
            label={{ value: xAxisMetric, position: 'insideBottom', offset: -80, fontSize: 12, fill: '#64748b', fontWeight: 800 }} 
            tick={{ fontSize: 10, fill: '#94a3b8' }}
          />
          <YAxis 
            {...yAxisProps}
            type="number" 
            dataKey={scatterY as any} 
            name={scatterY} 
            label={{ value: scatterY, angle: -90, position: 'insideLeft', offset: -70, fontSize: 12, fill: '#64748b', fontWeight: 800 }} 
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }} 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as any;
                return (
                  <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100">
                    <p className="font-black text-slate-800 border-b pb-1 mb-2 text-xs">{item.name}</p>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">
                      {xAxisMetric}: {isXNumeric ? getOriginalValue(item, xAxisMetric) : item[xAxisMetric]}
                    </p>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">
                      {scatterY}: {getOriginalValue(item, scatterY)}
                    </p>
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
      type={"category"}
      angle={-45} 
      textAnchor="end" 
      interval={0} 
      height={100} 
      tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} 
      label={{ value: xAxisMetric, position: 'insideBottom', offset: -25, fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
    />;

    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 min-w-[150px]">
            <p className="font-black text-slate-800 border-b pb-1 mb-2 text-xs">{label}</p>
            {payload.map((p: any, i: number) => (
              <p key={i} className="text-[10px] font-bold uppercase tracking-tight mb-1" style={{ color: p.color }}>
                {p.name}: {getOriginalValue(p.payload, p.name)}
              </p>
            ))}
          </div>
        );
      }
      return null;
    };

    if (chartType === 'bar') {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          {XComponent}
          <YAxis {...getYAxisProps()} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
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
          <YAxis {...getYAxisProps()} />
          <Tooltip content={<CustomTooltip />} />
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
        <YAxis {...getYAxisProps()} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ paddingTop: '40px' }} />
        {activeYLabels.map((label, index) => (
          <Area key={label} type="monotone" dataKey={label as any} stackId="1" stroke={`hsl(${210 + (index * 35)}, 75%, 55%)`} fill={`hsl(${210 + (index * 35)}, 75%, 55%)`} fillOpacity={0.6} />
        ))}
      </AreaChart>
    );
  };

  // Decorative SVG Patterns for Backgrounds
  const DecorativeSVGBackground = ({ b, hex }: { b: number; hex: string }) => {
    const isUnderground = b < 80;
    const isGround = b >= 80 && b < 90;
    const isSkies = b >= 90 && b < 130;
    const isSpace = b >= 130;

    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-80 mix-blend-plus-lighter">
          {/* UNDERGROUND: Topsoil, Bedrock, Lithosphere, Mantle, Core */}
          {isUnderground && (
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
              <rect width="1000" height="1000" fill="url(#undergroundGrad)" />
              <defs>
                <linearGradient id="undergroundGrad" x1="0" y1="0" x2="0" y2="1">
                  {/* Dynamic coloring based on depth */}
                  <stop offset="0%" stopColor={b >= 70 ? "#3d2b1f" : (b >= 40 ? "#1a1a1e" : "#120300")} />
                  <stop offset="100%" stopColor={b < 40 ? "#4D0000" : "#0d0d0d"} />
                </linearGradient>
              </defs>
              
              {/* TOP SOIL Layer (70-79): Roots, Humus, Fossils */}
              {b >= 70 && (
                <g>
                  {/* Tree Roots */}
                  <path d="M500,0 C520,300 480,600 500,1000" stroke="#4a3525" strokeWidth="2" fill="none" opacity="0.4" />
                  <path d="M200,0 C250,400 150,700 300,1000" stroke="#4a3525" strokeWidth="1" fill="none" opacity="0.3" />
                  <path d="M800,0 C750,300 850,600 700,1000" stroke="#4a3525" strokeWidth="1.5" fill="none" opacity="0.3" />
                  
                  {/* Fossils */}
                  {[...Array(6)].map((_, i) => (
                    <g key={`fossil-${i}`} opacity="0.25" transform={`translate(${150 + (i * 140) % 700}, ${100 + (i * 150) % 600}) rotate(${i * 45}) scale(${0.7 + Math.random() * 0.4})`}>
                      <path d="M0,0 L25,0" stroke="#fdf5e6" strokeWidth="4" strokeLinecap="round" />
                      <circle cx="0" cy="-2" r="4" fill="#fdf5e6" />
                      <circle cx="0" cy="2" r="4" fill="#fdf5e6" />
                      <circle cx="25" cy="-2" r="4" fill="#fdf5e6" />
                      <circle cx="25" cy="2" r="4" fill="#fdf5e6" />
                    </g>
                  ))}
                  
                  {/* Soil Texture */}
                  {[...Array(40)].map((_, i) => (
                    <circle key={`soil-${i}`} cx={Math.random() * 1000} cy={Math.random() * 1000} r={Math.random() * 2 + 1} fill="#3d2b1f" opacity="0.3" />
                  ))}
                </g>
              )}

              {/* BEDROCK & GUA Layer (60-69): Rock Walls, Giant Fossils */}
              {b >= 60 && b < 70 && (
                <g opacity="0.4">
                  <path d="M0,300 L1000,320 M500,0 L520,1000" stroke="#000" strokeWidth="3" opacity="0.3" />
                  {/* Cave texture / rock sheets */}
                  {[...Array(10)].map((_, i) => (
                     <rect key={i} x={Math.random()*800} y={Math.random()*800} width={200} height={20} fill="#000" opacity="0.1" transform={`rotate(${Math.random()*20})`} />
                  ))}
                </g>
              )}

              {/* LITHOSPHERE & CRUST (40-59): Tectonic cracks, Crystals, Smoke */}
              {b >= 40 && b < 60 && (
                <g>
                   {/* Tectonic Cracks */}
                   {[...Array(5)].map((_, i) => (
                     <motion.path
                        key={`crack-${i}`}
                        d={`M${200 * i},0 L${250 * i + 50},500 L${200 * i},1000`}
                        stroke={b < 50 ? "#FF3300" : "#FF5500"}
                        strokeWidth="1.5"
                        fill="none"
                        opacity="0.2"
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ repeat: Infinity, duration: 4 + i }}
                     />
                   ))}
                   {/* Sulfur Smoke / Thermal Vents */}
                   {[...Array(15)].map((_, i) => (
                     <motion.circle
                        key={`smoke-${i}`}
                        cx={200 + Math.random() * 600}
                        cy={1000}
                        r={20 + Math.random() * 40}
                        fill={b < 50 ? "#4a1c00" : "#4a3b00"}
                        initial={{ y: 1000, opacity: 0 }}
                        animate={{ y: -200, opacity: [0, 0.2, 0] }}
                        transition={{ repeat: Infinity, duration: 8 + Math.random() * 5, delay: i * 0.5 }}
                     />
                   ))}
                   {/* Glowing Crystals (40-49 focus) */}
                   {b < 50 && [...Array(12)].map((_, i) => (
                    <motion.path
                      key={`crystal-${i}`}
                      d={`M${Math.random() * 800 + 100},${Math.random() * 800 + 100} l10,-20 l10,20 z`}
                      fill="#FF3300"
                      opacity="0.3"
                      animate={{ opacity: [0.2, 0.7, 0.2], scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 + Math.random() * 3 }}
                    />
                  ))}
                </g>
              )}

              {/* MANTLE & CORE (<40): Lava, Magma Lake, Black Heat */}
              {b < 40 && (
                <g>
                  {/* Lava Streams */}
                  {[...Array(8)].map((_, i) => (
                    <motion.path
                      key={`lava-${i}`}
                      d={`M${150 * i},0 C${150*i + 100},300 ${150*i - 100},700 ${150 * i},1000`}
                      stroke="#FF4D00"
                      strokeWidth={b < 2 ? "12" : "4"}
                      fill="none"
                      opacity="0.4"
                      animate={{ strokeWidth: [4, 8, 4], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ repeat: Infinity, duration: 3 + i }}
                    />
                  ))}
                  {/* Magma Bubbles */}
                  {[...Array(25)].map((_, i) => (
                    <motion.circle
                      key={`bubble-${i}`}
                      cx={Math.random() * 1000}
                      cy={1000}
                      r={Math.random() * 15 + 5}
                      fill="#FF9900"
                      initial={{ y: 1000, opacity: 0 }}
                      animate={{ y: -200, opacity: [0, 0.6, 0], scale: [0.5, 1.5, 0.8] }}
                      transition={{ repeat: Infinity, duration: 5 + Math.random() * 4, delay: i * 0.3 }}
                    />
                  ))}
                  {/* Black Smoke for Core */}
                  {b < 2 && [...Array(20)].map((_, i) => (
                    <motion.circle
                       key={`black-smoke-${i}`}
                       cx={Math.random() * 1000}
                       cy={Math.random() * 1000}
                       r={50 + Math.random() * 50}
                       fill="#000000"
                       opacity="0.4"
                       animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                       transition={{ repeat: Infinity, duration: 6 + Math.random() * 4 }}
                    />
                  ))}
                </g>
              )}
            </svg>
          )}

          {/* GROUND LEVEL (80-82): Grass, Power Poles, Azure Sky, Campus Silhouette */}
          {isGround && (
            <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice">
              <defs>
                <linearGradient id="sunsetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0EA5E9" />
                  <stop offset="100%" stopColor="#e0f2fe" />
                </linearGradient>
              </defs>
              <rect width="1000" height="600" fill="url(#sunsetGrad)" opacity="0.6" />

              {/* Distant Campus Silhouette (Simplified Unnes) */}
              <g transform="translate(0, 100)" opacity="0.3">
                <path d="M0,500 L200,500 L250,300 L300,500 L500,500 L550,200 L600,500 L1000,500 L1000,600 L0,600 Z" fill="#1a1a1a" />
                <rect x="535" y="150" width="30" height="100" fill="#1a1a1a" /> {/* Central Tower idea */}
              </g>
              
              {/* Power Poles / Tiang Listrik */}
              {[150, 450, 750].map((x, i) => (
                <g key={`pole-${i}`} transform={`translate(${x}, 350)`}>
                   <rect x="-3" y="0" width="6" height="250" fill="#111" />
                   <rect x="-40" y="20" width="80" height="4" fill="#111" />
                   <circle cx="-35" cy="18" r="3" fill="#222" />
                   <circle cx="35" cy="18" r="3" fill="#222" />
                   {/* Wires */}
                   <path d="M-35,18 Q-150,50 -300,20" stroke="#111" strokeWidth="0.5" fill="none" />
                   <path d="M35,18 Q150,50 300,20" stroke="#111" strokeWidth="0.5" fill="none" />
                </g>
              ))}

              {/* Foreground Grass Field */}
              <path d="M0,600 Q200,560 500,590 T1000,570 L1000,600 L0,600 Z" fill="#2e5a44" opacity="0.9" />
              
              {/* Human Elements: Unnes specific or just props */}
              <g transform="translate(850, 560)" opacity="0.8">
                 <rect x="-10" y="0" width="20" height="40" fill="#333" /> {/* simplified coffee/phone context? maybe not */}
              </g>
            </svg>
          )}

          {/* SKIES (90-129): Troposphere, Stratosphere, Mesosphere, Thermosphere */}
          {isSkies && (
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="skyAtmosphere" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={b >= 120 ? "#001433" : (b >= 110 ? "#001c4e" : (b >= 100 ? "#1a3b70" : "#3a7ca5"))} />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <rect width="1000" height="1000" fill="url(#skyAtmosphere)" />
              
              {/* TROPOSPHERE (90-99): Azure Sky, Eagles, Clouds */}
              {b < 100 && (
                <g>
                  {/* Fluffy Cumulus Clouds */}
                  {[...Array(8)].map((_, i) => (
                    <motion.g
                      key={`cumulus-${i}`}
                      initial={{ x: Math.random() * 1200 - 200, y: 50 + i * 110 }}
                      animate={{ x: 1200 }}
                      transition={{ repeat: Infinity, duration: 40 + i * 15, ease: "linear" }}
                      className="opacity-40"
                    >
                      <circle cx="50" cy="50" r="40" fill="white" />
                      <circle cx="85" cy="55" r="35" fill="white" />
                      <circle cx="25" cy="55" r="35" fill="white" />
                      <circle cx="55" cy="25" r="30" fill="white" />
                    </motion.g>
                  ))}
                  
                  {/* Eagles */}
                  {[...Array(8)].map((_, i) => (
                    <motion.path
                      key={`eagle-${i}`}
                      d="M0,0 L15,10 L30,0"
                      stroke="#222"
                      strokeWidth="2.5"
                      fill="none"
                      initial={{ x: Math.random() * 1200 - 100, y: 200 + i * 100 }}
                      animate={{ x: -100, y: [200+i*100, 240+i*100, 200+i*100] }}
                      transition={{ repeat: Infinity, duration: 15 + i*2, ease: "linear" }}
                    />
                  ))}
                </g>
              )}

              {/* STRATOSPHERE (100-109): Clouds, Jet Fighters */}
              {b >= 100 && b < 110 && (
                <g>
                   {[...Array(15)].map((_, i) => (
                    <motion.ellipse
                      key={`cloud-${i}`}
                      cx={Math.random() * 1000}
                      cy={Math.random() * 1000}
                      rx={100 + Math.random() * 100}
                      ry={40 + Math.random() * 40}
                      fill="white"
                      opacity="0.6"
                      animate={{ x: [0, 50, 0] }}
                      transition={{ repeat: Infinity, duration: 20 + i*2 }}
                    />
                  ))}
                  {/* Jet Fighters */}
                  <motion.path
                    d="M0,0 L40,10 L0,20 Z"
                    fill="#555"
                    initial={{ x: -100, y: 400 }}
                    animate={{ x: 1200 }}
                    transition={{ repeat: Infinity, duration: 3, delay: 5 }}
                  />
                </g>
              )}

              {/* MESOSPHERE (110-119): Meteor Streaks, Burning */}
              {b >= 110 && b < 120 && (
                 <g>
                    {[...Array(8)].map((_, i) => (
                      <motion.line
                        key={`meteor-${i}`}
                        x1="1000" y1={Math.random() * 500}
                        x2="800" y2={Math.random() * 500 + 200}
                        stroke="#FFD700"
                        strokeWidth="2"
                        initial={{ opacity: 0, pathLength: 0 }}
                        animate={{ opacity: [0, 1, 0], pathLength: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1 + Math.random(), delay: i * 2 }}
                      />
                    ))}
                 </g>
              )}

              {/* THERMOSPHERE (120-129): ISS, Aurora */}
              {b >= 120 && (
                <g>
                  {/* Aurora Waves */}
                  {[...Array(3)].map((_, i) => (
                    <motion.path
                      key={`aurora-${i}`}
                      d="M0,300 Q250,100 500,300 T1000,300"
                      stroke="#00FF66"
                      strokeWidth="100"
                      fill="none"
                      opacity="0.1"
                      animate={{ opacity: [0.05, 0.2, 0.05], d: ["M0,300 Q250,100 500,300 T1000,300", "M0,350 Q250,150 500,350 T1000,350"] }}
                      transition={{ repeat: Infinity, duration: 5 + i, alternate: true }}
                    />
                  ))}
                  {/* ISS Silhouette */}
                  <motion.g animate={{ x: [1100, -200], y: [200, 250] }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }}>
                    <rect width="60" height="20" fill="#888" />
                    <rect x="25" y="-30" width="10" height="80" fill="#555" />
                    <rect x="10" y="-30" width="40" height="2" fill="#333" />
                  </motion.g>
                </g>
              )}
            </svg>
          )}

          {/* SPACE (130-160): Exosphere, Solar Belt, Deep Space */}
          {isSpace && (
             <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                <rect width="1000" height="1000" fill="#050510" />
                
                {/* STARS Background */}
                {[...Array(100)].map((_, i) => (
                  <circle key={i} cx={Math.random()*1000} cy={Math.random()*1000} r={Math.random()*1.5} fill="white" opacity={Math.random()*0.8} />
                ))}

                {/* EXOSPHERE (130-139): Earth Curve, Micrometeoroids */}
                {b < 140 && (
                  <g>
                    <circle cx="500" cy="1500" r="1000" fill="#003366" opacity="0.4" /> {/* Earth edge */}
                    <circle cx="500" cy="1500" r="1010" fill="none" stroke="#00F0FF" strokeWidth="5" opacity="0.2" /> {/* Ionization line */}
                    {/* Micrometeoroids */}
                    {[...Array(10)].map((_, i) => (
                      <motion.circle
                        key={`m-meteor-${i}`}
                        cx={Math.random()*1000}
                        cy={Math.random()*1000}
                        r="1"
                        fill="white"
                        animate={{ x: [0, -50], y: [0, 100], opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 2 + Math.random()*3, delay: i*0.2 }}
                      />
                    ))}
                  </g>
                )}

                {/* SOLAR BELT (140-149): Saturn, Comets */}
                {b >= 140 && b < 150 && (
                  <g transform="translate(700, 200)">
                    {/* Saturn */}
                    <circle r="60" fill="#f0e68c" />
                    <ellipse rx="150" ry="20" fill="none" stroke="#f0e68c" strokeWidth="4" opacity="0.4" transform="rotate(-20)" />
                    {/* Comets */}
                    {[...Array(2)].map((_, i) => (
                      <motion.circle
                        key={`comet-${i}`}
                        r="3"
                        fill="white"
                        initial={{ x: -1000, y: 500 }}
                        animate={{ x: 1000, y: -200 }}
                        transition={{ repeat: Infinity, duration: 4, delay: i*15 }}
                      />
                    ))}
                  </g>
                )}

                {/* DEEP SPACE (150-160): Galaxy, Black Hole */}
                {b >= 150 && (
                  <g transform="translate(500, 500)">
                    {/* Spiral Galaxy idea */}
                    {[...Array(4)].map((_, i) => (
                      <motion.ellipse
                        key={`galaxy-${i}`}
                        rx={100 + i*50} ry={20 + i*10}
                        fill="none"
                        stroke={i % 2 === 0 ? "#BF00FF" : "#00F0FF"}
                        strokeWidth="2"
                        opacity="0.2"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 20 + i*10, ease: "linear" }}
                      />
                    ))}
                    {/* Black Hole center */}
                    <circle r="30" fill="black" />
                    <circle r="35" fill="none" stroke="#00F0FF" strokeWidth="2" opacity="0.3">
                       <animate attributeName="r" values="35;45;35" dur="3s" repeatCount="indefinite" />
                    </circle>
                  </g>
                )}
             </svg>
          )}
        </div>
      </div>
    );
  };

  const AstronautVisual = ({ tierId, hex }: { tierId: string; hex: string }) => {
    return (
      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 0.9 }}
        className="absolute bottom-20 right-[5%] lg:right-[15%] z-0 pointer-events-none select-none hidden md:block"
      >
        <svg width="300" height="400" viewBox="0 0 100 130" className="drop-shadow-2xl">
          <defs>
            <radialGradient id="visorReflect" cx="30%" cy="30%">
              <stop offset="0%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="black" />
            </radialGradient>
          </defs>
          
          {/* Life Support Pack */}
          <rect x="22" y="45" width="20" height="50" rx="4" fill={hex} opacity="0.6" />
          <path d="M42,50 L58,50" stroke="white" strokeWidth="2" opacity="0.2" />

          {/* Suit Base */}
          <rect x="30" y="40" width="40" height="65" rx="12" fill={hex} opacity="0.3" stroke={hex} strokeWidth="1" />
          <path d="M30,70 L70,70" stroke={hex} strokeWidth="0.5" opacity="0.3" />
          
          {/* Boots */}
          <rect x="32" y="105" width="15" height="8" rx="2" fill={hex} opacity="0.5" />
          <rect x="53" y="105" width="15" height="8" rx="2" fill={hex} opacity="0.5" />

          {/* Helmet Architecture */}
          <circle cx="50" cy="30" r="22" fill={hex} opacity="0.1" stroke={hex} strokeWidth="1" />
          <circle cx="50" cy="30" r="18" fill="url(#visorReflect)" stroke="white" strokeWidth="0.5" opacity="0.8" />
          
          {/* HUD Reflection on Visor */}
          <rect x="42" y="25" width="4" height="1" fill={hex} opacity="0.8">
             <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
          </rect>

          {/* Equipment Labels */}
          <motion.g animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 4 }}>
             <rect x="40" y="55" width="20" height="2" rx="1" fill="white" opacity="0.2" />
             <rect x="40" y="60" width="12" height="2" rx="1" fill="white" opacity="0.2" />
          </motion.g>

          {/* Status Bezel */}
          <motion.circle 
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }} 
            transition={{ repeat: Infinity, duration: 1.5 }}
            cx="38" cy="85" r="2" fill="#00ff00" 
          />
        </svg>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen relative font-sans overflow-x-hidden transition-colors duration-1000" style={{ backgroundColor: activeTierVisual?.ui.dominantColor || '#f8fafc' }}>
      
      {/* IMMERSIVE FULL-SCREEN BACKGROUND LAYER */}
      <AnimatePresence mode="wait">
        {activeTierVisual && (
          <motion.div 
            key={activeTierVisual.tierId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-0 pointer-events-none"
          >
            {/* Base Gradient */}
            <div 
              className="absolute inset-0 transition-colors duration-1000" 
              style={{ 
                background: `radial-gradient(circle at center, ${activeTierVisual.ui.hexCode}22 0%, ${activeTierVisual.ui.dominantColor} 100%)` 
              }} 
            />
            
            {/* SVG Illustration Background */}
            <DecorativeSVGBackground b={interpolationResult.benar} hex={activeTierVisual.ui.hexCode} />
            
            {/* Integrated Astronaut Character Visual */}
            <AstronautVisual tierId={activeTierVisual.tierId} hex={activeTierVisual.ui.hexCode} />
            
            {/* Animated Environmental Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div 
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.4 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute inset-0 mix-blend-screen"
                style={{ background: `radial-gradient(circle at 70% 30%, ${activeTierVisual.ui.hexCode}44, transparent 50%)` }}
              />
              
              {/* Floating Motes / Dust / Energy */}
              <div className="absolute inset-0 opacity-30">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: Math.random() * 100 + "%", x: Math.random() * 100 + "%" }}
                    animate={{ 
                      y: [null, (Math.random() - 0.5) * 50 + "%"],
                      x: [null, (Math.random() - 0.5) * 50 + "%"],
                      opacity: [0.1, 0.5, 0.1]
                    }}
                    transition={{ repeat: Infinity, duration: 5 + Math.random() * 10, ease: "linear" }}
                    className="absolute w-1 h-1 rounded-full"
                    style={{ backgroundColor: activeTierVisual.ui.hexCode }}
                  />
                ))}
              </div>

              {/* Tier Specific Overlays (Heat Distortion, Scanlines) */}
              {activeTierVisual.tierId === "<2" || activeTierVisual.tierId.includes("39") ? (
                <div className="absolute inset-0 bg-red-900/10 backdrop-blur-[1px] animate-pulse" />
              ) : null}
              
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
            </div>

            {/* Astronaut Ghost Overlay (Visual metaphor) */}
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 0.15 }}
              className="absolute -right-20 bottom-0 select-none pointer-events-none"
            >
              <Rocket className="w-[600px] h-[600px] rotate-45 text-white blur-3xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <header className={`mb-12 text-center border-b pb-8 transition-colors duration-500 ${activeTierVisual ? 'border-white/10' : 'border-slate-200'}`}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className={`text-4xl md:text-5xl font-black tracking-tighter mb-4 inline-flex items-center gap-3 uppercase transition-colors duration-500 ${activeTierVisual ? 'text-white' : 'text-slate-900'}`}>
                <Trophy className={`w-10 h-10 ${activeTierVisual ? '' : 'text-blue-600'}`} style={{ color: activeTierVisual?.ui.hexCode }} />
                {t.title}
              </h1>
              <p className={`text-lg font-medium max-w-2xl mx-auto transition-colors duration-500 ${activeTierVisual ? 'text-white/60' : 'text-slate-500'}`}>
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
              <div className={`flex items-center gap-1 p-1 rounded-2xl border shadow-sm transition-all duration-500 ${activeTierVisual ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200'}`}>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === 'table' ? (activeTierVisual ? 'bg-white text-black' : 'bg-blue-600 text-white shadow-lg shadow-blue-200') : (activeTierVisual ? 'text-white/60 hover:text-white' : 'text-slate-600 hover:bg-slate-50')}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  {t.table}
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === 'chart' ? (activeTierVisual ? 'bg-white text-black' : 'bg-blue-600 text-white shadow-lg shadow-blue-200') : (activeTierVisual ? 'text-white/60 hover:text-white' : 'text-slate-600 hover:bg-slate-50')}`}
                >
                  <BarChart3 className="w-4 h-4" />
                  {t.chart}
                </button>
                <button
                  onClick={() => setViewMode('calculator')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === 'calculator' ? (activeTierVisual ? 'bg-white text-black' : 'bg-blue-600 text-white shadow-lg shadow-blue-200') : (activeTierVisual ? 'text-white/60 hover:text-white' : 'text-slate-600 hover:bg-slate-50')}`}
                >
                  <Target className="w-4 h-4" />
                  {t.calculator}
                </button>
              </div>

              {/* Chart Options */}
              {viewMode === 'chart' && (
                <div className="flex flex-wrap items-center gap-2">
                  <div className={`flex items-center gap-1 p-1 rounded-2xl border shadow-sm transition-all duration-500 ${activeTierVisual ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200'}`}>
                    {[
                      { type: 'bar', icon: <BarChart3 className="w-4 h-4" /> },
                      { type: 'line', icon: <LineChartIcon className="w-4 h-4" /> },
                      { type: 'area', icon: <AreaChartIcon className="w-4 h-4" /> },
                      { type: 'scatter', icon: <Share2 className="w-4 h-4 rotate-90" /> }
                    ].map(t_icon => (
                      <button
                        key={t_icon.type}
                        onClick={() => setChartType(t_icon.type as ChartType)}
                        className={`p-2 rounded-xl transition-all ${chartType === t_icon.type ? (activeTierVisual ? 'bg-white text-black' : 'bg-slate-900 text-white') : (activeTierVisual ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:bg-slate-50')}`}
                        title={`${t_icon.type.charAt(0).toUpperCase()}${t_icon.type.slice(1)} Chart`}
                      >
                        {t_icon.icon}
                      </button>
                    ))}
                    <div className="w-[1px] h-4 bg-slate-200 mx-1 opacity-20" />
                    <button
                      onClick={() => setIsNormalized(!isNormalized)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${isNormalized ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : (activeTierVisual ? 'text-white/50 hover:text-white' : 'text-slate-500 hover:bg-slate-50')}`}
                      title={isNormalized ? "Disable Normalization" : "Normalize different scales"}
                    >
                      {isNormalized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                      {isNormalized ? t.fixed : t.normalized}
                    </button>
                  </div>

                  {/* RESTORED: Axis Selectors for Chart View (X and Y Axis) */}
                  <div className={`flex flex-wrap items-center gap-2 p-1 rounded-2xl border shadow-sm transition-all duration-500 ${activeTierVisual ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center gap-2 px-3">
                      <span className={`text-[10px] font-black uppercase tracking-tighter ${activeTierVisual ? 'text-white/30' : 'text-slate-400'}`}>X:</span>
                      <select 
                        value={xAxisMetric}
                        onChange={(e) => setXAxisMetric(e.target.value)}
                        className={`text-xs font-bold bg-transparent border-none outline-none cursor-pointer transition-colors max-w-[80px] truncate ${activeTierVisual ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                      >
                        <option value="Rank MLBB">Rank MLBB</option>
                        {chartableMetrics.map(m => <option key={m.label} value={m.label} className="bg-slate-900 text-white">{m.label}</option>)}
                      </select>
                    </div>
                    <div className="w-[1px] h-4 bg-white/10" />
                    <div className="flex items-center gap-2 px-3 overflow-x-auto no-scrollbar max-w-[280px]">
                      <span className={`text-[10px] font-black uppercase tracking-tighter ${activeTierVisual ? 'text-white/30' : 'text-slate-400'}`}>Y:</span>
                      <div className="flex items-center gap-1">
                        {chartableMetrics.map(m => (
                          <button
                            key={m.label}
                            onClick={() => toggleYMetric(m.label)}
                            className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase transition-all border whitespace-nowrap ${yAxisMetrics.has(m.label) ? (activeTierVisual ? 'bg-white border-white text-black' : 'bg-blue-600 border-blue-600 text-white shadow-sm') : (activeTierVisual ? 'bg-white/5 border-white/5 text-white/30 hover:border-white/20' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300')}`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

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
            className={`rounded-3xl shadow-2xl border overflow-hidden backdrop-blur-xl transition-all duration-500 ${activeTierVisual ? 'bg-black/40 border-white/10 shadow-black/40' : 'bg-white border-slate-100'}`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b transition-colors duration-500 ${activeTierVisual ? 'bg-white/10 border-white/10' : 'bg-slate-50/50 border-slate-100'}`}>
                    {activeColumns.map((col) => (
                      <th 
                        key={col.key}
                        className={`px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap cursor-pointer transition-colors duration-300 ${activeTierVisual ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-blue-600'}`}
                        onClick={() => {
                          if (sortField === col.key) setIsSortedAsc(!isSortedAsc);
                          else { setSortField(col.key); setIsSortedAsc(true); }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span style={activeTierVisual ? { color: activeTierVisual.ui.hexCode } : {}}>{col.icon}</span>
                          <span>{col.label}</span>
                          {sortField === col.key && (isSortedAsc ? <ChevronUp className="w-3" /> : <ChevronDown className="w-3" />)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y transition-colors duration-500 ${activeTierVisual ? 'divide-white/5' : 'divide-slate-50'}`}>
                  {filteredData.map((row, idx) => (
                    <motion.tr key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.01 }} className={`transition-all group ${activeTierVisual ? 'hover:bg-white/5' : 'hover:bg-slate-50/80'}`}>
                      {activeColumns.map((col) => (
                        <td key={`${idx}-${col.key}`} className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-500 ${activeTierVisual ? 'text-white/70' : 'text-slate-600'}`}>
                          <span className={`px-2.5 py-1 rounded-lg ${col.key === 'statusPenerimaan' && row[col.key].includes('ACCEPTED') ? (activeTierVisual ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'bg-emerald-50 text-emerald-700 font-bold') : ''} ${col.key === 'iq' && row[col.key].includes('145') ? (activeTierVisual ? 'bg-indigo-500/20 text-indigo-300 font-black' : 'bg-indigo-50 text-indigo-700 font-black') : ''}`}>
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
            className={`rounded-3xl shadow-2xl border p-6 md:p-8 min-h-[600px] flex flex-col backdrop-blur-xl transition-all duration-500 ${activeTierVisual ? 'bg-black/60 border-white/10' : 'bg-white border-slate-100'}`}
          >
            <div className="w-full h-[500px] relative">
              <div className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%" debounce={100}>
                  {renderChart()}
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className={`mt-12 p-6 rounded-2xl flex flex-col md:flex-row gap-6 md:items-center transition-colors duration-500 ${activeTierVisual ? 'bg-white/5 border border-white/10' : 'bg-slate-50'}`}>
              <div className="flex-1">
                <p className={`font-bold mb-1 text-sm flex items-center gap-2 transition-colors duration-500 ${activeTierVisual ? 'text-white' : 'text-slate-800'}`}>
                  <Brain className="w-4 h-4 text-blue-600" />
                  Comparative Insights:
                </p>
                <p className={`text-xs leading-relaxed font-medium transition-colors duration-500 ${activeTierVisual ? 'text-white/60' : 'text-slate-500'}`}>
                  {isNormalized 
                    ? "Currently in Normalized Mode: All subjects (IQ, SAT, etc.) are scaled to 0-100. This allows you to compare the relative difficulty curves of different subjects side-by-side."
                    : "Currently in Absolute Mode: Charts show raw values. Note that higher point values will dwarf smaller ones."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeColumns.filter(c => c.isChartable).map((col, i) => (
                  <div key={col.key} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl shadow-sm transition-all duration-500 ${activeTierVisual ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200'}`}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `hsl(${210 + (i * 35)}, 75%, 55%)` }} />
                    <span className={`text-[10px] font-black uppercase tracking-wider transition-colors duration-500 ${activeTierVisual ? 'text-white/70' : 'text-slate-600'}`}>{col.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-3xl shadow-2xl border overflow-hidden max-w-6xl mx-auto backdrop-blur-2xl transition-all duration-500 ${activeTierVisual ? 'bg-transparent border-transparent shadow-none' : 'bg-white border-slate-100 shadow-xl'}`}
          >
            <div className="lg:grid lg:grid-cols-12 min-h-[650px] gap-8">
              <div className={`lg:col-span-4 p-8 rounded-3xl border transition-all duration-500 ${activeTierVisual ? 'bg-black/60 border-white/10 backdrop-blur-2xl' : 'bg-slate-50/50 border-slate-100'}`}>
                <div className="mb-10">
                  <h2 className={`text-2xl font-black mb-2 uppercase tracking-tight transition-colors duration-500 ${activeTierVisual ? 'text-white' : 'text-slate-900'}`}>{t.calcTitle}</h2>
                  <p className={`text-sm font-medium transition-colors duration-500 ${activeTierVisual ? 'text-white/60' : 'text-slate-500'}`}>{t.calcSubtitle}</p>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 transition-colors duration-500 ${activeTierVisual ? 'text-white/40' : 'text-slate-400'}`}>{t.chooseSubject}</label>
                    <select 
                      value={calcSubject}
                      onChange={(e) => setCalcSubject(e.target.value)}
                      className={`w-full border rounded-2xl px-5 py-4 outline-none transition-all font-bold ${activeTierVisual ? 'bg-black/60 border-white/20 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
                    >
                      {chartableMetrics.map(m => (
                        <option key={m.label} value={m.label} className="bg-slate-900 text-white">{m.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 transition-colors duration-500 ${activeTierVisual ? 'text-white/40' : 'text-slate-400'}`}>{t.inputScore}</label>
                    <input 
                      type="number"
                      placeholder={t.scorePlaceholder}
                      value={calcInput}
                      onChange={(e) => setCalcInput(e.target.value)}
                      className={`w-full border rounded-2xl px-5 py-4 outline-none transition-all font-mono font-bold text-2xl ${activeTierVisual ? 'bg-black/60 border-white/20 text-white placeholder:text-white/20' : 'bg-white border-slate-200 text-slate-700'}`}
                    />
                  </div>
                </div>

                <div className={`mt-10 p-5 rounded-2xl border transition-all duration-500 ${activeTierVisual ? 'bg-white/5 border-white/10' : 'bg-blue-50/50 border-blue-100'}`}>
                  <p className={`text-[10px] font-bold uppercase leading-relaxed italic transition-colors duration-500 ${activeTierVisual ? 'text-white/50' : 'text-blue-600'}`}>
                    {t.calcDesc}
                  </p>
                </div>

                {interpolationResult && (
                  <PercentileBellCurve 
                    percentile={interpolationResult.pct} 
                    themeColor={activeTierVisual?.ui.hexCode || '#3b82f6'} 
                  />
                )}
              </div>

              <div className="lg:col-span-8 py-8 px-0 lg:px-4">
                {interpolationResult && activeTierVisual ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                    {/* HOLOGRAPHIC HUD HEADER */}
                    <div className="relative">
                      {/* HUD Corner Brackets (SVG) */}
                      <svg className="absolute -top-4 -left-4 w-12 h-12 opacity-40 select-none pointer-events-none" viewBox="0 0 40 40">
                        <path d="M40,2 L2,2 L2,40" fill="none" stroke={activeTierVisual.ui.hexCode} strokeWidth="1" />
                      </svg>
                      <svg className="absolute -top-4 -right-4 w-12 h-12 opacity-40 select-none pointer-events-none" viewBox="0 0 40 40">
                        <path d="M0,2 L38,2 L38,40" fill="none" stroke={activeTierVisual.ui.hexCode} strokeWidth="1" />
                      </svg>
                      <svg className="absolute -bottom-4 -left-4 w-12 h-12 opacity-40 select-none pointer-events-none" viewBox="0 0 40 40">
                        <path d="M40,38 L2,38 L2,0" fill="none" stroke={activeTierVisual.ui.hexCode} strokeWidth="1" />
                      </svg>
                      <svg className="absolute -bottom-4 -right-4 w-12 h-12 opacity-40 select-none pointer-events-none" viewBox="0 0 40 40">
                        <path d="M0,38 L38,38 L38,0" fill="none" stroke={activeTierVisual.ui.hexCode} strokeWidth="1" />
                      </svg>

                      {/* HUD Scanning Line Overlay */}
                      <motion.div 
                        animate={{ y: ['0%', '1000%'] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        className="absolute inset-x-0 h-px z-20 pointer-events-none opacity-20"
                        style={{ background: `linear-gradient(to right, transparent, ${activeTierVisual.ui.hexCode}, transparent)` }}
                      />

                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
                        <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-black/40 border border-white/20 flex items-center justify-center relative overflow-hidden group">
                           <motion.div 
                             animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                             transition={{ repeat: Infinity, duration: 4 }}
                             className="absolute inset-0"
                             style={{ backgroundColor: activeTierVisual.ui.hexCode }}
                           />
                           <Rocket className="w-10 h-10 text-white relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                             <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeTierVisual.ui.hexCode }} />
                             <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40">COORD_{activeTierVisual.tierId.replace(/[^0-9]/g, '')}</p>
                          </div>
                          <h3 className="text-5xl font-black italic tracking-tighter uppercase text-white leading-none">
                            {t.tierNames[activeTierVisual.tierId] || activeTierVisual.name}
                          </h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">
                          {(() => {
                            const b = interpolationResult.benar;
                            if (b < 80) return t.tierCategories.subterranean;
                            if (b < 90) return t.tierCategories.humanActivity;
                            if (b < 130) return t.tierCategories.atmosphere;
                            return t.tierCategories.space;
                          })()}
                        </p>
                        <p className="text-6xl font-black italic text-white leading-none tracking-tighter" style={{ textShadow: `0 0 30px ${activeTierVisual.ui.hexCode}88` }}>
                          {(() => {
                            const b = interpolationResult.benar;
                            let altitude = 0;
                            
                            if (b >= 150) {
                              altitude = 1000 + (b - 150) * 100;
                            } else if (b >= 140) {
                              altitude = 500 + (b - 140) * 50;
                            } else if (b >= 130) {
                              altitude = 100 + (b - 130) * 40;
                            } else if (b >= 120) {
                              altitude = 80 + (b - 120) * 2;
                            } else if (b >= 110) {
                              altitude = 50 + (b - 110) * 3;
                            } else if (b >= 100) {
                              altitude = 12 + (b - 100) * 3.8;
                            } else if (b >= 90) {
                              altitude = 2 + (b - 90) * 1;
                            } else if (b >= 80) {
                              altitude = (b - 80) * 0.2;
                            } else if (b >= 70) {
                              altitude = -0.1 - (80 - b) * 0.19;
                            } else if (b >= 60) {
                              altitude = -2 - (70 - b) * 0.8;
                            } else if (b >= 50) {
                              altitude = -10 - (60 - b) * 2.5;
                            } else if (b >= 40) {
                              altitude = -35 - (50 - b) * 6.5;
                            } else if (b >= 2) {
                              altitude = -100 - (40 - b) * 73.68;
                            } else {
                              altitude = -2900 - (2 - b) * 100;
                            }

                            const formatted = altitude.toLocaleString(undefined, { 
                              minimumFractionDigits: 1, 
                              maximumFractionDigits: 1 
                            });
                            return (altitude > 0 ? "+" : "") + formatted;
                          })()}
                          <span className="text-xl ml-2 text-white/40 uppercase">KM</span>
                        </p>
                      </div>
                    </div>
                  </div>

                    {/* HUD SUB-CELLS - REMOVED PER USER REQUEST */}
                    
                    {/* INTERPOLATED METRICS HUD */}
                    <div className="pt-8 border-t border-white/10">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
                        {/* Always include key metrics requested */}
                        {[
                          { key: 'benar', label: 'SNBT Correct Count' },
                          { key: 'mlbb', label: 'MLBB Rank' },
                          { key: 'irt', label: 'IRT SNBT' },
                          { key: 'rank', label: 'SNBT National Rank' },
                          { key: 'gd', label: 'GD Difficulty' },
                          { key: 'pp', label: 'osu! PP' },
                          { key: 'sel', label: 'Selectivity' },
                          { key: 'star', label: 'osu! Star' },
                          { key: 'univ', label: 'Univ/Status' },
                          { key: 'map', label: 'GD Map' },
                          { key: 'elo', label: 'Chess ELO' },
                          { key: 'sat', label: 'SAT Score' },
                          { key: 'iq', label: 'Estimated IQ' },
                          { key: 'jam', label: 'Gaming Hours' },
                          { key: 'pct', label: 'Percentile' },
                          { key: 'comp', label: 'Compound Diff' }
                        ].map((metric, idx) => {
                          const val = interpolationResult[metric.key];
                          if (val === undefined) return null;
                          return (
                            <motion.div 
                              key={metric.key}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.03 }}
                              className="group"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-1 h-3 rounded-full opacity-40" style={{ backgroundColor: activeTierVisual.ui.hexCode }} />
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] group-hover:text-white/60 transition-colors">{metric.label}</p>
                              </div>
                              <p className="text-lg sm:text-xl font-black text-white italic leading-tight break-words" style={{ textShadow: `0 0 10px ${activeTierVisual.ui.hexCode}33` }}>
                                {formatValue(val, metric.key === 'sel' ? 'sel' : metric.key)}
                              </p>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`h-full flex flex-col items-center justify-center text-center transition-colors duration-500 ${activeTierVisual ? 'text-white/40' : 'text-slate-300'}`}>
                    <Brain className={`w-16 h-16 mb-4 animate-pulse opacity-20 ${activeTierVisual ? 'text-white' : 'text-slate-900'}`} />
                    <p className="font-black text-sm uppercase tracking-[0.2em]">Scanner Offline</p>
                    <p className="text-xs font-medium max-w-[250px] mt-2 leading-relaxed opacity-50">Input your proficiency score to initialize environmental mapping and biometric alignment HUD.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <footer className={`mt-16 text-center text-sm py-8 border-t transition-colors duration-500 ${activeTierVisual ? 'text-white/20 border-white/5' : 'text-slate-400 border-slate-200'}`}>
          <p>© 2026 Worldwide Exam Comparison Tool • Cultural Reference Benchmarks</p>
        </footer>
      </div>
    </div>
  );
};
