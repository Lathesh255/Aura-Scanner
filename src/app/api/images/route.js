import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const images = await prisma.image.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Parse the tags from JSON string
    const parsedImages = images.map(img => ({
      ...img,
      tags: JSON.parse(img.tags)
    }));

    return NextResponse.json(parsedImages);
  } catch (error) {
    console.error('Failed to fetch images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { url, tags } = body;

    if (!url) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const newImage = await prisma.image.create({
      data: {
        url,
        tags: JSON.stringify(tags || []),
      }
    });

    return NextResponse.json({
      ...newImage,
      tags: JSON.parse(newImage.tags)
    });
  } catch (error) {
    console.error('Failed to save image:', error);
    return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
  }
}
