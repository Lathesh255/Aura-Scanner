import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { safeJsonParse } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function GET() {
  try {
    const user1 = 'Art Hoe';
    const user2 = 'Goth Mommy';
    const systemPrompt = `You are the AntiGraviyy Compatibility Matrix. Analyze the vibe, aesthetic, and cultural synergy between Subject 1 ("${user1}") and Subject 2 ("${user2}").
Respond in strict JSON format with exactly these keys:
- "synergy": A number from 0 to 100 representing how well they vibe.
- "chaos": A number from 0 to 100 representing the toxicity or chaos if they interact.
- "verdict": A short punchy 3-5 word verdict (e.g., "Soulmates", "Absolute Disaster", "Enemies to Lovers").
- "analysis": A 2-sentence Gen Z style breakdown of their dynamic.`;

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
    const parsedData = safeJsonParse(responseContent);

    return NextResponse.json({
      status: 'success',
      data: parsedData
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: error.stack
    });
  }
}
