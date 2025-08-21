import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const response = await generateText({
      model: openai("gpt-4.1-nano"),
      prompt,
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate completition", details: error },
      { status: 500 }
    );
  }
}
