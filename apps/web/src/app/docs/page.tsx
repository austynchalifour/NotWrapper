'use client'

import Link from 'next/link'
import { Zap, ArrowLeft, Terminal, Shield, Trophy, Webhook, Code, BookOpen } from 'lucide-react'

export default function DocsPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-terminal-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-neon" />
            <span className="font-mono text-xl font-bold glitch-text">
              NOT<span className="text-neon">WRAPPER</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/marketplace" className="font-mono text-sm hover:text-neon transition-colors">
              Marketplace
            </Link>
            <Link href="/leaderboard" className="font-mono text-sm hover:text-neon transition-colors">
              Leaderboard
            </Link>
            <Link href="/docs" className="font-mono text-sm text-neon">
              Docs
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/" className="btn-secondary flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Docs Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold font-mono mb-4">
            <span className="text-neon">&gt;_</span> Documentation
          </h1>
          <p className="text-xl text-gray-400 mb-12">
            Everything you need to know about detecting AI wrappers
          </p>

          {/* Quick Start */}
          <div className="card mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Terminal className="w-6 h-6 text-neon" />
              <h2 className="text-2xl font-mono font-bold">Quick Start</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                NotWrapper is a tool for detecting whether an AI tool is genuinely built from scratch 
                or just a wrapper around existing APIs and no-code platforms.
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Enter the URL of the tool you want to scan</li>
                <li>Click "Scan Tool" to start the analysis</li>
                <li>Review the verdict and detailed breakdown</li>
                <li>Share results or claim your badge if you pass</li>
              </ol>
            </div>
          </div>

          {/* What We Detect */}
          <div className="card mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-neon" />
              <h2 className="text-2xl font-mono font-bold">What We Detect</h2>
            </div>
            <div className="space-y-4">
              <div className="border-l-2 border-neon pl-4">
                <h3 className="font-mono font-bold text-lg mb-2">No-Code Platforms</h3>
                <p className="text-gray-400">
                  Webflow, Bubble, Wix, Squarespace, Framer, and other no-code/low-code builders
                </p>
              </div>
              
              <div className="border-l-2 border-yellow-500 pl-4">
                <h3 className="font-mono font-bold text-lg mb-2">API Wrappers</h3>
                <p className="text-gray-400">
                  Direct OpenAI, Anthropic, or other LLM API calls without significant custom logic
                </p>
              </div>
              
              <div className="border-l-2 border-red-500 pl-4">
                <h3 className="font-mono font-bold text-lg mb-2">Exposed Secrets</h3>
                <p className="text-gray-400">
                  API keys, tokens, and other sensitive information leaked in client-side code
                </p>
              </div>
              
              <div className="border-l-2 border-blue-500 pl-4">
                <h3 className="font-mono font-bold text-lg mb-2">Integration Tools</h3>
                <p className="text-gray-400">
                  Zapier, Make (Integromat), n8n, and other workflow automation platforms
                </p>
              </div>
            </div>
          </div>

          {/* Verdicts Explained */}
          <div className="card mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Trophy className="w-6 h-6 text-neon" />
              <h2 className="text-2xl font-mono font-bold">Verdicts Explained</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-mono font-bold text-neon mb-2">✓ NotWrapper (Certified)</h3>
                <p className="text-gray-400">
                  Confidence: 80%+. The tool appears to be genuinely built with custom code. 
                  Eligible for certification badge.
                </p>
              </div>
              
              <div>
                <h3 className="font-mono font-bold text-yellow-500 mb-2">⚠ Wrapper Sus</h3>
                <p className="text-gray-400">
                  Confidence: 50-79%. Some wrapper indicators detected, but not conclusive. 
                  May have custom features mixed with no-code elements.
                </p>
              </div>
              
              <div>
                <h3 className="font-mono font-bold text-red-500 mb-2">✗ Wrapper Confirmed</h3>
                <p className="text-gray-400">
                  Confidence: 80%+. Strong evidence of wrapper patterns. Little to no custom development detected.
                </p>
              </div>
            </div>
          </div>

          {/* API Access */}
          <div className="card mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Code className="w-6 h-6 text-neon" />
              <h2 className="text-2xl font-mono font-bold">API Access</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-400">
                Integrate NotWrapper scans into your own applications with our API.
              </p>
              
              <div className="bg-black/50 rounded p-4 font-mono text-sm">
                <div className="text-gray-500 mb-2"># Scan a tool</div>
                <div className="text-neon">POST</div> <span className="text-white">https://api.notwrapper.dev/scan</span>
                <pre className="mt-4 text-gray-300">
{`{
  "url": "https://example.com",
  "depth": "full"
}`}
                </pre>
              </div>
              
              <p className="text-sm text-gray-500">
                API documentation and authentication coming soon. Join our Discord for early access.
              </p>
            </div>
          </div>

          {/* LiveHunt Mode */}
          <div className="card mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Webhook className="w-6 h-6 text-neon" />
              <h2 className="text-2xl font-mono font-bold">LiveHunt Mode</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-400">
                LiveHunt lets you record video investigations of AI tools and share your findings with the community.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
                <li>Record your investigation process</li>
                <li>Add voice narration explaining your findings</li>
                <li>Submit hunts to earn points on the leaderboard</li>
                <li>Get upvoted by the community for quality content</li>
              </ul>
            </div>
          </div>

          {/* FAQ */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="w-6 h-6 text-neon" />
              <h2 className="text-2xl font-mono font-bold">FAQ</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-mono font-bold mb-2">Is using a no-code tool bad?</h3>
                <p className="text-gray-400">
                  No! No-code tools are amazing for rapid prototyping and MVPs. NotWrapper just helps 
                  distinguish between genuinely custom-built products and quick no-code assemblies.
                </p>
              </div>
              
              <div>
                <h3 className="font-mono font-bold mb-2">How accurate is the detection?</h3>
                <p className="text-gray-400">
                  Our detection engine has been tested on hundreds of tools. While no automated system is 
                  100% accurate, we provide confidence scores and detailed evidence for transparency.
                </p>
              </div>
              
              <div>
                <h3 className="font-mono font-bold mb-2">Can I contest a verdict?</h3>
                <p className="text-gray-400">
                  Yes! If you believe your tool was incorrectly flagged, you can request a manual review 
                  through our Discord community. Provide code samples or architecture details for review.
                </p>
              </div>
              
              <div>
                <h3 className="font-mono font-bold mb-2">How do I get certified?</h3>
                <p className="text-gray-400">
                  Scan your tool and achieve an 80%+ "NotWrapper" confidence score. You'll receive an 
                  embeddable badge and can list your tool in our marketplace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-terminal-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="font-mono text-sm text-gray-400">
              © 2024 NotWrapper. Built by real devs, for real devs.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-neon transition-colors">
                GitHub
              </a>
              <a href="https://x.com/notwrapper?s=20" className="text-gray-400 hover:text-neon transition-colors">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-neon transition-colors">
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

