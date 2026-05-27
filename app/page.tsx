'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TopBar from '@/components/TopBar';
import { TrendingUp, Moon, Brain, Flame } from 'lucide-react';
import { moodData, stressData, recentCheckins } from '@/lib/seedData';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function AnimatedNumber({ target, decimals = 0, suffix = '' }: { target: number; decimals?: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (1200 / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(parseFloat(start.toFixed(decimals)));
    }, 16);
    return () => clearInterval(timer);
  }, [target, decimals]);
  return <>{value.toFixed(decimals)}{suffix}</>;
}

const statCards = [
  {
    label: "Today's Mood",
    value: 7.2, decimals: 1, suffix: '/10',
    icon: Brain, color: 'text-violet-600', bg: 'bg-violet-50', iconBg: 'bg-violet-100',
    trend: '+0.8 from yesterday', trendUp: true,
  },
  {
    label: 'Avg Sleep',
    value: 7.4, decimals: 1, suffix: 'h',
    icon: Moon, color: 'text-cyan-600', bg: 'bg-cyan-50', iconBg: 'bg-cyan-100',
    trend: '+30min from last week', trendUp: true,
  },
  {
    label: 'Stress Level',
    value: null as null, displayStr: 'Medium',
    icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', iconBg: 'bg-amber-100',
    trend: 'Down from High', trendUp: true,
  },
  {
    label: 'Day Streak',
    value: 12, decimals: 0, suffix: ' days',
    icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50', iconBg: 'bg-orange-100',
    trend: 'Personal best: 18', trendUp: false,
  },
];

function MoodTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2">
      <p className="font-semibold text-gray-700 text-xs">{label}</p>
      <p className="text-violet-600 font-semibold text-sm">{payload[0]?.value}/10</p>
    </div>
  );
}
function SleepTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2">
      <p className="font-semibold text-gray-700 text-xs">{label}</p>
      <p className="text-cyan-600 font-semibold text-sm">{payload[0]?.value}h</p>
    </div>
  );
}
function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2">
      <p className="font-semibold text-gray-700 text-xs">{payload[0]?.name}</p>
      <p style={{ color: payload[0]?.payload?.color }} className="font-semibold text-sm">{payload[0]?.value}%</p>
    </div>
  );
}

const containerV = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const cardV = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function Dashboard() {
  return (
    <div>
      <TopBar />
      <motion.div className="px-4 md:px-6 py-6 space-y-5 max-w-6xl" variants={containerV} initial="hidden" animate="visible">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {statCards.map((card) => (
            <motion.div key={card.label} variants={cardV}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-all duration-200 cursor-default">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-500 leading-tight">{card.label}</p>
                <div className={`w-8 h-8 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <div className="mb-1">
                {card.value !== null ? (
                  <span className="text-2xl font-bold text-gray-900 tabular-nums">
                    <AnimatedNumber target={card.value} decimals={card.decimals} suffix={card.suffix} />
                  </span>
                ) : (
                  <span className={`text-sm font-semibold px-2.5 py-1 rounded-full inline-block ${card.bg} ${card.color}`}>
                    {card.displayStr}
                  </span>
                )}
              </div>
              <p className={`text-[11px] font-medium ${card.trendUp ? 'text-emerald-500' : 'text-gray-400'}`}>
                {card.trendUp ? '↑ ' : ''}{card.trend}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div variants={cardV} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Mood Trend</h3>
                <p className="text-xs text-gray-400 mt-0.5">Last 7 days</p>
              </div>
              <span className="text-xs bg-violet-50 text-violet-600 font-semibold px-2.5 py-1 rounded-full">↑ 12%</span>
            </div>
            <ResponsiveContainer width="100%" height={175}>
              <LineChart data={moodData} margin={{ top: 4, right: 6, bottom: 0, left: -22 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[4, 10]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<MoodTooltip />} />
                <Line type="monotone" dataKey="mood" stroke="#7C3AED" strokeWidth={2.5}
                  dot={{ fill: '#7C3AED', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: '#7C3AED', stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div variants={cardV} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Sleep Hours</h3>
                <p className="text-xs text-gray-400 mt-0.5">Last 7 days</p>
              </div>
              <span className="text-xs bg-cyan-50 text-cyan-600 font-semibold px-2.5 py-1 rounded-full">Avg 7.4h</span>
            </div>
            <ResponsiveContainer width="100%" height={175}>
              <BarChart data={moodData} margin={{ top: 4, right: 6, bottom: 0, left: -22 }} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<SleepTooltip />} />
                <Bar dataKey="sleep" fill="#06b6d4" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Stress + Recent Check-ins */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <motion.div variants={cardV} className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 text-sm">Stress Sources</h3>
              <p className="text-xs text-gray-400 mt-0.5">This week breakdown</p>
            </div>
            <ResponsiveContainer width="100%" height={155}>
              <PieChart>
                <Pie data={stressData} cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={3} dataKey="value">
                  {stressData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {stressData.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-xs text-gray-600">{s.name} {s.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={cardV} className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Recent Check-ins</h3>
                <p className="text-xs text-gray-400 mt-0.5">Your latest entries</p>
              </div>
              <a href="/checkin" className="text-xs text-violet-600 hover:text-violet-700 font-semibold transition-colors">+ New →</a>
            </div>
            <div className="space-y-2.5">
              {recentCheckins.map((c) => (
                <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-violet-50/50 transition-colors cursor-pointer">
                  <span className="text-xl leading-none mt-0.5 shrink-0">{c.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full">{c.mood}/10</span>
                      <span className="text-[11px] text-gray-400">{c.date}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{c.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}
