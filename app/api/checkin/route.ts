import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { mood, sleep, stress, energy } = await req.json();

    const prompt = `You are a compassionate wellness coach. Analyze this check-in and return ONLY valid JSON (no markdown, no code blocks, just the raw JSON object):
{ "moodColor": "#hex", "summary": "2 warm personalized sentences", "recommendations": ["action1","action2","action3"], "affirmation": "one short powerful affirmation" }
Data: mood ${mood}/10, sleep ${sleep}h, stress: ${JSON.stringify(stress)}, energy: ${energy}`;

    const apiKey = process.env.GEMINI_KEY;
    if (!apiKey) {
      console.error('Checkin API error: GEMINI_KEY is not set');
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

    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonStr = text.slice(jsonStart, jsonEnd);
    const result = JSON.parse(jsonStr);

    return NextResponse.json(result);
  } catch (err) {
    console.error('Checkin API error:', err);
    return NextResponse.json(
      {
        moodColor: '#22C55E',
        summary: "You're doing a great job checking in with yourself today. Remember that awareness is the first step to wellness.",
        recommendations: ['Take a 5-minute walk', 'Practice deep breathing', 'Drink a glass of water'],
        affirmation: 'I am worthy of care and compassion.',
      },
      { status: 200 }
    );
  }
}
