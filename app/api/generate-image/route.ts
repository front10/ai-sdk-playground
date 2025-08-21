import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { experimental_generateImage as generateImage } from "ai";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const { image } = await generateImage({
      model: openai.imageModel("dall-e-3"),
      prompt,
      size: "1024x1024",
      providerOptions: {
        openai: {
          style: "vivid",
          quality: "hd",
        },
      },
    });

    return NextResponse.json(image.base64);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate image", details: error },
      { status: 500 }
    );
  }
}
