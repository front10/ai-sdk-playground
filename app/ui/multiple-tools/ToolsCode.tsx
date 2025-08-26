import React from "react";
import { CodeBlock } from "../../../components/ui/code-block";

const frontendCode = `"use client";

/** Imports */

function MultipleTools() {
  const { messages, sendMessage, status, error, stop } = useChat<ChatMessages>({
    transport: new DefaultChatTransport({
      api: "/api/multiple-tools",
    }),
  });

  const [prompt, setPrompt] = useState("");
  const [showCode, setShowCode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    sendMessage({
      text: prompt,
    });
    setPrompt("");
  };


  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header, sentiment analysis display, and input */}
         {message.parts.map((part, index) => {
            switch (part.type) {
             case "text":
                /** ... */
             case "tool-getWeather":
                   switch (part.state) {
                     case "input-streaming":   /** ... */
                     case "input-available":  /** ... */
                     case "output-available":  /** ... */
                     case "output-error":  /** ... */
             }

             case "tool-getLocation":
                   switch (part.state) {
                     case "input-streaming":   /** ... */
                     case "input-available":  /** ... */
                     case "output-available":  /** ... */
                     case "output-error":  /** ... */
             }
          })}
        </div>
    }
  );
  );
}

export default MultipleTools;`;

const backendCode = `/** Imports */

const tools = {
  getLocation: tool({
    description: "Get the location of the user",
    inputSchema: z.object({
      name: z.string().describe("The name of the user"),
    }),
    execute: async ({ name }) => {
      if (name === "John") {
        return {
          location: "New York, USA",
        };
      }
      if (name === "Jane") {
        return {
          location: "London, UK",
        };
      }

      return {
        location: "Unknown",
      };
    },
  }),

  getWeather: tool({
    description: "Get the current weather for a given location",
    inputSchema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
    execute: async ({ city }) => {
      // Simulate API delay for more realistic experience
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Mock weather data for demonstration
      const weatherData = {
        "New York": {
          temperature: 22,
          description: "Sunny",
          humidity: 65,
          windSpeed: 12,
        },
        London: {
          temperature: 15,
          description: "Cloudy",
          humidity: 75,
          windSpeed: 8,
        },
        Tokyo: {
          temperature: 28,
          description: "Clear",
          humidity: 70,
          windSpeed: 5,
        },
        Paris: {
          temperature: 18,
          description: "Partly cloudy",
          humidity: 60,
          windSpeed: 10,
        },
        Sydney: {
          temperature: 24,
          description: "Sunny",
          humidity: 55,
          windSpeed: 15,
        },
        Berlin: {
          temperature: 12,
          description: "Rainy",
          humidity: 80,
          windSpeed: 20,
        },
        "Gotham City": {
          temperature: 20,
          description: "Stormy",
          humidity: 90,
          windSpeed: 25,
        },
        Metropolis: {
          temperature: 10,
          description: "Overcast",
          humidity: 85,
          windSpeed: 30,
        },
      };

      const weather = weatherData[city as keyof typeof weatherData];

      if (weather) {
        return {
          location: city,
          temperature: weather.temperature,
          description: weather.description,
          humidity: weather.humidity,
          windSpeed: weather.windSpeed,
          unit: "celsius",
        };
      }

      // For unknown cities, return a generic response
      return {
        location: city,
        temperature: Math.floor(Math.random() * 30) + 5,
        description: "Variable conditions",
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        unit: "celsius",
        note: "Weather data may not be accurate for this location",
      };
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
      stopWhen: stepCountIs(4),
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
          Here&apos;s how the Multiple Tools feature is built using AI SDK and
          Next.js
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
            filename="app/ui/multiple-tools/page.tsx"
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
            filename="app/api/multiple-tools/route.ts"
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
              <span>AI-powered chat with multiple custom tool integration</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>
                Location tool that can retrieve user location based on name
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>
                Weather tool with comprehensive weather data for multiple cities
              </span>
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
              <span>
                Enhanced step limiting (4 steps) for more complex tool
                interactions
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-green-800 mb-3">
            Multiple Tool Definitions
          </h4>
          <p className="text-green-700 mb-3">
            The multiple tools demonstrate how to create and combine different
            tools that the AI can invoke:
          </p>
          <ul className="space-y-2 text-green-700">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Location Tool:</strong> Retrieves user location based on
                name with predefined mappings
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Weather Tool:</strong> Provides comprehensive weather
                data including temperature, humidity, and wind speed
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>
                Both tools use Zod schemas for input validation and type safety
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>
                Weather tool includes realistic API delay simulation and
                fallback data for unknown cities
              </span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>
                Tools can be used together in a single conversation for enhanced
                user experience
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
