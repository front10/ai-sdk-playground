import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const stream = streamText({
      model: openai("gpt-4.1-nano"),
      prompt,
    });

    stream.usage.then((usage) => {
      console.log({
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });

    return stream.toUIMessageStreamResponse();
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate stream", details: error },
      { status: 500 }
    );
  }
}
