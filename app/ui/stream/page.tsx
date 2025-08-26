"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCompletion } from "@ai-sdk/react";
import { Zap, Square, Send, ArrowLeft, Code } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StreamCode } from "./StreamCode";

function Stream() {
  const [showCode, setShowCode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    completion,
    input,
    handleInputChange,
    setInput,
    handleSubmit,
    isLoading,
    stop,
  } = useCompletion({
    api: "/api/stream",
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      setInput("");
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
  }, [input]);

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
              AI Assistant Stream
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

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto">
        {showCode ? (
          <StreamCode />
        ) : (
          <div className="max-w-3xl mx-auto">
            {!completion && !isLoading ? (
              <div className="flex items-center justify-center h-full px-4  py-10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-gray-400" />
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
                {completion && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
                      {completion}
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
                setInput("");
              }}
              className="relative"
            >
              <div className="flex items-end gap-3 bg-gray-100 rounded-2xl px-4 py-3">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your task..."
                  className="flex-1 bg-transparent resize-none border-none outline-none text-gray-800 placeholder-gray-500 max-h-48"
                  rows={1}
                  disabled={isLoading}
                />
                {isLoading ? (
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
                    disabled={!input.trim()}
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

export default Stream;
