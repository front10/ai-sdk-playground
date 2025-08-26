import React from "react";
import { CodeBlock } from "../../../components/ui/code-block";

const frontendCode = `"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, Square, Send, ArrowLeft, Code } from "lucide-react";
import Link from "next/link";
import { DefaultChatTransport } from "ai";

function Tools() {
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/tools",
    }),
  });

  const [prompt, setPrompt] = useState("");
 

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    sendMessage({
      text: prompt,
    });
    setPrompt("");
  };

  return (
    return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header, sentiment analysis display, and input */}
    </div>
  );
  );
}

export default Tools;`;

const backendCode = `import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  streamText,
  UIMessage,
  tool,
  InferUITools,
  UIDataTypes,
  stepCountIs,
} from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const tools = {
  getWeather: tool({
    description: "Get the weather for a given location",
    inputSchema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
    execute: async ({ city }) => {
      if (city === "Gotham City") {
        return {
          temperature: 20,
          description: "Sunny",
        };
      }

      if (city === "Metropolis") {
        return {
          temperature: 10,
          description: "Cloudy",
        };
      }

      return "Unknown";
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessages = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: ChatMessages[] } = await req.json();

    const result = streamText({
      model: openai("gpt-4.1-nano"),
      messages: convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(2),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate chat response", details: error },
      { status: 500 }
    );
  }
}`;

export function ToolsCode() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Implementation Code
        </h2>
        <p className="text-gray-600">
          Here&apos;s how the AI Tools feature is built using AI SDK and Next.js
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Frontend Implementation
          </h3>
          <CodeBlock
            language="tsx"
            filename="app/ui/tools/page.tsx"
            code={frontendCode}
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Backend API Route
          </h3>
          <CodeBlock
            language="typescript"
            filename="app/api/tools/route.ts"
            code={backendCode}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-800 mb-3">
            Key Features
          </h4>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>AI-powered chat with custom tool integration</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Weather tool that can be invoked by the AI assistant</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>
                Structured tool definitions with Zod schemas for type safety
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>
                Custom transport configuration for specific API endpoints
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Step limiting to control tool execution flow</span>
            </li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-green-800 mb-3">
            Tool Definition
          </h4>
          <p className="text-green-700 mb-3">
            The weather tool demonstrates how to create custom tools that the AI
            can invoke:
          </p>
          <ul className="space-y-2 text-green-700">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Uses Zod schema for input validation and type safety</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>
                Provides clear description for AI to understand when to use the
                tool
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>
                Returns structured data that the AI can process and present to
                users
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
