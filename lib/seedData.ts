export const moodData = [
  { day: 'Mon', mood: 5.8, sleep: 6.5 },
  { day: 'Tue', mood: 6.4, sleep: 7.2 },
  { day: 'Wed', mood: 6.1, sleep: 6.8 },
  { day: 'Thu', mood: 7.5, sleep: 8.0 },
  { day: 'Fri', mood: 6.9, sleep: 7.5 },
  { day: 'Sat', mood: 8.2, sleep: 8.5 },
  { day: 'Sun', mood: 7.2, sleep: 7.4 },
];

export const stressData = [
  { name: 'Work', value: 40, color: '#7C3AED' },
  { name: 'Personal', value: 30, color: '#06b6d4' },
  { name: 'Health', value: 20, color: '#f59e0b' },
  { name: 'Other', value: 10, color: '#6b7280' },
];

export const recentCheckins = [
  {
    id: '1',
    mood: 7,
    emoji: '🙂',
    date: 'Today, 9:12 AM',
    summary: 'Feeling decent after a good breakfast. A bit stressed about the project deadline.',
  },
  {
    id: '2',
    mood: 8,
    emoji: '😊',
    date: 'Yesterday, 8:45 PM',
    summary: 'Had a great workout and quality time with family. Energy levels are high!',
  },
  {
    id: '3',
    mood: 6,
    emoji: '😐',
    date: 'Dec 18, 10:30 AM',
    summary: 'Neutral day, work was manageable but feeling a little isolated.',
  },
];

export const habitGrid = Array.from({ length: 5 }, (_, row) =>
  Array.from({ length: 7 }, (_, col) => {
    const rand = Math.random();
    if (col === 6) return false;
    return rand > 0.35;
  })
);
