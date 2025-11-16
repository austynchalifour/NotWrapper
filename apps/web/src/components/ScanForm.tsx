'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import VerdictBadge from './VerdictBadge'
import { createClient } from '@/lib/supabase'

export default function ScanForm() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // Get current user
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id)
        setUserEmail(user.email || null)
      }
    })
  }, [])

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url) {
      setError('Please enter a URL')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3003'
      const response = await fetch(`${backendUrl}/api/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url,
          userId: userId || null  // Send userId if authenticated
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Scan failed')
      }

      setResult(data.scan)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleScan} className="space-y-4">
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-2">
            Tool URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="input"
            disabled={loading}
          />
        </div>

        {userId && userEmail && (
          <div className="bg-neon/10 border border-neon/30 rounded p-3">
            <p className="text-xs text-neon/80 font-mono">
              ✓ Signed in as {userEmail} - This scan will be saved to your account
            </p>
          </div>
        )}

        {!userId && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
            <p className="text-xs text-yellow-500/80 font-mono">
              ⚠ Not signed in - Scan results won't be saved to your account
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded p-3">
            <p className="text-sm text-red-500 font-mono">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Scanning...</span>
            </>
          ) : (
            <span>Run Scan</span>
          )}
        </button>
      </form>

      {result && (
        <div className="scan-result">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-mono font-bold">{result.tool_name}</h3>
            <VerdictBadge verdict={result.verdict} confidence={result.confidence} />
          </div>

          {userId && (
            <div className="bg-neon/10 border border-neon rounded p-4 mb-4">
              <p className="text-sm font-mono text-neon">
                ✓ Scan saved! This result is now in your account and visible in the marketplace.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-mono text-gray-400 mb-2">Transparency Score</h4>
              <div className="w-full bg-black rounded-full h-2">
                <div
                  className="bg-neon h-2 rounded-full transition-all duration-500"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
              <p className="text-right text-sm font-mono text-neon mt-1">
                {result.confidence}%
              </p>
            </div>

            {result.stack_dna && (
              <div>
                <h4 className="text-sm font-mono text-gray-400 mb-2">Stack DNA</h4>
                <div className="bg-black rounded p-4 font-mono text-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Frontend:</span>
                    <span className="text-white">{result.stack_dna.frontend || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Backend:</span>
                    <span className="text-white">{result.stack_dna.backend || 'Unknown'}</span>
                  </div>
                  {result.stack_dna.frameworks && result.stack_dna.frameworks.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Frameworks:</span>
                      <span className="text-white">{result.stack_dna.frameworks.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {result.receipts && (
              <div>
                <h4 className="text-sm font-mono text-gray-400 mb-2">Receipts</h4>
                <div className="bg-black rounded p-4 font-mono text-xs space-y-2 max-h-64 overflow-y-auto">
                  {result.receipts.wrapper_signals && result.receipts.wrapper_signals.length > 0 && (
                    <div>
                      <p className="text-red-500 font-bold mb-1">⚠ Wrapper Signals:</p>
                      {result.receipts.wrapper_signals.map((signal: any, i: number) => (
                        <p key={i} className="text-gray-400 ml-4">
                          • {signal.type}: {signal.pattern}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  {result.receipts.custom_code_signals && result.receipts.custom_code_signals.length > 0 && (
                    <div>
                      <p className="text-neon font-bold mb-1">✓ Custom Code:</p>
                      {result.receipts.custom_code_signals.map((signal: string, i: number) => (
                        <p key={i} className="text-gray-400 ml-4">
                          • {signal}
                        </p>
                      ))}
                    </div>
                  )}

                  {result.receipts.detected_frameworks && result.receipts.detected_frameworks.length > 0 && (
                    <div>
                      <p className="text-blue-500 font-bold mb-1">📦 Frameworks:</p>
                      {result.receipts.detected_frameworks.map((fw: string, i: number) => (
                        <p key={i} className="text-gray-400 ml-4">
                          • {fw}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 font-mono text-center pt-4 border-t border-terminal-border">
              Scan completed in {result.scan_duration_ms}ms
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

