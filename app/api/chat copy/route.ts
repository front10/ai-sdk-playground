import { NextRequest, NextResponse } from "next/server";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: openai("gpt-4.1-nano"),
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate chat response", details: error },
      { status: 500 }
    );
  }
}

//gemini-2.5-flash-lite
