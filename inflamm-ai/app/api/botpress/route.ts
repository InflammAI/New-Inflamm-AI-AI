import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, conversationId } = await req.json();

    const response = await fetch(
      "https://messaging.botpress.cloud/v1/messages",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.BOTPRESS_API_KEY}`,
          "x-bot-id": process.env.BOTPRESS_BOT_ID!, // REQUIRED
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          payload: {
            type: "text",
            text,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Botpress API error: ${response.status} - ${errorText}` 
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Botpress error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
