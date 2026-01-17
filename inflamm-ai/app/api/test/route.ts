import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const openaiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    return NextResponse.json({
      success: true,
      message: "API configuration check",
      openai: {
        hasApiKey: !!openaiKey,
        apiKeyLength: openaiKey?.length || 0,
        envVars: {
          OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
          NEXT_PUBLIC_OPENAI_API_KEY: !!process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        }
      },
      gemini: {
        hasApiKey: !!geminiKey,
        apiKeyLength: geminiKey?.length || 0,
        envVars: {
          GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
          NEXT_PUBLIC_GEMINI_API_KEY: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        }
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
