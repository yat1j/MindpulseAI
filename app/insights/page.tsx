'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/TopBar';
import { RefreshCw, Moon, Brain, Zap, Heart, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Insight {
  category: string;
  icon: string;
  title: string;
  description: string;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Sleep: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  Mood: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  Stress: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Energy: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

const defaultInsights: Insight[] = [
  {
    category: 'Sleep',
    icon: '🌙',
    title: 'Your sleep quality peaks mid-week',
    description: 'You sleep an average of 8.1 hours on Tuesdays and Wednesdays compared to 6.3 on weekends. Maintaining a consistent schedule could boost your mood by up to 25%.',
  },
  {
    category: 'Mood',
    icon: '✨',
    title: 'Morning check-ins correlate with better days',
    description: 'On days you log your mood before 10 AM, your average mood score is 7.8 versus 6.1 on days you check in later. Starting intentionally makes a measurable difference.',
  },
  {
    category: 'Stress',
    icon: '🧘',
    title: 'Work stress spikes on Monday and Thursday',
    description: 'Your stress levels are 40% higher at the start and end of the workweek. Consider scheduling light activities or social time on these days to buffer the impact.',
  },
];

function SkeletonInsight() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 skeleton-shimmer rounded-xl" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 skeleton-shimmer rounded-full w-1/4" />
          <div className="h-3.5 skeleton-shimmer rounded-full w-2/3" />
        </div>
      </div>
      <div className="h-3 skeleton-shimmer rounded-full w-full" />
      <div className="h-3 skeleton-shimmer rounded-full w-4/5" />
    </div>
  );
}

const containerV = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const cardV = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function Insights() {
  const [insights, setInsights] = useState<Insight[]>(defaultInsights);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      // CLAUDE_API_CALL_3
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userStats: { avgMood: 7.2, avgSleep: 7.4, streak: 12 },
        }),
      });

      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      if (Array.isArray(data)) setInsights(data);
      toast.success('Insights refreshed ✨');
    } catch {
      toast.error('Failed to refresh insights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TopBar title="Insights" subtitle="AI-powered analysis of your wellness patterns" />
      <motion.div className="px-4 md:px-6 py-6 max-w-3xl space-y-5" variants={containerV} initial="hidden" animate="visible">

        {/* Header row */}
        <motion.div variants={cardV} className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Your Personalized Insights</h2>
            <p className="text-sm text-gray-400 mt-0.5">Based on your last 7 days of data</p>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-violet-300 hover:text-violet-600 transition-all shadow-sm disabled:opacity-60"
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            Refresh Insights
          </button>
        </motion.div>

        {/* Trend of the week */}
        <motion.div variants={cardV}
          className="bg-white rounded-2xl border-l-4 border-l-violet-500 border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 bg-violet-50 rounded-xl flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700">Trend of the Week</span>
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1.5">You feel 40% better on weekends</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your average mood score jumps from 6.1 during weekdays to 8.5 on weekends. This suggests that rest, reduced obligations,
                and social connection are significant mood boosters for you. Consider how to bring more of these elements into your weekdays.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Insight Cards */}
        <div className="space-y-3.5">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3.5">
                {[1, 2, 3].map(i => <SkeletonInsight key={i} />)}
              </motion.div>
            ) : (
              <motion.div key="insights" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3.5">
                {insights.map((insight, i) => {
                  const colors = categoryColors[insight.category] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 ${colors.bg} rounded-xl flex items-center justify-center shrink-0 text-xl group-hover:scale-105 transition-transform`}>
                          {insight.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                              {insight.category}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1.5">{insight.title}</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">{insight.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Wellness Score Card */}
        <motion.div variants={cardV}
          className="bg-gradient-to-r from-violet-600 to-violet-800 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-violet-200 text-sm font-medium">Overall Wellness Score</p>
              <p className="text-3xl font-bold mt-0.5">74<span className="text-xl text-violet-300">/100</span></p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: '74%' }} />
          </div>
          <p className="text-violet-200 text-xs mt-2">Up 8 points from last week. Keep it up!</p>
        </motion.div>

      </motion.div>
    </div>
  );
}
