import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';

interface PercentileBellCurveProps {
  percentile: number;
  themeColor: string;
}

export const PercentileBellCurve: React.FC<PercentileBellCurveProps> = ({ percentile, themeColor }) => {
  // Generate normal distribution data points
  // We'll use a range of -4 to 4 sigma
  const points = 200; // Increased for smoother decimal handling
  const data = [];
  const mean = 0;
  const stdDev = 1;

  for (let i = 0; i <= points; i++) {
    const x = -4 + (i / points) * 8;
    const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    
    // We'll highlight the segment by having two area series
    data.push({ 
      x, 
      y, 
      percentile: (i / points) * 100,
      highlightY: (i / points) * 100 <= percentile ? y : 0
    });
  }

  // Linear map for marker is fine for visual intent if points are even
  // Ensure targetX is always within [-4, 4] even if percentile is weird
  const targetX = Math.min(4, Math.max(-4, -4 + (percentile / 100) * 8));

  // Generate Reference lines for every 5 percentiles
  const decileLines = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95].map(p => ({
    x: -4 + (p / 100) * 8,
    label: `P${p}`
  }));

  return (
    <div className="w-full h-56 mt-6 bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 relative overflow-hidden group">
      {/* Decorative Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 rounded-full" style={{ backgroundColor: themeColor }} />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">Population Distribution</p>
          <p className="text-xs font-bold text-white/70 italic">Calculated Standing Analytics</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black italic text-white leading-none" style={{ textShadow: `0 0 15px ${themeColor}66` }}>{percentile.toFixed(2)}%</p>
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-tighter">Current Percentile</p>
        </div>
      </div>

      <div className="h-32 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={themeColor} stopOpacity={0.2} />
                <stop offset="100%" stopColor={themeColor} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="highlightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={themeColor} stopOpacity={0.8} />
                <stop offset="100%" stopColor={themeColor} stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="x" 
              type="number" 
              domain={[-4, 4]} 
              hide 
            />
            <YAxis hide />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900/90 backdrop-blur-md border border-white/20 px-3 py-2 rounded-xl shadow-2xl">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">P-{payload[0].payload.percentile.toFixed(1)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Background Full Curve - STROKE ALWAYS VISIBLE */}
            <Area 
              type="monotone" 
              dataKey="y" 
              stroke="white" 
              strokeOpacity={0.8}
              strokeWidth={3}
              fill="url(#curveGrad)" 
              isAnimationActive={false}
            />
            {/* Highlighted Percentile Area - FILL ONLY */}
            <Area 
              type="monotone" 
              dataKey="highlightY" 
              stroke="none" 
              fill="url(#highlightGrad)" 
              fillOpacity={0.6}
              isAnimationActive={true}
              animationDuration={1500}
            />
            {decileLines.map(line => (
              <ReferenceLine 
                key={line.label}
                x={line.x} 
                stroke="white" 
                strokeOpacity={0.15}
                strokeDasharray="2 2" 
                isFront={true}
              />
            ))}
            <ReferenceLine 
              x={targetX} 
              stroke="white" 
              strokeDasharray="4 4" 
              isFront={true}
              label={{ 
                value: "YOU", 
                position: 'top', 
                fill: 'white', 
                fontSize: 10, 
                fontWeight: 900,
                offset: 15,
                className: "drop-shadow-lg"
              }} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between px-2 text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">
        <span>Lower Bound</span>
        <span>Median</span>
        <span>Upper Bound</span>
      </div>
    </div>
  );
};
