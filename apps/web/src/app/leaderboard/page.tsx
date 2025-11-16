'use client'

import { useState, useEffect } from 'react'
import { Trophy, Zap, Target, TrendingUp } from 'lucide-react'
import Link from 'next/link'

type LeaderboardEntry = {
  user_id: string
  points: number
  hunts_count: number
  scans_count: number
  upvotes_received: number
  accuracy_score: number
  user: {
    username: string
    display_name: string
    avatar_url?: string
  }
}

export default function LeaderboardPage() {
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([])
  const [period, setPeriod] = useState('current')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [period])

  const fetchLeaderboard = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3003'
      const response = await fetch(`${backendUrl}/api/leaderboard?period=${period}`)
      const data = await response.json()
      setRankings(data.rankings || [])
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

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
            <Link href="/marketplace" className="font-mono text-sm hover:text-neon transition-colors">
              Marketplace
            </Link>
            <Link href="/leaderboard" className="font-mono text-sm text-neon">
              Leaderboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-mono font-bold mb-4">
            <Trophy className="inline w-10 h-10 text-neon mr-2" />
            <span className="text-neon">[</span> Leaderboard <span className="text-neon">]</span>
          </h1>
          <p className="text-gray-400">
            Top wrapper hunters ranked by hunts, scans, accuracy, and community engagement.
          </p>
        </div>

        {/* Period Selector */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setPeriod('current')}
            className={period === 'current' ? 'btn-primary' : 'btn-secondary'}
          >
            This Week
          </button>
          <button
            onClick={() => setPeriod('previous')}
            className={period === 'previous' ? 'btn-primary' : 'btn-secondary'}
          >
            Last Week
          </button>
          <button
            onClick={() => setPeriod('all-time')}
            className={period === 'all-time' ? 'btn-primary' : 'btn-secondary'}
          >
            All Time
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 font-mono text-gray-400">Loading rankings...</p>
          </div>
        ) : rankings.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-mono text-gray-400">No rankings yet for this period</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rankings.map((entry, index) => (
              <div
                key={entry.user_id}
                className={`card flex items-center justify-between ${
                  index === 0 ? 'neon-border bg-neon/5' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-mono font-bold text-lg ${
                    index === 0 ? 'bg-neon text-black' :
                    index === 1 ? 'bg-gray-400 text-black' :
                    index === 2 ? 'bg-orange-600 text-white' :
                    'bg-terminal-bg'
                  }`}>
                    {index === 0 ? '👑' :
                     index === 1 ? '🥈' :
                     index === 2 ? '🥉' :
                     `#${index + 1}`}
                  </div>

                  <div>
                    <h3 className="font-mono font-bold text-lg">
                      {entry.user.display_name || entry.user.username}
                    </h3>
                    <p className="text-sm text-gray-400 font-mono">
                      @{entry.user.username}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className="flex items-center space-x-1 text-neon font-mono font-bold">
                      <Zap className="w-4 h-4" />
                      <span>{entry.points}</span>
                    </div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>

                  <div className="text-center hidden md:block">
                    <div className="font-mono font-bold">{entry.hunts_count}</div>
                    <div className="text-xs text-gray-500">hunts</div>
                  </div>

                  <div className="text-center hidden md:block">
                    <div className="font-mono font-bold">{entry.scans_count}</div>
                    <div className="text-xs text-gray-500">scans</div>
                  </div>

                  <div className="text-center hidden md:block">
                    <div className="font-mono font-bold">{entry.upvotes_received}</div>
                    <div className="text-xs text-gray-500">upvotes</div>
                  </div>

                  <div className="text-center hidden lg:block">
                    <div className="font-mono font-bold text-neon">{entry.accuracy_score}%</div>
                    <div className="text-xs text-gray-500">accuracy</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 card neon-border">
          <h3 className="text-xl font-mono font-bold mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-neon" />
            <span>How Points Work</span>
          </h3>
          <div className="space-y-2 text-sm text-gray-400 font-mono">
            <p>• +10 points for each scan</p>
            <p>• +50 points for each LiveHunt video</p>
            <p>• +5 points for each upvote received</p>
            <p>• Accuracy bonus based on community verification</p>
            <p className="text-neon pt-2">Leaderboard resets every Monday 00:00 UTC</p>
          </div>
        </div>
      </main>
    </div>
  )
}

