import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { promises as fs } from 'fs';
import path from 'path';
import { safeJsonParse } from '@/lib/utils';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || 'mock-key',
});

export async function POST(request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Mock response if no real API key is provided
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_actual_key_here') {
      console.log('Using mock OpenRouter response for:', imageUrl);
      return NextResponse.json({
        tags: ['Sad', 'Cinematic', 'Moody', 'Portrait', 'High-Contrast'],
      });
    }

    let finalVisionUrl = imageUrl;

    // If it's a local file, we must convert it to base64 because OpenRouter cannot access localhost
    if (imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', imageUrl);
      const fileBuffer = await fs.readFile(filePath);
      const base64Str = fileBuffer.toString('base64');
      const ext = path.extname(imageUrl).slice(1) || 'jpeg';
      const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
      finalVisionUrl = `data:${mimeType};base64,${base64Str}`;
    }

    const response = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this image and return a JSON array of exactly 5 tags. The VERY FIRST tag MUST be the primary emotional mood of the subject or scene (e.g., "Happy", "Sad", "Angry", "Relaxed"). The remaining 4 tags should describe the aesthetic style and vibe (e.g., "Cinematic", "Minimalist", "Warm"). Return ONLY the JSON array of strings, like ["Happy", "Bright", "Cinematic", "Portrait", "Warm"], with no other text and no markdown formatting.'
            },
            {
              type: 'image_url',
              image_url: {
                url: finalVisionUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 100,
    });

    const content = response.choices[0].message.content;
    let tags = [];
    
    try {
      tags = safeJsonParse(content);
    } catch (e) {
      // Fallback if the model didn't return perfect JSON
      tags = content.replace(/[\[\]"]/g, '').split(',').map(t => t.trim());
    }

    return NextResponse.json({ tags });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
}
