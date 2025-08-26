"use client";

import React, { useState, useRef, useEffect } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { recipeSchema } from "@/app/api/sctructuredData/schema";
import { ArrowLeft, Code, Send } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StructuredDataCode } from "./StructuredDataCode";

function StructuredData() {
  const [dishName, setDishName] = useState("");
  const [showCode, setShowCode] = useState(false);
  const { submit, object, isLoading, error, stop } = useObject({
    api: "/api/sctructuredData",
    schema: recipeSchema,
  });
  console.log("🚀 ~ StructuredData ~ object:", object);
  const recipeRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!dishName.trim()) return;
    submit({
      dish: dishName,
    });
    setDishName("");
  };

  const handleStop = () => {
    stop();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  useEffect(() => {
    if (object?.recipe && recipeRef.current) {
      recipeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [object?.recipe]);

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
              AI Recipe Generator
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
        {showCode ? (
          <StructuredDataCode />
        ) : (
          <div className="max-w-3xl mx-auto">
            {!object?.recipe && !isLoading ? (
              <div className="flex items-center justify-center h-full px-4 py-10">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    What would you like to cook?
                  </h2>
                  <p className="text-gray-500">
                    Enter any dish name and I&apos;ll generate a complete recipe
                    for you
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {isLoading && (
                  <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-8">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-orange-500 animate-spin"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6l4 2"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Crafting your recipe...
                        </h3>
                        <p className="text-sm text-gray-600">
                          Our AI chef is preparing something delicious
                        </p>
                      </div>
                      <Button
                        onClick={handleStop}
                        variant="destructive"
                        className="px-4 py-2"
                      >
                        Stop
                      </Button>
                    </div>
                  </div>
                )}

                {object?.recipe && (
                  <div
                    ref={recipeRef}
                    className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden"
                  >
                    {/* Recipe Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6">
                      <h1 className="text-3xl font-bold text-white mb-2">
                        {object.recipe.name}
                      </h1>
                      <div className="flex items-center text-orange-100">
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
                        <span className="text-sm">AI Generated Recipe</span>
                      </div>
                    </div>

                    {/* Recipe Content */}
                    <div className="p-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Ingredients Section */}
                        <div>
                          <div className="flex items-center mb-6">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                              <svg
                                className="w-5 h-5 text-orange-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                              </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">
                              Ingredients
                            </h2>
                          </div>
                          <div className="space-y-3">
                            {object.recipe.ingredients?.map(
                              (ingredient, index) => (
                                <div
                                  key={index}
                                  className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                                >
                                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                                  <div className="flex-1">
                                    <span className="font-medium text-gray-800">
                                      {ingredient?.amount}
                                    </span>
                                    <span className="text-gray-600 ml-2">
                                      {ingredient?.name}
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* Instructions Section */}
                        <div>
                          <div className="flex items-center mb-6">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                              <svg
                                className="w-5 h-5 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">
                              Instructions
                            </h2>
                          </div>
                          <div className="space-y-4">
                            {object.recipe.steps?.map((step, index) => (
                              <div
                                key={index}
                                className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
                              >
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-bold text-white">
                                    {index + 1}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-gray-700 leading-relaxed">
                                    {Array.isArray(step)
                                      ? step.join(" ")
                                      : step}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
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
                <Input
                  type="text"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter a dish name..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={!dishName.trim() || isLoading}
                  size="icon"
                  className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
            <p className="text-xs text-gray-500 text-center mt-2">
              Press Enter to send
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StructuredData;
