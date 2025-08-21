import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    const result = await generateObject({
      model: openai("gpt-4o-mini"), // gpt-4o-mini supports enum better than gpt-4.1-mini
      output: "enum",
      enum: ["positive", "negative", "neutral"],
      prompt: `Classify the sentiment of the following text: ${text}`,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate structured data response", details: error },
      { status: 500 }
    );
  }
}
