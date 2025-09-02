import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { features } from "@/data/featured-tools";
import { ChevronRight, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <FlickeringGrid
          className="absolute inset-0 z-0 size-full"
          squareSize={10}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.3}
          flickerChance={0.1}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-white/80 to-gray-50/80"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
              AI SDK
            </span>
            <br />
            <span className="text-gray-900">Playground</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Explore the power of AI with Next.js and the AI SDK. Experience
            cutting-edge conversational AI, text completion, streaming
            responses, structured data generation, and real-time weather data
            integration.
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
              className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
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

      <footer className="relative z-10 border-t border-gray-200 py-12 bg-white">
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
              href="https://www.youtube.com/watch?v=iS5tZ9WdO0k"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
              Tutorial
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
