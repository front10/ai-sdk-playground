"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ImageIcon, Send, ArrowLeft, Code } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GenerateImageCode } from "./GenerateImageCode";

function GenerateImagePage() {
  const [prompt, setPrompt] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setImageSrc(null);
    setError(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const imageBase64 = await response.json();
      setImageSrc(`data:image/png;base64,${imageBase64}`);
      setPrompt("");
    } catch (error) {
      setError(
        `Error: ${
          error instanceof Error ? error.message : "Failed to generate image"
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
  }, [prompt]);

  const handleNewImage = () => {
    setPrompt("");
    setImageSrc(null);
    setError(null);
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
              AI Image Generator
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
            {imageSrc && !showCode && (
              <Button
                onClick={handleNewImage}
                className="bg-blue-500 hover:bg-blue-600"
              >
                New Image
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
          <GenerateImageCode />
        ) : (
          <div className="max-w-3xl mx-auto">
            {!imageSrc && !isLoading ? (
              <div className="flex items-center justify-center h-full px-4 py-10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Create stunning images with AI
                  </h2>
                  <p className="text-gray-500">
                    Describe your vision and watch it come to life
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
                        Generating your image...
                      </span>
                    </div>
                  </div>
                )}
                {imageSrc && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <Image
                      src={imageSrc}
                      alt="Generated Image"
                      width={1024}
                      height={1024}
                      className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
                      style={{ height: "auto" }}
                    />
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
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe the image you want to generate..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 max-h-48 resize-none"
                  rows={1}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={!prompt.trim() || isLoading}
                  size="icon"
                  className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300"
                >
                  <Send className="w-4 h-4" />
                </Button>
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

export default GenerateImagePage;
