"use client";

import React, { useState } from "react";
import { ArrowLeft, Code } from "lucide-react";
import Link from "next/link";
import { StructuredEnumCode } from "./StructuredEnumCode";

function StructuredEnum() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState<
    "positive" | "negative" | "neutral" | ""
  >("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [showCode, setShowCode] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/structured-enum", {
        method: "POST",
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      setSentiment(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "from-green-400 to-emerald-500";
      case "negative":
        return "from-red-400 to-rose-500";
      case "neutral":
        return "from-gray-400 to-slate-500";
      default:
        return "from-gray-400 to-slate-500";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return (
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "negative":
        return (
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "neutral":
        return (
          <svg
            className="w-8 h-8 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 10h.01M15 10h.01"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-blue-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                AI Sentiment Analyzer
              </h1>
              <p className="text-sm text-gray-600">
                Analyze the sentiment of your text with AI
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCode(!showCode)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Code className="w-4 h-4" />
              {showCode ? "Hide Code" : "View Code"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-400 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-red-700">Error: {error.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {!sentiment ? (
            <div className="flex items-center justify-center h-full min-h-96">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Analyze Your Text
                </h2>
                <p className="text-lg text-gray-600 mb-2">
                  Enter any text and I&apos;ll analyze its sentiment
                </p>
                <p className="text-sm text-gray-500">
                  Try phrases like &quot;I love this!&quot;, &quot;This is
                  terrible&quot;, or &quot;It&apos;s okay&quot;
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {isLoading && (
                <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-blue-500 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Analyzing sentiment...
                      </h3>
                      <p className="text-sm text-gray-600">
                        AI is processing your text
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {sentiment && !isLoading && (
                <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
                  {/* Result Header */}
                  <div
                    className={`bg-gradient-to-r ${getSentimentColor(
                      sentiment
                    )} px-8 py-6`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        {getSentimentIcon(sentiment)}
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-white mb-1 capitalize">
                          {sentiment} Sentiment
                        </h1>
                        <div className="flex items-center text-white/90">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">AI Analysis Complete</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Result Content */}
                  <div className="p-8">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Analyzed Text:
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        &quot;{text}&quot;
                      </p>
                    </div>

                    <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-8 h-8 bg-gradient-to-r ${getSentimentColor(
                            sentiment
                          )} rounded-lg flex items-center justify-center`}
                        >
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                          Sentiment Analysis Result
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        {getSentimentIcon(sentiment)}
                        <div>
                          <p className="text-lg font-semibold text-gray-800 capitalize">
                            {sentiment}
                          </p>
                          <p className="text-sm text-gray-600">
                            {sentiment === "positive" &&
                              "This text expresses positive emotions or opinions"}
                            {sentiment === "negative" &&
                              "This text expresses negative emotions or opinions"}
                            {sentiment === "neutral" &&
                              "This text is neutral and does not express any emotions or opinions"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/90 backdrop-blur-sm border-t border-blue-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl px-6 py-4 border border-blue-200">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
              </div>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your text to analyze (e.g., 'I'm having a great day!', 'This is frustrating'...)"
                className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 text-lg"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!text.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Analyze Sentiment
                  </div>
                )}
              </button>
            </div>
          </form>
          <p className="text-xs text-gray-500 text-center mt-3">
            Press Enter to analyze sentiment • Powered by AI
          </p>
        </div>
      </div>
    </div>
  );
}

export default StructuredEnum;
