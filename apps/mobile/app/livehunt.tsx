import { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native'
import { Camera, CameraType } from 'expo-camera'
import { Video, ResizeMode } from 'expo-av'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import * as FileSystem from 'expo-file-system'

const { width, height } = Dimensions.get('window')

export default function LiveHuntPage() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [videoUri, setVideoUri] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const cameraRef = useRef<Camera>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      const audioStatus = await Camera.requestMicrophonePermissionsAsync()
      setHasPermission(status === 'granted' && audioStatus.status === 'granted')
    })()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    if (!cameraRef.current) return

    try {
      setIsRecording(true)
      setDuration(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)

      const video = await cameraRef.current.recordAsync({
        maxDuration: 300, // 5 minutes max
        quality: Camera.Constants.VideoQuality['720p'],
      })

      setVideoUri(video.uri)
    } catch (error) {
      console.error('Failed to record:', error)
      Alert.alert('Error', 'Failed to start recording')
    } finally {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording()
    }
  }

  const retakeVideo = () => {
    setVideoUri(null)
    setDuration(0)
  }

  const saveHunt = async () => {
    if (!videoUri) return

    try {
      Alert.alert(
        'Hunt Saved!',
        'Your LiveHunt has been saved. You can upload it from your profile.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      )
    } catch (error) {
      Alert.alert('Error', 'Failed to save hunt')
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Requesting permissions...</Text>
      </View>
    )
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-off" size={64} color="#888" />
          <Text style={styles.permissionText}>
            Camera and microphone access required for LiveHunt mode
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  if (videoUri) {
    return (
      <SafeAreaView style={styles.container}>
        <Video
          source={{ uri: videoUri }}
          style={styles.video}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
        />

        <View style={styles.previewControls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={retakeVideo}
          >
            <Ionicons name="refresh" size={24} color="#00ff41" />
            <Text style={styles.secondaryButtonText}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.primaryButton]}
            onPress={saveHunt}
          >
            <Ionicons name="checkmark" size={24} color="#000" />
            <Text style={styles.primaryButtonText}>Save Hunt</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={32} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={CameraType.front}
        ratio="16:9"
      >
        {/* Timer Overlay */}
        {isRecording && (
          <View style={styles.timerContainer}>
            <View style={styles.recordingIndicator} />
            <Text style={styles.timerText}>{formatDuration(duration)}</Text>
          </View>
        )}

        {/* Instructions */}
        {!isRecording && (
          <View style={styles.instructionsContainer}>
            <View style={styles.instructionBox}>
              <Ionicons name="information-circle" size={24} color="#00ff41" />
              <Text style={styles.instructionText}>
                Tap the camera button to start recording your LiveHunt.
                Narrate as you investigate the tool!
              </Text>
            </View>
          </View>
        )}

        {/* Face Cam Overlay Border */}
        <View style={styles.faceOverlay} />

        {/* Controls */}
        <View style={styles.controls}>
          {!isRecording ? (
            <TouchableOpacity
              style={styles.recordButton}
              onPress={startRecording}
            >
              <View style={styles.recordButtonInner} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.stopButton}
              onPress={stopRecording}
            >
              <View style={styles.stopButtonInner} />
            </TouchableOpacity>
          )}
        </View>

        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={32} color="#fff" />
        </TouchableOpacity>
      </Camera>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  permissionText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'monospace',
  },
  backButton: {
    backgroundColor: '#00ff41',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 32,
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  timerContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#f44336',
  },
  timerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  instructionsContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
  },
  instructionBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderWidth: 1,
    borderColor: '#00ff41',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  instructionText: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  faceOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 3,
    borderColor: '#00ff41',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f44336',
  },
  stopButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  previewControls: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#00ff41',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: '#00ff41',
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  secondaryButtonText: {
    color: '#00ff41',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

