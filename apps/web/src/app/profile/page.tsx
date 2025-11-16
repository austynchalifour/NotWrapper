'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, Search, LogOut, User, Calendar } from 'lucide-react'
import VerdictBadge from '@/components/VerdictBadge'
import { createClient } from '@/lib/supabase'

type Scan = {
  id: string
  tool_id: string
  verdict: 'NotWrapper' | 'Wrapper Sus' | 'Wrapper Confirmed'
  confidence: number
  created_at: string
  tool: {
    id: string
    name: string
    url: string
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [scans, setScans] = useState<Scan[]>([])

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/')
      return
    }

    setUser(user)
    await fetchUserScans(user.id)
    setLoading(false)
  }

  const fetchUserScans = async (userId: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('scans')
        .select(`
          id,
          tool_id,
          verdict,
          confidence,
          created_at,
          tool:tools (
            id,
            name,
            url
          )
        `)
        .eq('scanned_by', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setScans(data || [])
    } catch (error) {
      console.error('Error fetching scans:', error)
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
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
            <Link href="/profile" className="btn-secondary flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
            <button 
              onClick={handleSignOut}
              className="btn-secondary flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-neon/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-neon" />
            </div>
            <div>
              <h1 className="text-3xl font-mono font-bold">{user?.email}</h1>
              <p className="text-gray-400 font-mono text-sm">
                Member since {new Date(user?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold font-mono text-neon">{scans.length}</p>
                <p className="text-sm text-gray-400 font-mono">Total Scans</p>
              </div>
              <Search className="w-8 h-8 text-neon/30" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold font-mono text-green-500">
                  {scans.filter(s => s.verdict === 'NotWrapper').length}
                </p>
                <p className="text-sm text-gray-400 font-mono">NotWrapper</p>
              </div>
              <div className="text-4xl">✓</div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold font-mono text-red-500">
                  {scans.filter(s => s.verdict === 'Wrapper Confirmed').length}
                </p>
                <p className="text-sm text-gray-400 font-mono">Wrappers Found</p>
              </div>
              <div className="text-4xl">✗</div>
            </div>
          </div>
        </div>

        {/* Scans History */}
        <div>
          <h2 className="text-2xl font-mono font-bold mb-6">
            <span className="text-neon">&gt;_</span> Your Scans
          </h2>

          {scans.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-400 font-mono mb-4">No scans yet</p>
              <Link href="/" className="btn-primary inline-flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Scan Your First Tool</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {scans.map((scan) => (
                <Link
                  key={scan.id}
                  href={`/tools/${scan.tool_id}`}
                  className="card hover:border-neon transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-mono font-bold group-hover:text-neon transition-colors">
                          {scan.tool.name}
                        </h3>
                        <VerdictBadge 
                          verdict={scan.verdict} 
                          confidence={scan.confidence}
                          size="sm"
                        />
                      </div>
                      <p className="text-sm text-gray-500 font-mono mb-2">
                        {scan.tool.url}
                      </p>
                      <div className="flex items-center space-x-2 text-xs font-mono text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>Scanned on {new Date(scan.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

