import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { colors } from './src/theme';
import AuthStack from './src/navigation/AuthStack';
import MainTabs from './src/navigation/MainTabs';
import PendingAssignmentScreen from './src/screens/PendingAssignmentScreen';

const TAGLINE = 'Your community, connected.';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { isAuthenticated, loading, user } = useAuth();
  const hasSociety = user?.society_apartment_id != null && user?.society_apartment_id !== '';

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingTagline}>{TAGLINE}</Text>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loadingSpinner} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : !hasSociety ? (
        <Stack.Screen name="PendingAssignment" component={PendingAssignmentScreen} />
      ) : (
        <Stack.Screen name="Main" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  // Hide native splash as soon as app loads so only one screen shows (our loading view with tagline)
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer
          theme={{
            dark: false,
            colors: {
              primary: colors.primary,
              background: colors.background,
              card: colors.surface,
              text: colors.text,
              border: colors.border,
              notification: colors.primary,
            },
          }}
        >
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingTagline: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 32,
    fontStyle: 'italic',
  },
  loadingSpinner: {
    marginBottom: 8,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
