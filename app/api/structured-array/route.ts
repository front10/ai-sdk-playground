import { aj } from "@/arcject/config";
import { NextRequest, NextResponse } from "next/server";
import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { pokemonSchema } from "./schema";

export async function POST(req: NextRequest) {
  try {
    const { type } = await req.json();

    // Skip Arcjet protection in development mode
    if (!process.env.IS_DEV_MODE) {
      const decision = await aj.protect(req, {
        requested: 1,
      });

      if (decision.reason.isRateLimit()) {
        return new Response(
          JSON.stringify({
            error: "Too Many Requests",
            message:
              "You have reached the rate limit for today. Please try again tomorrow.",
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

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
