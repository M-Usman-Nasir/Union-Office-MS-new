/* global require */
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeScreen from '../components/SafeScreen';
import { useAuth } from '../context/AuthContext';
import { STORAGE_KEYS } from '../constants';
import { colors } from '../theme';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value) {
  return value.trim().length > 0 && EMAIL_REGEX.test(value.trim());
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const [savedEmail, savedPassword] = await Promise.all([
          SecureStore.getItemAsync(STORAGE_KEYS.LAST_EMAIL),
          SecureStore.getItemAsync(STORAGE_KEYS.LAST_PASSWORD),
        ]);
        if (savedEmail != null) setEmail(savedEmail);
        if (savedPassword != null) setPassword(savedPassword);
      } catch {
        // ignore
      }
    })();
  }, []);

  const emailValid = isValidEmail(email);

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Email and password are required');
      return;
    }
    setLoading(true);
    const result = await login({ email: email.trim().toLowerCase(), password });
    setLoading(false);
    if (result.success) return;
    setError(result.error || 'Login failed');
  };

  return (
    <SafeScreen style={styles.safe} edges={[]}>
      <ImageBackground
        source={require('../../assets/images/12.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <Text style={styles.title}>Union Resident</Text>
              <Text style={styles.tagline}>Your community, connected.</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <View style={styles.emailWrapper}>
                <TextInput
                  style={[styles.input, emailValid && styles.inputWithTick]}
                  placeholder="Email"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!loading}
                />
                {emailValid ? (
                  <View style={styles.emailTick} pointerEvents="none">
                    <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                  </View>
                ) : null}
              </View>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Password"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword((prev) => !prev)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  backgroundImage: { flex: 1 },
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', backgroundColor: 'transparent' },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 4 },
  tagline: { fontSize: 13, fontStyle: 'italic', color: colors.textMuted, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 24 },
  error: { color: colors.error, marginBottom: 12, textAlign: 'center' },
  emailWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    padding: 14,
    color: colors.text,
    marginBottom: 0,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputWithTick: {
    paddingRight: 44,
  },
  emailTick: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  passwordWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  inputPassword: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    padding: 14,
    paddingRight: 48,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
