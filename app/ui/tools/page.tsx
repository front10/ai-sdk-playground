"use client";

import { ChatMessages } from "@/app/api/tools/route";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowLeft, Code, MessageCircle, Send, Square } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ToolsCode } from "./ToolsCode";

function Tools() {
  const { messages, sendMessage, status, error, stop } = useChat<ChatMessages>({
    transport: new DefaultChatTransport({
      api: "/api/tools",
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [prompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">
              AI Assistant Chat
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowCode(!showCode)}
              variant="ghost"
              className="flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              {showCode ? "Hide Code" : "View Code"}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">Error: {error.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        {showCode ? (
          <ToolsCode />
        ) : (
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full px-4 py-10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Start a conversation
                  </h2>
                  <p className="text-gray-500">
                    Send a message to begin chatting with the AI assistant
                  </p>
                </div>
              </div>
            ) : (
              <div className="px-4 py-6 space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-white border border-gray-200 text-gray-800 shadow-sm"
                      }`}
                    >
                      {message.parts.map((part, index) => {
                        switch (part.type) {
                          case "text":
                            return (
                              <div
                                key={`${message.id}-${index}`}
                                className="whitespace-pre-wrap leading-relaxed"
                              >
                                {part.text}
                              </div>
                            );

                          case "tool-getWeather":
                            switch (part.state) {
                              case "input-streaming":
                                return (
                                  <div
                                    key={`${message.id}-${index}`}
                                    className="mt-3 first:mt-0"
                                  >
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium text-amber-800">
                                          Processing Weather Request
                                        </span>
                                      </div>
                                      <p className="text-amber-700 text-sm mb-2">
                                        Receiving weather request for{" "}
                                        <span className="font-semibold">
                                          {part.input?.city}
                                        </span>
                                      </p>
                                      <div className="bg-amber-100 rounded p-2">
                                        <pre className="text-xs text-amber-800 overflow-x-auto">
                                          {JSON.stringify(part.input, null, 2)}
                                        </pre>
                                      </div>
                                    </div>
                                  </div>
                                );

                              case "input-available":
                                return (
                                  <div
                                    key={`${message.id}-${index}`}
                                    className="mt-3 first:mt-0"
                                  >
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium text-blue-800">
                                          Fetching Weather Data
                                        </span>
                                      </div>
                                      <p className="text-blue-700 text-sm">
                                        Getting weather for{" "}
                                        <span className="font-semibold">
                                          {part.input?.city}
                                        </span>
                                        ...
                                      </p>
                                    </div>
                                  </div>
                                );

                              case "output-available":
                                return (
                                  <div
                                    key={`${message.id}-${index}`}
                                    className="mt-3 first:mt-0"
                                  >
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                      <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-green-800">
                                          Weather Information
                                        </span>
                                      </div>
                                      <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm text-green-700 font-medium">
                                            Location:
                                          </span>
                                          <span className="text-sm text-green-800">
                                            {part.output?.location}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm text-green-700 font-medium">
                                            Temperature:
                                          </span>
                                          <span className="text-sm text-green-800">
                                            {part.output?.temperature}°
                                            {part.output?.unit === "celsius"
                                              ? "C"
                                              : "F"}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm text-green-700 font-medium">
                                            Conditions:
                                          </span>
                                          <span className="text-sm text-green-800">
                                            {part.output?.description}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm text-green-700 font-medium">
                                            Humidity:
                                          </span>
                                          <span className="text-sm text-green-800">
                                            {part.output?.humidity}%
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm text-green-700 font-medium">
                                            Wind Speed:
                                          </span>
                                          <span className="text-sm text-green-800">
                                            {part.output?.windSpeed} km/h
                                          </span>
                                        </div>
                                        {part.output?.note && (
                                          <div className="mt-3 p-2 bg-green-100 rounded border-l-2 border-green-300">
                                            <p className="text-xs text-green-700 italic">
                                              {part.output.note}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );

                              case "output-error":
                                return (
                                  <div
                                    key={`${message.id}-${index}`}
                                    className="mt-3 first:mt-0"
                                  >
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-red-800">
                                          Weather Request Failed
                                        </span>
                                      </div>
                                      <p className="text-red-700 text-sm">
                                        {part.errorText}
                                      </p>
                                    </div>
                                  </div>
                                );
                            }

                          default:
                            return null;
                        }
                      })}
                    </div>
                  </div>
                ))}

                {(status === "submitted" || status === "streaming") && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">
                          AI is typing...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      {!showCode && (
        <div className="bg-white border-t border-gray-200 px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-end gap-3 bg-gray-100 rounded-2xl px-4 py-3">
                <Textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 max-h-48 resize-none"
                  rows={1}
                  disabled={status === "submitted" || status === "streaming"}
                />
                {status === "streaming" ? (
                  <Button
                    type="button"
                    onClick={stop}
                    variant="destructive"
                    size="icon"
                    className="w-8 h-8 rounded-full"
                  >
                    <Square className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!prompt.trim() || status !== "ready"}
                    size="icon"
                    className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </form>
            <p className="text-xs text-gray-500 text-center mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tools;
