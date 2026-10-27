import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { safeJsonParse } from '@/lib/utils';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req) {
  console.log("POST /api/scan: Request received");
  try {
    const body = await req.json().catch(err => {
      console.error("POST /api/scan: Failed to parse request JSON:", err);
      throw err;
    });
    const { imageBase64 } = body;
    console.log("POST /api/scan: Image received, base64 length:", imageBase64?.length);

    if (!imageBase64) {
      console.log("POST /api/scan: Image base64 is missing");
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const systemPrompt = `You are the AntiGraviyy Aura Scanner. Analyze this image (selfie or fit). 
Respond in strict JSON format with exactly these three keys:
- "vibe": A 1-2 word description of the vibe (e.g., "Chaotic Energy", "Sigma Male", "Mysterious", "E-Girl Core").
- "auraScore": A number between 0 and 100 representing their aura power.
- "analysis": A 2-sentence Gen Z style breakdown of their look and energy.`;

    console.log("POST /api/scan: Initiating OpenRouter API call...");
    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash',
      response_format: { type: "json_object" },
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: systemPrompt },
            { type: 'image_url', image_url: { url: imageBase64 } }
          ]
        }
      ],
    });

    const responseContent = completion.choices[0].message.content;
    console.log("POST /api/scan: OpenRouter response content:", responseContent);
    const parsedData = safeJsonParse(responseContent);
    console.log("POST /api/scan: Parsed data:", parsedData);

    return NextResponse.json({
      vibe: parsedData.vibe || 'Unknown Entity',
      auraScore: parsedData.auraScore || 50,
      analysis: parsedData.analysis || 'Aura levels fluctuating. Cannot compute.',
    });
  } catch (error) {
    console.error('POST /api/scan: Error caught:', error);
    return NextResponse.json({ error: 'Failed to process aura scan', details: error.message }, { status: 500 });
  }
}
