"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, Play, ArrowLeft, Send, Code } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GenerateSpeechCode } from "./GenerateSpeechCode";

function GenerateSpeech() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAudio, setHasAudio] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const audioURlRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);

    if (audioURlRef.current) {
      URL.revokeObjectURL(audioURlRef.current);
      audioURlRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    try {
      const response = await fetch("/api/generate-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }

      const audioBlob = await response.blob();
      audioURlRef.current = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioURlRef.current);

      setHasAudio(true);
      audioRef.current.play();
    } catch (err) {
      console.error("Speech generation error:", err);
      setError("Failed to generate speech. Please try again.");
      setHasAudio(false);
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
  }, [text]);

  const replayAudio = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const handleNewGeneration = () => {
    setText("");
    setHasAudio(false);
    setError(null);
    if (audioURlRef.current) {
      URL.revokeObjectURL(audioURlRef.current);
      audioURlRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (audioURlRef.current) {
        URL.revokeObjectURL(audioURlRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

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
              AI Speech Generation
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
            {hasAudio && !showCode && (
              <Button
                onClick={handleNewGeneration}
                className="bg-blue-500 hover:bg-blue-600"
              >
                New Generation
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto">
        {showCode ? (
          <GenerateSpeechCode />
        ) : (
          <div className="max-w-3xl mx-auto">
            {!hasAudio && !isLoading ? (
              <div className="flex items-center justify-center h-full px-4 py-10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Volume2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Convert Text to Speech
                  </h2>
                  <p className="text-gray-500">
                    Enter some text and I&apos;ll generate natural-sounding speech for you!
                  </p>
                  <div className="mt-6 space-y-3">
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Try these examples
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        &ldquo;Hello, welcome to our AI assistant!&rdquo;
                      </div>
                      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        &ldquo;The quick brown fox jumps over the lazy dog&rdquo;
                      </div>
                      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        &ldquo;Today is a beautiful day for learning&rdquo;
                      </div>
                    </div>
                  </div>
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
                        Generating speech...
                      </span>
                    </div>
                  </div>
                )}
                {hasAudio && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Speech Generated Successfully
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Your text has been converted to speech and played
                          automatically.
                        </p>
                      </div>
                      <Button
                        onClick={replayAudio}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                      >
                        <Play className="w-4 h-4" />
                        Replay
                      </Button>
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
                <Textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter text to convert to speech..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 max-h-48 resize-none"
                  rows={1}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={!text.trim() || isLoading}
                  size="icon"
                  className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
            <p className="text-xs text-gray-500 text-center mt-2">
              Press Enter to generate, Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default GenerateSpeech;
