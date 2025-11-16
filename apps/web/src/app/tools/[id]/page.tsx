'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Zap, ArrowLeft, ExternalLink, Calendar, User, Search, TrendingUp } from 'lucide-react'
import VerdictBadge from '@/components/VerdictBadge'

type Tool = {
  id: string
  name: string
  url: string
  description: string
  latest_verdict: 'NotWrapper' | 'Wrapper Sus' | 'Wrapper Confirmed'
  transparency_score: number
  total_scans: number
  total_votes: number
  created_at: string
  submitted_by_profile?: {
    username: string
    display_name: string
  }
  scans: Array<{
    id: string
    verdict: string
    confidence: number
    created_at: string
    scanned_by_profile?: {
      username: string
      display_name: string
    }
  }>
  badges: Array<{
    id: string
    badge_type: string
    issued_at: string
    is_revoked: boolean
  }>
}

export default function ToolDetailsPage() {
  const params = useParams()
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchTool(params.id as string)
    }
  }, [params.id])

  const fetchTool = async (id: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3003'
      const response = await fetch(`${backendUrl}/api/tools/${id}`)
      
      if (!response.ok) {
        throw new Error('Tool not found')
      }

      const data = await response.json()
      setTool(data.tool)
    } catch (err: any) {
      setError(err.message || 'Failed to load tool')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-mono mb-4">{error || 'Tool not found'}</p>
          <Link href="/marketplace" className="btn-secondary">
            Back to Marketplace
          </Link>
        </div>
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
          
          <Link href="/marketplace" className="btn-secondary flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Tool Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-mono font-bold mb-2">{tool.name}</h1>
              <a 
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon hover:underline font-mono flex items-center space-x-2"
              >
                <span>{tool.url}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <VerdictBadge 
              verdict={tool.latest_verdict} 
              confidence={tool.transparency_score}
              size="lg"
            />
          </div>

          {tool.description && (
            <p className="text-gray-400 text-lg">{tool.description}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold font-mono text-neon">
                  {tool.transparency_score}%
                </p>
                <p className="text-sm text-gray-400 font-mono">Transparency</p>
              </div>
              <div className="text-4xl">✓</div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold font-mono">{tool.total_scans}</p>
                <p className="text-sm text-gray-400 font-mono">Total Scans</p>
              </div>
              <Search className="w-8 h-8 text-neon/30" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold font-mono">{tool.total_votes}</p>
                <p className="text-sm text-gray-400 font-mono">Votes</p>
              </div>
              <TrendingUp className="w-8 h-8 text-neon/30" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold font-mono">
                  {new Date(tool.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400 font-mono">First Scanned</p>
              </div>
              <Calendar className="w-8 h-8 text-neon/30" />
            </div>
          </div>
        </div>

        {/* Badges */}
        {tool.badges && tool.badges.length > 0 && (
          <div className="card mb-12">
            <h2 className="text-2xl font-mono font-bold mb-4">
              <span className="text-neon">&gt;_</span> Badges
            </h2>
            <div className="space-y-4">
              {tool.badges.map((badge) => (
                <div 
                  key={badge.id}
                  className={`border rounded p-4 ${
                    badge.is_revoked 
                      ? 'border-red-500 bg-red-500/10' 
                      : 'border-neon bg-neon/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono font-bold">
                        {badge.badge_type === 'certified_notwrapper' ? '✓ Certified NotWrapper' : badge.badge_type}
                      </p>
                      <p className="text-sm text-gray-400 font-mono">
                        Issued {new Date(badge.issued_at).toLocaleDateString()}
                      </p>
                    </div>
                    {badge.is_revoked && (
                      <span className="text-red-500 font-mono text-sm">REVOKED</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scan History */}
        <div className="card">
          <h2 className="text-2xl font-mono font-bold mb-6">
            <span className="text-neon">&gt;_</span> Scan History
          </h2>

          {tool.scans && tool.scans.length > 0 ? (
            <div className="space-y-4">
              {tool.scans.map((scan) => (
                <div 
                  key={scan.id}
                  className="border border-terminal-border rounded p-4 hover:border-neon/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <VerdictBadge 
                          verdict={scan.verdict as any} 
                          confidence={scan.confidence}
                          size="sm"
                        />
                        <span className="text-sm text-gray-400 font-mono flex items-center space-x-2">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(scan.created_at).toLocaleString()}</span>
                        </span>
                      </div>
                      {scan.scanned_by_profile && (
                        <p className="text-xs text-gray-500 font-mono flex items-center space-x-2">
                          <User className="w-3 h-3" />
                          <span>Scanned by {scan.scanned_by_profile.display_name || scan.scanned_by_profile.username}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 font-mono text-center py-8">No scans yet</p>
          )}
        </div>
      </main>
    </div>
  )
}

