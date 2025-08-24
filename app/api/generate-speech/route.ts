import { openai } from "@ai-sdk/openai";
import { experimental_generateSpeech as generateSpeech } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    const { audio } = await generateSpeech({
      model: openai.speech("tts-1"),
      text,
    });

    const buffer = Buffer.from(audio.uint8Array);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": audio.mediaType || "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Error generating speech:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
