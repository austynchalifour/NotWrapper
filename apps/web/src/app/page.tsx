'use client'

import { useState, useEffect } from 'react'
import { Search, Zap, Shield, Trophy, ArrowRight, User } from 'lucide-react'
import Link from 'next/link'
import ScanForm from '@/components/ScanForm'
import VerdictBadge from '@/components/VerdictBadge'
import { createClient } from '@/lib/supabase'

export default function HomePage() {
  const [showScanner, setShowScanner] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  useEffect(() => {
    // Check if user is signed in
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const supabase = createClient()
    
    if (isSignUp) {
      // Sign up with email and password
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/marketplace`,
        },
      })
      
      if (error) {
        console.error('Error signing up:', error.message)
        alert(`Sign up failed: ${error.message}`)
      } else {
        alert('Sign up successful! Please check your email to verify your account.')
        setShowSignIn(false)
        setEmail('')
        setPassword('')
      }
    } else {
      // Sign in with email and password
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Error signing in:', error.message)
        alert(`Sign in failed: ${error.message}`)
      } else {
        setShowSignIn(false)
        setEmail('')
        setPassword('')
        // Refresh user state
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      }
    }
    
    setLoading(false)
  }
  
  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
  }

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
            <Link href="/docs" className="font-mono text-sm hover:text-neon transition-colors">
              Docs
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <Link 
                href="/profile"
                className="btn-secondary flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
            ) : (
              <button 
                onClick={() => setShowSignIn(true)}
                className="btn-secondary"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold font-mono leading-tight">
            <span className="text-white">Detect AI</span>
            <br />
            <span className="text-neon glitch-text animate-pulse-neon">WRAPPERS</span>
            <br />
            <span className="text-white">In Seconds</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Find out if that "revolutionary AI tool" is actually built from scratch or just 
            a fancy wrapper around OpenAI + Webflow.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => setShowScanner(true)}
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Scan a Tool</span>
            </button>
            
            <Link href="/marketplace" className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2">
              <span>Browse Marketplace</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Scanner Modal */}
        {showScanner && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-terminal-gray border border-neon rounded-lg max-w-2xl w-full p-8 relative">
              <button
                onClick={() => setShowScanner(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                ✕
              </button>
              <h2 className="text-2xl font-mono font-bold mb-6">
                <span className="text-neon">[</span> Scan Tool <span className="text-neon">]</span>
              </h2>
              <ScanForm />
            </div>
          </div>
        )}

        {/* Sign In Modal */}
        {showSignIn && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-terminal-gray border border-neon rounded-lg max-w-md w-full p-8 relative">
              <button
                onClick={() => {
                  setShowSignIn(false)
                  setEmail('')
                  setPassword('')
                  setIsSignUp(false)
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                ✕
              </button>
              <h2 className="text-2xl font-mono font-bold mb-6">
                <span className="text-neon">[</span> {isSignUp ? 'Sign Up' : 'Sign In'} <span className="text-neon">]</span>
              </h2>
              
              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block font-mono text-sm mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-black/50 border border-terminal-border rounded font-mono text-white focus:border-neon focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block font-mono text-sm mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 bg-black/50 border border-terminal-border rounded font-mono text-white focus:border-neon focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary"
                >
                  {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-mono text-sm text-gray-400 hover:text-neon transition-colors"
                >
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card">
            <div className="w-12 h-12 bg-neon/20 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-neon" />
            </div>
            <h3 className="text-xl font-mono font-bold mb-2">WrapperCheck™</h3>
            <p className="text-gray-400">
              Scan any URL. Get instant verdict. See the receipts. 
              Our engine detects Webflow, Bubble, Zapier, exposed API keys, and more.
            </p>
          </div>

          <div className="card">
            <div className="w-12 h-12 bg-neon/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-neon" />
            </div>
            <h3 className="text-xl font-mono font-bold mb-2">Certified Badge</h3>
            <p className="text-gray-400">
              Pass the test? Get a "Certified NotWrapper™" badge. 
              Embed it on your site to prove you built something real.
            </p>
          </div>

          <div className="card">
            <div className="w-12 h-12 bg-neon/20 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-neon" />
            </div>
            <h3 className="text-xl font-mono font-bold mb-2">LiveHunt Mode</h3>
            <p className="text-gray-400">
              Record your investigation. Narrate findings. Share proof. 
              Climb the leaderboard for exposing wrappers.
            </p>
          </div>
        </div>
      </section>

      {/* Example Verdicts */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-mono font-bold text-center mb-12">
          <span className="text-neon">&gt;_</span> How It Works
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="card flex items-center justify-between">
            <div>
              <h4 className="font-mono font-bold mb-1">ShipFast AI</h4>
              <p className="text-sm text-gray-400">shipfast-ai.com</p>
            </div>
            <VerdictBadge verdict="NotWrapper" confidence={85} />
          </div>

          <div className="card flex items-center justify-between">
            <div>
              <h4 className="font-mono font-bold mb-1">WrapperGPT Pro</h4>
              <p className="text-sm text-gray-400">wrappergpt.com</p>
            </div>
            <VerdictBadge verdict="Wrapper Confirmed" confidence={95} />
          </div>

          <div className="card flex items-center justify-between">
            <div>
              <h4 className="font-mono font-bold mb-1">CodeGen Studio</h4>
              <p className="text-sm text-gray-400">codegen.example.com</p>
            </div>
            <VerdictBadge verdict="Wrapper Sus" confidence={60} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="card text-center max-w-3xl mx-auto neon-border">
          <h2 className="text-3xl font-mono font-bold mb-4">
            Built something <span className="text-neon">real</span>?
          </h2>
          <p className="text-gray-400 mb-8">
            Scan your tool, get certified, and show the world you're not a wrapper.
          </p>
          <button 
            onClick={() => setShowScanner(true)}
            className="btn-primary text-lg px-8 py-4"
          >
            Get Your Badge
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-terminal-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="font-mono text-sm text-gray-400">
              © 2024 NotWrapper. Built by real devs, for real devs.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-neon transition-colors">
                GitHub
              </a>
              <a href="#" className="text-gray-400 hover:text-neon transition-colors">
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

