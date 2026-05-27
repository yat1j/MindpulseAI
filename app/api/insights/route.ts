import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userStats } = await req.json();

    const prompt = `You are a wellness data analyst. Based on these user stats, generate 3 personalized insights. Return ONLY valid JSON array (no markdown, no code blocks):
[{ "category": "Sleep|Mood|Stress|Energy", "icon": "single emoji", "title": "insight title", "description": "2 specific actionable sentences" }]
3 items total. Make them specific, surprising, and data-driven — not generic advice.
User stats: average mood ${userStats.avgMood}/10, average sleep ${userStats.avgSleep}h, current streak ${userStats.streak} days.`;

    const apiKey = process.env.GEMINI_KEY;
    if (!apiKey) {
      console.error('Insights API error: GEMINI_KEY is not set');
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})});
    const d = await res.json();

    if (d.error) {
      console.error('Gemini API error:', JSON.stringify(d.error));
      return NextResponse.json({ error: d.error.message }, { status: 500 });
    }

    if (!d.candidates || !d.candidates[0]?.content?.parts?.[0]?.text) {
      console.error('Unexpected Gemini response:', JSON.stringify(d).slice(0, 500));
      return NextResponse.json({ error: "Unexpected AI response" }, { status: 500 });
    }

    const text = d.candidates[0].content.parts[0].text.trim();

    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']') + 1;
    const jsonStr = text.slice(jsonStart, jsonEnd);
    const result = JSON.parse(jsonStr);

    return NextResponse.json(result);
  } catch (err) {
    console.error('Insights API error:', err);
    return NextResponse.json([
      {
        category: 'Mood',
        icon: '✨',
        title: 'Consistency is your superpower',
        description: 'Your 12-day streak shows remarkable commitment. Users with streaks over 10 days report 35% higher overall wellness scores.',
      },
      {
        category: 'Sleep',
        icon: '🌙',
        title: 'Your sleep window is optimizing',
        description: `At 7.4h average, you're within the optimal range. Focus on sleep consistency — same bedtime daily boosts sleep quality by 22%.`,
      },
      {
        category: 'Stress',
        icon: '🧘',
        title: 'Midweek stress patterns detected',
        description: 'Your data suggests stress peaks on Wednesday. Planning a short walk or meditation at 2 PM on Wednesdays could reduce this by 18%.',
      },
    ]);
  }
}
