'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/TopBar';
import toast from 'react-hot-toast';
import { Minus, Plus, Wind, Sparkles, Save, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const moodEmojis = [
  { emoji: '😢', label: 'Awful', value: 1 },
  { emoji: '😕', label: 'Bad', value: 3 },
  { emoji: '😐', label: 'Okay', value: 5 },
  { emoji: '🙂', label: 'Good', value: 7 },
  { emoji: '😊', label: 'Great', value: 9 },
];

const stressTriggers = ['Work', 'Relationships', 'Health', 'Finance', 'None'];
const energyLevels = ['Low', 'Medium', 'High'];

interface AIResult {
  moodColor: string;
  summary: string;
  recommendations: string[];
  affirmation: string;
}

function SkeletonCard() {
  return (
    <div className="space-y-3 p-5">
      <div className="h-3 skeleton-shimmer rounded-full w-1/3" />
      <div className="h-3 skeleton-shimmer rounded-full w-full" />
      <div className="h-3 skeleton-shimmer rounded-full w-4/5" />
      <div className="flex gap-2 mt-4">
        {[1, 2, 3].map(i => <div key={i} className="h-8 skeleton-shimmer rounded-full w-24" />)}
      </div>
    </div>
  );
}

export default function CheckIn() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [sleep, setSleep] = useState(7);
  const [selectedStress, setSelectedStress] = useState<string[]>([]);
  const [energy, setEnergy] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);

  const moodScore = selectedMood !== null
    ? Math.round(moodEmojis[selectedMood].value + (selectedMood * 0.4) * (10 - moodEmojis[selectedMood].value) / 4)
    : null;

  const toggleStress = (s: string) => {
    if (s === 'None') { setSelectedStress(['None']); return; }
    setSelectedStress(prev =>
      prev.includes(s)
        ? prev.filter(x => x !== s)
        : [...prev.filter(x => x !== 'None'), s]
    );
  };

  const handleAnalyze = async () => {
    if (selectedMood === null) { toast.error('Please select your mood first'); return; }
    if (!energy) { toast.error('Please select your energy level'); return; }

    setLoading(true);
    setResult(null);

    try {
      // CLAUDE_API_CALL_1
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: moodEmojis[selectedMood].value,
          sleep,
          stress: selectedStress.length ? selectedStress : ['None'],
          energy,
        }),
      });

      if (!res.ok) throw new Error('Failed to analyze');
      const data = await res.json();
      setResult(data);
    } catch {
      toast.error('Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    const history = JSON.parse(localStorage.getItem('checkin-history') || '[]');
    history.unshift({
      id: Date.now(),
      date: new Date().toISOString(),
      mood: selectedMood !== null ? moodEmojis[selectedMood].value : 5,
      moodEmoji: selectedMood !== null ? moodEmojis[selectedMood].emoji : '😐',
      sleep,
      stress: selectedStress,
      energy,
      result,
    });
    localStorage.setItem('checkin-history', JSON.stringify(history.slice(0, 30)));
    toast.success('Check-in saved! 🌟');
  };

  const showLowMoodCard = selectedMood !== null && moodEmojis[selectedMood].value <= 3;

  return (
    <div>
      <TopBar title="Daily Check-in" subtitle="How are you feeling today?" />
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 space-y-5">

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-violet-600 to-violet-800 rounded-2xl p-6 text-white"
        >
          <h2 className="text-xl font-bold mb-1">How are you feeling today?</h2>
          <p className="text-violet-200 text-sm">Take a moment to check in with yourself. You deserve this.</p>
        </motion.div>

        {/* Mood Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Current Mood</h3>
            {selectedMood !== null && (
              <span className="text-sm font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
                {moodEmojis[selectedMood].value}/10
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            {moodEmojis.map((m, i) => (
              <button
                key={i}
                onClick={() => setSelectedMood(i)}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-200 flex-1',
                  selectedMood === i
                    ? 'bg-violet-50 ring-2 ring-violet-400 scale-105'
                    : 'hover:bg-gray-50 hover:scale-105'
                )}
              >
                <span className="text-3xl leading-none">{m.emoji}</span>
                <span className="text-[11px] font-medium text-gray-500">{m.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Low Mood Card */}
        <AnimatePresence>
          {showLowMoodCard && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="bg-pink-50 border border-pink-200 rounded-2xl p-4"
            >
              <p className="font-semibold text-pink-700 mb-1">Tough day? You're not alone 💜</p>
              <p className="text-sm text-pink-600 leading-relaxed">
                It's completely okay to have difficult days. Your feelings are valid, and reaching out for support is a sign of strength.
                Be gentle with yourself today — every small step counts.
              </p>
              <a href="/goals" className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-pink-700 hover:text-pink-800 transition-colors">
                <Wind className="w-4 h-4" />
                Try Breathing Exercise
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sleep Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Sleep Last Night</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 tabular-nums">{sleep}<span className="text-xl text-gray-400 font-medium ml-1">hrs</span></p>
              <p className="text-xs text-gray-400 mt-0.5">
                {sleep < 6 ? '⚠️ Below recommended' : sleep >= 8 ? '✅ Well rested' : '✓ Near target'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSleep(Math.max(0, sleep - 0.5))}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setSleep(Math.min(12, sleep + 0.5))}
                className="w-10 h-10 rounded-xl bg-violet-100 hover:bg-violet-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4 text-violet-600" />
              </button>
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-400 to-violet-600 rounded-full transition-all duration-300"
              style={{ width: `${(sleep / 12) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Stress Triggers */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <h3 className="font-semibold text-gray-900 mb-3">Stress Triggers</h3>
          <p className="text-xs text-gray-400 mb-3">Select all that apply</p>
          <div className="flex flex-wrap gap-2">
            {stressTriggers.map((s) => (
              <button
                key={s}
                onClick={() => toggleStress(s)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-150',
                  selectedStress.includes(s)
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Energy Level */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <h3 className="font-semibold text-gray-900 mb-3">Energy Level</h3>
          <div className="flex gap-3">
            {energyLevels.map((e) => {
              const colors = { Low: 'text-red-600 bg-red-50 ring-red-300', Medium: 'text-amber-600 bg-amber-50 ring-amber-300', High: 'text-emerald-600 bg-emerald-50 ring-emerald-300' };
              return (
                <button
                  key={e}
                  onClick={() => setEnergy(e)}
                  className={cn(
                    'flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-150',
                    energy === e
                      ? `ring-2 ${colors[e as keyof typeof colors]}`
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  )}
                >
                  {e}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Analyze Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleAnalyze}
          disabled={loading || selectedMood === null}
          className={cn(
            'w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2',
            selectedMood !== null && !loading
              ? 'bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 shadow-md hover:shadow-lg hover:-translate-y-0.5'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing your wellness...
            </>
          ) : (
            <>
              <Sparkles className="w-4.5 h-4.5" />
              Analyze My Wellness
            </>
          )}
        </motion.button>

        {/* Result */}
        <AnimatePresence>
          {(loading || result) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {loading ? (
                <SkeletonCard />
              ) : result ? (
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: result.moodColor + '20' }}>
                      <div className="w-4 h-4 rounded-full" style={{ background: result.moodColor }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">Your Wellness Brief</h3>
                      <p className="text-xs text-gray-400">Personalized analysis just for you</p>
                    </div>
                  </div>

                  {/* Mood color bar */}
                  <div className="h-1.5 rounded-full mb-4 overflow-hidden bg-gray-100">
                    <div className="h-full rounded-full w-3/4 transition-all duration-700"
                      style={{ background: `linear-gradient(90deg, ${result.moodColor}80, ${result.moodColor})` }} />
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed mb-4">{result.summary}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {result.recommendations.map((rec, i) => (
                      <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-full bg-violet-50 text-violet-700">
                        {rec}
                      </span>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-violet-50 to-violet-100/50 rounded-xl p-3.5 mb-4">
                    <p className="text-sm font-semibold text-violet-700 italic">"{result.affirmation}"</p>
                  </div>

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save to Journal
                  </button>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
