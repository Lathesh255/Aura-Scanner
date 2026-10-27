import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { safeJsonParse } from '@/lib/utils';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req) {
  console.log("POST /api/compare: Request received");
  try {
    const body = await req.json().catch(err => {
      console.error("POST /api/compare: Failed to parse request JSON:", err);
      throw err;
    });
    const { user1, user2 } = body;
    console.log("POST /api/compare: user1:", user1, "user2:", user2);

    if (!user1 || !user2) {
      console.log("POST /api/compare: Missing user1 or user2");
      return NextResponse.json({ error: 'Both subjects required' }, { status: 400 });
    }

    const systemPrompt = `You are the AntiGraviyy Compatibility Matrix. Analyze the vibe, aesthetic, and cultural synergy between Subject 1 ("${user1}") and Subject 2 ("${user2}").
Respond in strict JSON format with exactly these keys:
- "synergy": A number from 0 to 100 representing how well they vibe.
- "chaos": A number from 0 to 100 representing the toxicity or chaos if they interact.
- "verdict": A short punchy 3-5 word verdict (e.g., "Soulmates", "Absolute Disaster", "Enemies to Lovers").
- "analysis": A 2-sentence Gen Z style breakdown of their dynamic.`;

    console.log("POST /api/compare: Initiating OpenRouter API call...");
    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash',
      response_format: { type: "json_object" },
      max_tokens: 300,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze Subject 1: ${user1} vs Subject 2: ${user2}` }
      ],
    });

    const responseContent = completion.choices[0].message.content;
    console.log("POST /api/compare: OpenRouter response content:", responseContent);
    const parsedData = safeJsonParse(responseContent);
    console.log("POST /api/compare: Parsed data:", parsedData);

    return NextResponse.json({
      synergy: parsedData.synergy || 50,
      chaos: parsedData.chaos || 50,
      verdict: parsedData.verdict || 'Inconclusive Vibe',
      analysis: parsedData.analysis || 'The vibes are too confusing to analyze right now.'
    });
  } catch (error) {
    console.error('POST /api/compare: Error caught:', error);
    return NextResponse.json({ error: 'Failed to process comparison', details: error.message }, { status: 500 });
  }
}
