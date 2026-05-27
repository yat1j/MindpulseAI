'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/TopBar';
import { Check, Trophy, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import { habitGrid } from '@/lib/seedData';

interface Habit {
  id: string;
  emoji: string;
  label: string;
  target: string;
  progress: number;
  checked: boolean;
}

const defaultHabits: Habit[] = [
  { id: 'water', emoji: '💧', label: 'Water', target: '8 glasses', progress: 0, checked: false },
  { id: 'sleep', emoji: '😴', label: 'Sleep 7+ hrs', target: '7 hours', progress: 0, checked: false },
  { id: 'exercise', emoji: '🏃', label: 'Exercise', target: '30 min', progress: 0, checked: false },
  { id: 'meditation', emoji: '🧘', label: 'Meditation', target: '10 min', progress: 0, checked: false },
  { id: 'screen', emoji: '📱', label: 'Screen time', target: '< 3 hrs', progress: 0, checked: false },
];

const HABIT_LABELS = ['Water', 'Sleep', 'Exercise', 'Meditation', 'Screen time'];

type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale';

const phaseConfig = {
  idle: { label: '', duration: 0, color: '#7C3AED', scale: 0.6 },
  inhale: { label: 'Inhale', duration: 4, color: '#7C3AED', scale: 1 },
  hold: { label: 'Hold', duration: 7, color: '#f59e0b', scale: 1 },
  exhale: { label: 'Exhale', duration: 8, color: '#06b6d4', scale: 0.6 },
};

function AnimatedStreak({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let v = 0;
    const step = target / (1000 / 16);
    const t = setInterval(() => {
      v += step;
      if (v >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(v));
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return <>{val}</>;
}

export default function Goals() {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [countdown, setCountdown] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('habit-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const today = new Date().toDateString();
        if (parsed.date === today) setHabits(parsed.habits);
      } catch {}
    }
  }, []);

  const saveHabits = (h: Habit[]) => {
    localStorage.setItem('habit-state', JSON.stringify({ date: new Date().toDateString(), habits: h }));
  };

  const toggleHabit = (id: string) => {
    const updated = habits.map(h =>
      h.id === id ? { ...h, checked: !h.checked, progress: !h.checked ? 100 : 0 } : h
    );
    setHabits(updated);
    saveHabits(updated);
  };

  // Breathing engine
  const runPhase = (p: BreathPhase, cb: () => void) => {
    const { duration } = phaseConfig[p];
    setPhase(p);
    setCountdown(duration);
    let remaining = duration;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        cb();
      }
    }, 1000);
  };

  const startCycle = () => {
    runPhase('inhale', () =>
      runPhase('hold', () =>
        runPhase('exhale', () => {
          if (running) startCycle();
          else { setPhase('idle'); setCountdown(0); }
        })
      )
    );
  };

  const handleBreathing = () => {
    if (running) {
      setRunning(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
      setPhase('idle');
      setCountdown(0);
    } else {
      setRunning(true);
    }
  };

  useEffect(() => {
    if (running && phase === 'idle') startCycle();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const completedCount = habits.filter(h => h.checked).length;
  const cfg = phase !== 'idle' ? phaseConfig[phase] : phaseConfig.inhale;

  const containerV = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
  const cardV = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

  return (
    <div>
      <TopBar title="Goals & Streaks" subtitle="Build healthy habits one day at a time" />
      <motion.div className="px-4 md:px-6 py-6 max-w-3xl space-y-5" variants={containerV} initial="hidden" animate="visible">

        {/* Streak hero */}
        <motion.div variants={cardV}
          className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl p-6 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute w-32 h-32 rounded-full bg-white"
                style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, opacity: 0.3 }} />
            ))}
          </div>
          <p className="text-6xl mb-1 select-none">🔥</p>
          <p className="text-5xl font-black tabular-nums">
            <AnimatedStreak target={12} />
          </p>
          <p className="text-lg font-semibold text-orange-100 mt-0.5">Day Streak</p>
          <p className="text-sm text-orange-200 mt-2">Keep going! You're on a roll.</p>
        </motion.div>

        {/* Motivational */}
        <motion.div variants={cardV}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-sm text-gray-700">
            Your best streak was <span className="font-bold text-amber-600">18 days</span>. You're{' '}
            <span className="font-bold text-violet-600">6 days away</span> — you've got this! 💪
          </p>
        </motion.div>

        {/* Today's Habits */}
        <motion.div variants={cardV} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Today's Habits</h3>
              <p className="text-xs text-gray-400 mt-0.5">{completedCount}/{habits.length} completed</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center">
              <span className="text-xs font-bold text-violet-600">{completedCount}/{habits.length}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / habits.length) * 100}%` }}
            />
          </div>

          <div className="space-y-3">
            {habits.map((habit) => (
              <div key={habit.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer',
                  habit.checked ? 'bg-emerald-50' : 'hover:bg-gray-50'
                )}
                onClick={() => toggleHabit(habit.id)}
              >
                <span className="text-xl shrink-0">{habit.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className={cn('text-sm font-medium', habit.checked ? 'text-emerald-700 line-through' : 'text-gray-800')}>
                      {habit.label}
                    </p>
                    <span className="text-xs text-gray-400">{habit.target}</span>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        habit.checked ? 'bg-emerald-500' : 'bg-gray-200'
                      )}
                      style={{ width: `${habit.progress}%` }}
                    />
                  </div>
                </div>
                <div className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                  habit.checked
                    ? 'bg-emerald-500 border-emerald-500 checkmark-pop'
                    : 'border-gray-300'
                )}>
                  {habit.checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Habit Grid */}
        <motion.div variants={cardV} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900">7-Day Habit Grid</h3>
            <p className="text-xs text-gray-400 mt-0.5">Violet = completed, gray = missed</p>
          </div>
          <div className="flex gap-1.5 mb-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className="flex-1 text-center text-[10px] text-gray-400 font-medium">{d}</div>
            ))}
          </div>
          <div className="space-y-1.5">
            {habitGrid.map((row, ri) => (
              <div key={ri} className="flex gap-1.5 items-center">
                <div className="w-14 shrink-0">
                  <span className="text-[10px] text-gray-400 font-medium">{HABIT_LABELS[ri]}</span>
                </div>
                {row.map((done, ci) => (
                  <div
                    key={ci}
                    className={cn(
                      'flex-1 h-6 rounded transition-colors',
                      done ? 'bg-violet-500' : ci === 6 ? 'bg-gray-100 border border-dashed border-gray-200' : 'bg-gray-200'
                    )}
                    title={done ? 'Completed' : ci === 6 ? 'Today' : 'Missed'}
                  />
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Breathing Exercise */}
        <motion.div variants={cardV} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6" id="breathing">
          <div className="flex items-center gap-2 mb-1">
            <Wind className="w-4.5 h-4.5 text-violet-600" />
            <h3 className="font-semibold text-gray-900">Breathing Exercise</h3>
          </div>
          <p className="text-xs text-gray-400 mb-6">4-7-8 breathing technique for calm and focus</p>

          <div className="flex flex-col items-center">
            {/* Animated circle */}
            <div className="relative flex items-center justify-center mb-6" style={{ width: 180, height: 180 }}>
              {/* Outer glow ring */}
              <div
                className="absolute inset-0 rounded-full transition-all duration-1000"
                style={{
                  background: `radial-gradient(circle, ${
                    phase === 'inhale' ? '#7C3AED' : phase === 'hold' ? '#f59e0b' : '#06b6d4'
                  }15, transparent 70%)`,
                  transform: phase === 'hold' ? 'scale(1.1)' : 'scale(1)',
                }}
              />
              {/* Main circle */}
              <div
                className={cn(
                  'w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all',
                  phase === 'inhale' && 'breathing-expand',
                  phase === 'hold' && 'pulse-amber-anim',
                  phase === 'exhale' && 'breathing-shrink',
                )}
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${
                    phase === 'hold' ? '#fbbf24' : phase === 'exhale' ? '#06b6d4' : '#7C3AED'
                  }, ${
                    phase === 'hold' ? '#f59e0b' : phase === 'exhale' ? '#0891b2' : '#6D28D9'
                  })`,
                  boxShadow: `0 0 32px ${
                    phase === 'hold' ? '#f59e0b40' : phase === 'exhale' ? '#06b6d440' : '#7C3AED40'
                  }`,
                }}
              >
                {phase !== 'idle' && (
                  <div className="text-center text-white">
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{phase}</p>
                    <p className="text-3xl font-bold tabular-nums">{countdown}</p>
                  </div>
                )}
                {phase === 'idle' && (
                  <p className="text-white/60 text-xs text-center px-2">Press Start</p>
                )}
              </div>
            </div>

            {/* Phase labels */}
            <div className="flex items-center gap-6 mb-6">
              {(['inhale', 'hold', 'exhale'] as const).map(p => (
                <div key={p}
                  className={cn(
                    'flex flex-col items-center gap-1 transition-all',
                    phase === p ? 'opacity-100' : 'opacity-30'
                  )}>
                  <div className="w-2 h-2 rounded-full" style={{
                    background: p === 'inhale' ? '#7C3AED' : p === 'hold' ? '#f59e0b' : '#06b6d4'
                  }} />
                  <span className="text-xs capitalize font-medium text-gray-600">{p}</span>
                  <span className="text-[10px] text-gray-400">{phaseConfig[p].duration}s</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleBreathing}
              className={cn(
                'px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200',
                running
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gradient-to-r from-violet-600 to-violet-700 text-white hover:from-violet-700 hover:to-violet-800 shadow-md hover:shadow-lg hover:-translate-y-0.5'
              )}
            >
              {running ? 'Stop Exercise' : 'Start Breathing'}
            </button>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
