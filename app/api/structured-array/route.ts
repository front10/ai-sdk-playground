import { NextRequest, NextResponse } from "next/server";
import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { pokemonSchema } from "./schema";

export async function POST(req: NextRequest) {
  try {
    const { type } = await req.json();

    const result = streamObject({
      model: openai("gpt-4.1-nano"),
      output: "array",
      schema: pokemonSchema,
      prompt: `Generate a list of 5 ${type} type pokemon`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate structured data response", details: error },
      { status: 500 }
    );
  }
}
