import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0a0a0a',
          },
          headerTintColor: '#00ff41',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'monospace',
          },
          contentStyle: {
            backgroundColor: '#0a0a0a',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'NOTWRAPPER',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="scan"
          options={{
            title: 'SCAN',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="livehunt"
          options={{
            title: 'LIVEHUNT',
            headerShown: false,
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="marketplace"
          options={{
            title: 'MARKETPLACE',
            headerShown: true,
          }}
        />
      </Stack>
    </>
  )
}

