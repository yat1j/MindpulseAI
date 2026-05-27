import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, newMessage } = await req.json();

    const history = Array.isArray(messages)
      ? messages.filter((m: { role: string; content: string }) => m.role === 'user' || m.role === 'assistant')
      : [];

    const conversationHistory = history
      .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const prompt = `You are MindPulse, a warm empathetic wellness companion. Help with mental health, stress, sleep, anxiety, motivation. Keep replies to 2-4 warm sentences. Never diagnose medical conditions. Suggest professional help for serious issues. Use one emoji occasionally.\n\n${conversationHistory}\nUser: ${newMessage}\nAssistant:`;

    const apiKey = process.env.GEMINI_KEY;
    if (!apiKey) {
      console.error('Chat API error: GEMINI_KEY is not set');
      return NextResponse.json({ reply: "Configuration error: API key not set. Please check your .env.local file." }, { status: 500 });
    }

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})});
    const d = await res.json();

    if (d.error) {
      console.error('Gemini API error:', JSON.stringify(d.error));
      return NextResponse.json({ reply: `Gemini API error: ${d.error.message}` }, { status: 500 });
    }

    if (!d.candidates || !d.candidates[0]?.content?.parts?.[0]?.text) {
      console.error('Unexpected Gemini response:', JSON.stringify(d).slice(0, 500));
      return NextResponse.json({ reply: "Unexpected response from AI service." }, { status: 500 });
    }

    const text = d.candidates[0].content.parts[0].text;
    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json(
      { reply: "I'm here for you. It seems there was a small hiccup on my end. Please try again in a moment." },
      { status: 200 }
    );
  }
}
