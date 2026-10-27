import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req) {
  console.log("POST /api/vibe: Request received");
  try {
    const body = await req.json().catch(err => {
      console.error("POST /api/vibe: Failed to parse request JSON:", err);
      throw err;
    });
    const { text, mode } = body;
    console.log("POST /api/vibe: text:", text, "mode:", mode);

    if (!text || !mode) {
      console.log("POST /api/vibe: Missing text or mode");
      return NextResponse.json({ error: 'Text and mode are required' }, { status: 400 });
    }

    let systemPrompt = '';
    
    switch (mode) {
      case 'rizz':
        systemPrompt = "You are a master of rizz. Generate a smooth, clever, and slightly Gen Z styled flirtatious response or pickup line based on the user's input context. Keep it under 2 sentences. Be confident and witty.";
        break;
      case 'roast':
        systemPrompt = "You are an AI trained to roast users in a hilarious, savage, Gen Z internet culture way. Roast the user's input context brutally but creatively. No offensive slurs, just pure digital disrespect.";
        break;
      case 'compliment':
        systemPrompt = "You are the ultimate hype machine. Respond to the user's input with excessive, Gen Z styled hype, calling them W, boss, sigma, or just hyping up their aura. Keep it highly energetic and supportive.";
        break;
      default:
        systemPrompt = "You are an AI assistant.";
    }

    console.log("POST /api/vibe: Initiating OpenRouter API call...");
    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash',
      max_tokens: 300,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
    });

    const responseText = completion.choices[0].message.content;
    console.log("POST /api/vibe: OpenRouter response content:", responseText);

    return NextResponse.json({ message: responseText });
  } catch (error) {
    console.error('POST /api/vibe: Error caught:', error);
    return NextResponse.json({ error: 'Failed to process vibe request', details: error.message }, { status: 500 });
  }
}
