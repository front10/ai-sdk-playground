"use client";

import React, { useState, useRef, useEffect } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { pokemonUISchema } from "@/app/api/structured-array/schema";
import { ArrowLeft, Code } from "lucide-react";
import Link from "next/link";
import { StructuredArrayCode } from "./StructuredArrayCode";

function StructuredData() {
  const [pokemonType, setPokemonType] = useState("");
  const [showCode, setShowCode] = useState(false);
  const { submit, object, isLoading, error, stop } = useObject({
    api: "/api/structured-array",
    schema: pokemonUISchema,
  });
  const pokemonListRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pokemonType.trim()) return;
    submit({
      type: pokemonType,
    });
    setPokemonType("");
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
    if (object && object.length > 0 && pokemonListRef.current) {
      pokemonListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [object]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50">
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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
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
                Pokemon Generator
              </h1>
              <p className="text-sm text-gray-600">
                Generate Pokemon by type with AI
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
          <StructuredArrayCode />
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-6">
            {!object && !isLoading ? (
              <div className="flex items-center justify-center h-full min-h-96">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
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
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    What type of Pokemon would you like?
                  </h2>
                  <p className="text-lg text-gray-600 mb-2">
                    Enter a Pokemon type and I&apos;ll generate 5 Pokemon for
                    you
                  </p>
                  <p className="text-sm text-gray-500">
                    Try &quot;fire&quot;, &quot;water&quot;,
                    &quot;electric&quot;, or &quot;psychic&quot;
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {isLoading && (
                  <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
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
                              d="M12 6v6l4 2"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Generating Pokemon...
                        </h3>
                        <p className="text-sm text-gray-600">
                          Creating your Pokemon team
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

                {object && object.length > 0 && (
                  <div
                    ref={pokemonListRef}
                    className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden"
                  >
                    {/* Pokemon List Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-6">
                      <h1 className="text-3xl font-bold text-white mb-2">
                        Generated Pokemon
                      </h1>
                      <div className="flex items-center text-blue-100">
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
                        <span className="text-sm">AI Generated Pokemon</span>
                      </div>
                    </div>

                    {/* Pokemon List Content */}
                    <div className="p-8">
                      <div className="grid gap-6">
                        {object.map((pokemon, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-lg">
                                  {index + 1}
                                </span>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                  {pokemon?.name}
                                </h3>
                                {pokemon?.abilities &&
                                  pokemon.abilities.length > 0 && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-gray-600 mb-2">
                                        Abilities:
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                        {pokemon.abilities.map(
                                          (ability, abilityIndex) => (
                                            <span
                                              key={abilityIndex}
                                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                            >
                                              {ability}
                                            </span>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))}
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
        <div className="bg-white/90 backdrop-blur-sm border-t border-blue-200 px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl px-6 py-4 border border-blue-200">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
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
                  value={pokemonType}
                  onChange={(e) => setPokemonType(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter a Pokemon type (e.g., fire, water, electric, grass...)"
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 text-lg"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!pokemonType.trim() || isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
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
                      Generate Pokemon
                    </div>
                  )}
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-500 text-center mt-3">
              Press Enter to generate Pokemon • Powered by AI
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StructuredData;
