import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const BACKEND_URL = 'http://localhost:3001' // Change for production

export default function ScanPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleScan = async () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a URL')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(`${BACKEND_URL}/api/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Scan failed')
      }

      setResult(data.scan)
    } catch (error: any) {
      Alert.alert('Scan Failed', error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'NotWrapper':
        return { backgroundColor: 'rgba(0, 255, 65, 0.2)', borderColor: '#00ff41', color: '#00ff41' }
      case 'Wrapper Sus':
        return { backgroundColor: 'rgba(255, 193, 7, 0.2)', borderColor: '#ffc107', color: '#ffc107' }
      case 'Wrapper Confirmed':
        return { backgroundColor: 'rgba(244, 67, 54, 0.2)', borderColor: '#f44336', color: '#f44336' }
      default:
        return { backgroundColor: '#1a1a1a', borderColor: '#333', color: '#888' }
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          <Text style={styles.accent}>[</Text> Scan Tool <Text style={styles.accent}>]</Text>
        </Text>
        <Text style={styles.subtitle}>
          Enter a URL to check if it's a wrapper or real build
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Tool URL</Text>
          <TextInput
            style={styles.input}
            value={url}
            onChangeText={setUrl}
            placeholder="https://example.com"
            placeholderTextColor="#666"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.scanButton, loading && styles.scanButtonDisabled]}
            onPress={handleScan}
            disabled={loading}
          >
            {loading ? (
              <>
                <ActivityIndicator color="#000" />
                <Text style={styles.scanButtonText}>Scanning...</Text>
              </>
            ) : (
              <>
                <Ionicons name="search" size={20} color="#000" />
                <Text style={styles.scanButtonText}>Run Scan</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.result}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>{result.tool_name}</Text>
              <View
                style={[
                  styles.verdictBadge,
                  {
                    backgroundColor: getVerdictStyle(result.verdict).backgroundColor,
                    borderColor: getVerdictStyle(result.verdict).borderColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.verdictText,
                    { color: getVerdictStyle(result.verdict).color },
                  ]}
                >
                  {result.verdict} · {result.confidence}%
                </Text>
              </View>
            </View>

            {/* Transparency Score */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Transparency Score</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${result.confidence}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{result.confidence}%</Text>
            </View>

            {/* Stack DNA */}
            {result.stack_dna && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Stack DNA</Text>
                <View style={styles.stackInfo}>
                  <View style={styles.stackRow}>
                    <Text style={styles.stackLabel}>Frontend:</Text>
                    <Text style={styles.stackValue}>
                      {result.stack_dna.frontend || 'Unknown'}
                    </Text>
                  </View>
                  <View style={styles.stackRow}>
                    <Text style={styles.stackLabel}>Backend:</Text>
                    <Text style={styles.stackValue}>
                      {result.stack_dna.backend || 'Unknown'}
                    </Text>
                  </View>
                  {result.stack_dna.frameworks &&
                    result.stack_dna.frameworks.length > 0 && (
                      <View style={styles.stackRow}>
                        <Text style={styles.stackLabel}>Frameworks:</Text>
                        <Text style={styles.stackValue}>
                          {result.stack_dna.frameworks.join(', ')}
                        </Text>
                      </View>
                    )}
                </View>
              </View>
            )}

            {/* Receipts */}
            {result.receipts && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Receipts</Text>
                <ScrollView style={styles.receipts}>
                  {result.receipts.wrapper_signals &&
                    result.receipts.wrapper_signals.length > 0 && (
                      <View style={styles.receiptGroup}>
                        <Text style={styles.receiptGroupTitle}>
                          ⚠ Wrapper Signals:
                        </Text>
                        {result.receipts.wrapper_signals.map(
                          (signal: any, i: number) => (
                            <Text key={i} style={styles.receiptItem}>
                              • {signal.type}: {signal.pattern}
                            </Text>
                          )
                        )}
                      </View>
                    )}

                  {result.receipts.custom_code_signals &&
                    result.receipts.custom_code_signals.length > 0 && (
                      <View style={styles.receiptGroup}>
                        <Text
                          style={[
                            styles.receiptGroupTitle,
                            { color: '#00ff41' },
                          ]}
                        >
                          ✓ Custom Code:
                        </Text>
                        {result.receipts.custom_code_signals.map(
                          (signal: string, i: number) => (
                            <Text key={i} style={styles.receiptItem}>
                              • {signal}
                            </Text>
                          )
                        )}
                      </View>
                    )}
                </ScrollView>
              </View>
            )}

            <Text style={styles.scanTime}>
              Scan completed in {result.scan_duration_ms}ms
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  accent: {
    color: '#00ff41',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 32,
  },
  form: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#888',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 16,
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 14,
    marginBottom: 16,
  },
  scanButton: {
    backgroundColor: '#00ff41',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  scanButtonDisabled: {
    opacity: 0.6,
  },
  scanButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  result: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 20,
  },
  resultHeader: {
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  verdictBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  verdictText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#888',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#000',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ff41',
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#00ff41',
    textAlign: 'right',
    marginTop: 4,
  },
  stackInfo: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
  },
  stackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stackLabel: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#888',
  },
  stackValue: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#fff',
  },
  receipts: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
    maxHeight: 300,
  },
  receiptGroup: {
    marginBottom: 16,
  },
  receiptGroupTitle: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#f44336',
    marginBottom: 8,
  },
  receiptItem: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#888',
    marginBottom: 4,
    marginLeft: 16,
  },
  scanTime: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
})

