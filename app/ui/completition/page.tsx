"use client";

import React, { useState, useRef, useEffect } from "react";
import { PenTool, Send, ArrowLeft, Code } from "lucide-react";
import Link from "next/link";
import { CompletitionCode } from "./CompletitionCode";

function Completition() {
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    setResponse("");
    setIsLoading(true);

    try {
      const apiResponse = await fetch("/api/completition", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ prompt: inputValue.trim() }),
      });
      const data = await apiResponse.json();
      console.log("🚀 ~ handleSubmit ~ data:", data);

      if (!apiResponse.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResponse(data.steps[0].content[0].text);
    } catch (error) {
      setResponse(
        `Error: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`
      );
    } finally {
      setIsLoading(false);
    }
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
  }, [inputValue]);

  const handleNewTask = () => {
    setInputValue("");
    setResponse("");
  };

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
              AI Assistant
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCode(!showCode)}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Code className="w-4 h-4" />
              {showCode ? "Hide Code" : "View Code"}
            </button>
            {response && !showCode && (
              <button
                onClick={handleNewTask}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                New Task
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto">
        {showCode ? (
          <CompletitionCode />
        ) : (
          <div className="max-w-3xl mx-auto">
            {!response && !isLoading ? (
              <div className="flex items-center justify-center h-full px-4 py-10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PenTool className="w-8 h-8 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    What task can I help you with?
                  </h2>
                  <p className="text-gray-500">
                    Describe your task and I&apos;ll provide assistance!
                  </p>
                </div>
              </div>
            ) : (
              <div className="px-4 py-6">
                {isLoading && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3">
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
                      <span className="text-gray-600">
                        Processing your task...
                      </span>
                    </div>
                  </div>
                )}
                {response && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
                      {response}
                    </div>
                  </div>
                )}
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
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your task..."
                  className="flex-1 bg-transparent resize-none border-none outline-none text-gray-800 placeholder-gray-500 max-h-48"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="w-8 h-8 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
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

export default Completition;
