import Image from "next/image";
import Link from "next/link";
import {
  MessageCircle,
  PenTool,
  Zap,
  Settings,
  ClipboardList,
  Target,
  ImageIcon,
  Palette,
  Mic,
  ChevronRight,
  FileText,
  ExternalLink,
  Globe,
  Volume2,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      title: "AI Chat",
      description:
        "Interactive conversational AI with real-time messaging and context awareness.",
      href: "/ui/chat",
      icon: MessageCircle,
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
    },
    {
      title: "Text Completion",
      description:
        "Advanced text completion powered by AI for creative writing and content generation.",
      href: "/ui/completition",
      icon: PenTool,
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
    },
    {
      title: "AI Image Generation",
      description:
        "Create stunning, high-quality images from text descriptions using advanced AI models.",
      href: "/ui/generateImage",
      icon: Palette,
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-50 to-purple-50",
    },
    {
      title: "Audio Transcription",
      description:
        "Convert speech to text with high accuracy using advanced AI-powered transcription.",
      href: "/ui/transcribeAudio",
      icon: Mic,
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50",
    },
    {
      title: "Speech Generation",
      description:
        "Convert text to natural-sounding speech using advanced AI-powered text-to-speech technology.",
      href: "/ui/generateSpeech",
      icon: Volume2,
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-50",
    },
    {
      title: "Streaming Responses",
      description:
        "Real-time streaming AI responses for dynamic and engaging user experiences.",
      href: "/ui/stream",
      icon: Zap,
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50",
    },
    {
      title: "Structured Data",
      description:
        "Generate structured content like recipes with AI-powered object generation.",
      href: "/ui/structuredData",
      icon: Settings,
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-50 to-red-50",
    },
    {
      title: "Structured Arrays",
      description:
        "Generate structured arrays of data like Pokemon lists with AI-powered collection generation.",
      href: "/ui/structuredArray",
      icon: ClipboardList,
      gradient: "from-indigo-500 to-blue-600",
      bgGradient: "from-indigo-50 to-blue-50",
    },
    {
      title: "Structured Enums",
      description:
        "Classify and analyze text sentiment using AI-powered enum generation with predefined categories.",
      href: "/ui/structuredEnum",
      icon: Target,
      gradient: "from-teal-500 to-cyan-600",
      bgGradient: "from-teal-50 to-cyan-50",
    },
    {
      title: "Multi-Modal Chat",
      description:
        "Advanced AI chat with support for text, images, and multiple input types for rich conversations.",
      href: "/ui/multi-modal-chat",
      icon: ImageIcon,
      gradient: "from-rose-500 to-pink-600",
      bgGradient: "from-rose-50 to-pink-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              AI SDK
            </span>
            <br />
            <span className="text-gray-900">Playground</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Explore the power of AI with Next.js and the AI SDK. Experience
            cutting-edge conversational AI, text completion, streaming
            responses, and structured data generation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Powered by AI SDK & Next.js
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
              ></div>

              <div className="relative p-8">
                <div className="mb-4">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} text-white mb-4`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700">
                    {feature.description}
                  </p>
                </div>

                <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-gray-600">
                  Try it out
                  <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-8 items-center justify-center text-sm text-gray-500">
            <a
              className="flex items-center gap-2 hover:text-gray-700 transition-colors"
              href="https://nextjs.org/learn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText className="w-4 h-4" />
              Learn Next.js
            </a>
            <a
              className="flex items-center gap-2 hover:text-gray-700 transition-colors"
              href="https://sdk.vercel.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
              AI SDK Docs
            </a>
            <a
              className="flex items-center gap-2 hover:text-gray-700 transition-colors"
              href="https://vercel.com/templates"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe className="w-4 h-4" />
              More Templates
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
