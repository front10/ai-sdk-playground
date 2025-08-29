"use client";

import React, { useState, useRef, useEffect } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { pokemonUISchema } from "@/app/api/structured-array/schema";
import { ArrowLeft, ClipboardList, Code, Send } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StructuredArrayCode } from "./StructuredArrayCode";
import { Textarea } from "@/components/ui/textarea";

function StructuredData() {
  const [pokemonType, setPokemonType] = useState("");
  const [showCode, setShowCode] = useState(false);
  const { submit, object, isLoading, error, stop } = useObject({
    api: "/api/structured-array",
    schema: pokemonUISchema,
  });
  const pokemonListRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
  }, [pokemonType]);

  useEffect(() => {
    if (object && object.length > 0 && pokemonListRef.current) {
      pokemonListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [object]);

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
              Pokemon Generator
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
          <div className="max-w-3xl mx-auto">
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
          <div className="max-w-3xl mx-auto">
            {!object && !isLoading ? (
              <div className="flex items-center justify-center h-full px-4 py-10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="w-8 h-8 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    What type of Pokemon would you like?
                  </h2>
                  <p className="text-gray-500">
                    Enter a Pokemon type and I&apos;ll generate 5 Pokemon for
                    you with structured arrays!
                  </p>
                  <div className="mt-6 space-y-3">
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Try these examples
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        &ldquo;Fire&rdquo;
                      </div>
                      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        &ldquo;Water&rdquo;
                      </div>
                      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        &ldquo;Electric&rdquo;
                      </div>
                    </div>
                  </div>
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

                {object && object.length > 0 && (
                  <div
                    ref={pokemonListRef}
                    className="bg-white rounded-2xl shadow-xl border border-blue-100 my-8 overflow-hidden"
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
        <div className="bg-white border-t border-gray-200 px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-end gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                <Textarea
                  value={pokemonType}
                  onChange={(e) => setPokemonType(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter a Pokemon type..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 max-h-48 resize-none"
                  rows={1}
                  disabled={isLoading}
                  ref={textareaRef}
                />
                <Button
                  type="submit"
                  disabled={!pokemonType.trim() || isLoading}
                  size="icon"
                  className="w-10 h-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:hover:scale-100"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
            <p className="text-xs text-gray-500 text-center mt-3">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StructuredData;
