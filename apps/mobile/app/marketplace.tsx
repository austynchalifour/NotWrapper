import { useState, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const BACKEND_URL = 'http://192.168.1.166:3001'

type Tool = {
  id: string
  name: string
  url: string
  latest_verdict: string
  transparency_score: number
  total_scans: number
  total_votes: number
}

export default function MarketplacePage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/tools`)
      const data = await response.json()
      setTools(data.tools || [])
    } catch (error) {
      console.error('Failed to fetch tools:', error)
    } finally {
      setLoading(false)
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'NotWrapper':
        return '#00ff41'
      case 'Wrapper Sus':
        return '#ffc107'
      case 'Wrapper Confirmed':
        return '#f44336'
      default:
        return '#888'
    }
  }

  const renderTool = ({ item }: { item: Tool }) => (
    <TouchableOpacity style={styles.toolCard}>
      <View style={styles.toolHeader}>
        <Text style={styles.toolName}>{item.name}</Text>
      </View>
      <Text style={styles.toolUrl}>{item.url}</Text>

      <View
        style={[
          styles.verdictBadge,
          { borderColor: getVerdictColor(item.latest_verdict) },
        ]}
      >
        <Text
          style={[
            styles.verdictText,
            { color: getVerdictColor(item.latest_verdict) },
          ]}
        >
          {item.latest_verdict} · {item.transparency_score}%
        </Text>
      </View>

      <View style={styles.toolFooter}>
        <View style={styles.stat}>
          <Ionicons name="trending-up" size={14} color="#888" />
          <Text style={styles.statText}>{item.total_votes}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="search" size={14} color="#888" />
          <Text style={styles.statText}>{item.total_scans}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00ff41" />
        <Text style={styles.loadingText}>Loading marketplace...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tools}
        renderItem={renderTool}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No tools found</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  list: {
    padding: 16,
  },
  toolCard: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  toolHeader: {
    marginBottom: 4,
  },
  toolName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'monospace',
  },
  toolUrl: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  verdictBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  verdictText: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  toolFooter: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'monospace',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'monospace',
    marginTop: 16,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    fontFamily: 'monospace',
  },
})

