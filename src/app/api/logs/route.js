import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("================ CLIENT LOG ================");
    console.log("Type:", body.type);
    console.log("Message:", body.message);
    if (body.filename) {
      console.log(`File: ${body.filename}:${body.lineno}:${body.colno}`);
    }
    if (body.stack) {
      console.log("Stack:", body.stack);
    }
    if (body.details) {
      console.log("Details:", JSON.stringify(body.details, null, 2));
    }
    console.log("============================================");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
