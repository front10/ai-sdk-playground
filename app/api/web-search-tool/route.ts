import { aj } from "@/arcject/config";
import { openai } from "@ai-sdk/openai";
import {
  InferUITools,
  UIDataTypes,
  UIMessage,
  convertToModelMessages,
  stepCountIs,
  streamText,
} from "ai";
import { NextRequest, NextResponse } from "next/server";

const tools = {
  web_search_preview: openai.tools.webSearchPreview({}),

  //FOR ANTHROPIC
  // web_search: anthropic.tools.webSearch_20250305({
  // maxUses: 1,
  // }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessages = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: ChatMessages[] } = await req.json();

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

    const result = streamText({
      model: openai.responses("gpt-4.1-mini"),
      // model: anthropic("claude-sonnet-20250305"),
      messages: convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(1),
    });

    return result.toUIMessageStreamResponse({ sendSources: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate chat response", details: error },
      { status: 500 }
    );
  }
}
