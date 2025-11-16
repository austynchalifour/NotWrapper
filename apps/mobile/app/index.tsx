import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function HomePage() {
  const router = useRouter()

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            DETECT AI{'\n'}
            <Text style={styles.heroAccent}>WRAPPERS</Text>
            {'\n'}IN SECONDS
          </Text>
          <Text style={styles.heroSubtitle}>
            Find out if that "revolutionary AI tool" is real or just a wrapper
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => router.push('/scan')}
          >
            <Ionicons name="search" size={24} color="#000" />
            <Text style={styles.primaryButtonText}>Scan a Tool</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => router.push('/livehunt')}
          >
            <Ionicons name="videocam" size={24} color="#00ff41" />
            <Text style={styles.secondaryButtonText}>Start LiveHunt</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => router.push('/marketplace')}
          >
            <Ionicons name="apps" size={24} color="#00ff41" />
            <Text style={styles.secondaryButtonText}>Browse Marketplace</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="search-outline" size={28} color="#00ff41" />
            </View>
            <Text style={styles.featureTitle}>WrapperCheck™</Text>
            <Text style={styles.featureText}>
              Scan any URL. Get instant verdict. See the receipts.
            </Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="shield-checkmark-outline" size={28} color="#00ff41" />
            </View>
            <Text style={styles.featureTitle}>Certified Badge</Text>
            <Text style={styles.featureText}>
              Pass the test? Get a "Certified NotWrapper™" badge.
            </Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name="trophy-outline" size={28} color="#00ff41" />
            </View>
            <Text style={styles.featureTitle}>LiveHunt Mode</Text>
            <Text style={styles.featureText}>
              Record your investigation. Narrate findings. Climb the leaderboard.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Built by real devs, for real devs
          </Text>
          <Text style={styles.footerSubtext}>
            No wrappers allowed.
          </Text>
        </View>
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
  hero: {
    marginTop: 40,
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'monospace',
    lineHeight: 50,
  },
  heroAccent: {
    color: '#00ff41',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  actions: {
    gap: 16,
    marginBottom: 40,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 8,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#00ff41',
  },
  secondaryButton: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  secondaryButtonText: {
    color: '#00ff41',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  features: {
    gap: 24,
    marginBottom: 40,
  },
  feature: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 20,
  },
  featureIcon: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'monospace',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginTop: 4,
  },
})

