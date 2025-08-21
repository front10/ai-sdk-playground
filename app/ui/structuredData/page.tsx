"use client";

import React, { useState, useRef, useEffect } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { recipeSchema } from "@/app/api/sctructuredData/schema";
import { ArrowLeft, Code } from "lucide-react";
import Link from "next/link";
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-orange-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                AI Recipe Generator
              </h1>
              <p className="text-sm text-gray-600">
                Create personalized recipes from any dish idea
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
        {showCode ? (
          <StructuredDataCode />
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-6">
            {!object?.recipe && !isLoading ? (
              <div className="flex items-center justify-center h-full min-h-96">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    What would you like to cook?
                  </h2>
                  <p className="text-lg text-gray-600 mb-2">
                    Enter any dish name and I&apos;ll generate a complete recipe
                    for you
                  </p>
                  <p className="text-sm text-gray-500">
                    Try &quot;Chicken Tikka Masala&quot;, &quot;Chocolate Chip
                    Cookies&quot;, or &quot;Caesar Salad&quot;
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
                      <button
                        onClick={handleStop}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
                      >
                        Stop
                      </button>
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
        <div className="bg-white/90 backdrop-blur-sm border-t border-orange-200 px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center gap-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl px-6 py-4 border border-orange-200">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
                <input
                  type="text"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter a dish name (e.g., Beef Stroganoff, Tiramisu, Fish Tacos...)"
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 text-lg"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!dishName.trim() || isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
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
                          d="M12 6v6l4 2"
                        />
                      </svg>
                      Generating...
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
                          d="M12 6v6l4 2"
                        />
                      </svg>
                      Create Recipe
                    </div>
                  )}
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-500 text-center mt-3">
              Press Enter to generate recipe • Powered by AI
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StructuredData;
