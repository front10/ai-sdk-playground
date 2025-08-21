"use client";

import React, { useRef, useState, useEffect } from "react";
import { Mic, Upload, ArrowLeft, File, Play, Pause } from "lucide-react";
import Link from "next/link";

interface TranscriptionResponse {
  text: string;
  segments?: {
    start: number;
    end: number;
    text: string;
  }[];
  language?: string;
  durationInSeconds?: number;
}

function TranscribeAudioPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] =
    useState<TranscriptionResponse | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!audioFile) {
      setError("Please select an audio file");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioFile);

      const response = await fetch("/api/transcribe-audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to transcribe audio");
      }

      const data = await response.json();
      setTranscription(data);

      // Reset playback state but keep audio file and URL
      setIsPlaying(false);
      setCurrentTime(0);
      // Don't reset duration as we want to keep it for the transcription result
    } catch (error) {
      setError(
        `Error: ${
          error instanceof Error ? error.message : "Failed to transcribe audio"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clean up previous audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      setAudioFile(file);
      setTranscription(null);
      setError(null);

      // Create new URL for audio playback
      const newAudioUrl = URL.createObjectURL(file);
      setAudioUrl(newAudioUrl);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  };

  const handleNewTranscription = () => {
    // Stop audio if playing
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }

    // Clean up audio URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    // Reset all states
    setAudioFile(null);
    setTranscription(null);
    setError(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          setError(
            "Unable to play audio. The file may be corrupted or in an unsupported format."
          );
        });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const clearSelectedFile = () => {
    // Stop audio if playing
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }

    // Clean up audio URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    // Reset file-related states
    setAudioFile(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Audio element - always present when we have an audioUrl */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          className="hidden"
          preload="metadata"
        />
      )}

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
              AI Audio Transcription
            </h1>
          </div>
          {transcription && (
            <button
              onClick={handleNewTranscription}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              New Transcription
            </button>
          )}
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
        <div className="max-w-3xl mx-auto">
          {!transcription && !isLoading ? (
            <div className="flex items-center justify-center h-full px-4 py-10">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Transcribe your audio with AI
                </h2>
                <p className="text-gray-500">
                  Upload an audio file and get accurate transcription powered by
                  Whisper
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
                      Transcribing your audio...
                    </span>
                  </div>
                </div>
              )}
              {transcription && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Transcription Result
                    </h3>
                    {(transcription.language ||
                      transcription.durationInSeconds) && (
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        {transcription.language && (
                          <span>Language: {transcription.language}</span>
                        )}
                        {transcription.durationInSeconds && (
                          <span>
                            Duration:{" "}
                            {formatDuration(transcription.durationInSeconds)}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Audio Player in Results */}
                    {audioUrl && audioFile && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <File className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {audioFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(audioFile.size)}
                              {duration > 0 && ` • ${formatDuration(duration)}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={togglePlayPause}
                            className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4 text-white" />
                            ) : (
                              <Play className="w-4 h-4 text-white ml-0.5" />
                            )}
                          </button>

                          <div className="flex-1 space-y-1">
                            <input
                              type="range"
                              min="0"
                              max={duration || 0}
                              value={currentTime}
                              onChange={handleSeek}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                                  duration ? (currentTime / duration) * 100 : 0
                                }%, #e5e7eb ${
                                  duration ? (currentTime / duration) * 100 : 0
                                }%, #e5e7eb 100%)`,
                              }}
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{formatDuration(currentTime)}</span>
                              <span>{formatDuration(duration)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {transcription.text}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          {/* File display and audio player if selected but not yet transcribed */}
          {audioFile && !transcription && (
            <div className="mb-3">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <File className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {audioFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(audioFile.size)}
                        {duration > 0 && ` • ${formatDuration(duration)}`}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearSelectedFile}
                    className="w-6 h-6 bg-gray-200 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors group"
                  >
                    <svg
                      className="w-3 h-3 text-gray-600 group-hover:text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Audio Player */}
                {audioUrl && (
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={togglePlayPause}
                      className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 text-white" />
                      ) : (
                        <Play className="w-4 h-4 text-white ml-0.5" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                            duration ? (currentTime / duration) * 100 : 0
                          }%, #e5e7eb ${
                            duration ? (currentTime / duration) * 100 : 0
                          }%, #e5e7eb 100%)`,
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{formatDuration(currentTime)}</span>
                        <span>{formatDuration(duration)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!transcription ? (
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-3">
                <label
                  htmlFor="audio-input"
                  className="cursor-pointer p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  id="audio-input"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />

                <div className="flex-1 text-gray-800 placeholder-gray-500">
                  {audioFile ? (
                    <span className="text-sm">
                      Ready to transcribe: {audioFile.name}
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      Click upload icon to select an audio file
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!audioFile || isLoading}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
                >
                  {isLoading ? "Transcribing..." : "Transcribe"}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Transcription completed! Use the audio player above to listen to
                your audio.
              </p>
            </div>
          )}
          <p className="text-xs text-gray-500 text-center mt-2">
            Supports MP3, WAV, M4A, and other audio formats
          </p>
        </div>
      </div>
    </div>
  );
}

export default TranscribeAudioPage;
