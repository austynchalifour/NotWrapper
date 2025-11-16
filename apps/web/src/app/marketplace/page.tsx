'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, TrendingUp, Clock, Award } from 'lucide-react'
import Link from 'next/link'
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
}

export default function MarketplacePage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('recent')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchTools()
  }, [filter, sort])

  const fetchTools = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3003'
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('verdict', filter)
      params.append('sort', sort)
      
      const response = await fetch(`${backendUrl}/api/tools?${params}`)
      const data = await response.json()
      setTools(data.tools || [])
    } catch (error) {
      console.error('Failed to fetch tools:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.url.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-terminal-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-mono text-xl font-bold glitch-text">
              NOT<span className="text-neon">WRAPPER</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/marketplace" className="font-mono text-sm text-neon">
              Marketplace
            </Link>
            <Link href="/leaderboard" className="font-mono text-sm hover:text-neon transition-colors">
              Leaderboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-mono font-bold mb-4">
            <span className="text-neon">[</span> Verified Marketplace <span className="text-neon">]</span>
          </h1>
          <p className="text-gray-400">
            Browse all scanned AI tools. Filter by verdict, sort by votes, find real builds.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input w-auto"
              >
                <option value="all">All Verdicts</option>
                <option value="NotWrapper">NotWrapper Only</option>
                <option value="Wrapper Sus">Wrapper Sus</option>
                <option value="Wrapper Confirmed">Wrappers</option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input w-auto"
              >
                <option value="recent">Recent</option>
                <option value="votes">Most Voted</option>
                <option value="transparency">Transparency</option>
                <option value="scans">Most Scanned</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-mono text-gray-400">
            <Filter className="w-4 h-4" />
            <span>{filteredTools.length} tools found</span>
          </div>
        </div>

        {/* Tools Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 font-mono text-gray-400">Loading tools...</p>
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-mono text-gray-400">No tools found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="card hover:border-neon transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-mono font-bold group-hover:text-neon transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono truncate">
                      {tool.url}
                    </p>
                  </div>
                </div>

                <VerdictBadge 
                  verdict={tool.latest_verdict} 
                  confidence={tool.transparency_score}
                  size="sm"
                />

                {tool.description && (
                  <p className="mt-4 text-sm text-gray-400 line-clamp-2">
                    {tool.description}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-terminal-border flex items-center justify-between text-xs font-mono text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{tool.total_votes}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Search className="w-3 h-3" />
                      <span>{tool.total_scans}</span>
                    </span>
                  </div>
                  <span>{new Date(tool.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

