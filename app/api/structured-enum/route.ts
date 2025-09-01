import { aj } from "@/arcject/config";
import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

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
