import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, UIMessage, UIDataTypes } from "ai";
import { NextRequest, NextResponse } from "next/server";

export type ChatMessages = UIMessage<never, UIDataTypes>;

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: ChatMessages[] } = await req.json();

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
