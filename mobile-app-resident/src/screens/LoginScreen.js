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
  Image,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeScreen from '../components/SafeScreen';
import { useAuth } from '../context/AuthContext';
import { APP_LOGO, STORAGE_KEYS } from '../constants';
import { colors } from '../theme';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const QUOTE_ROTATE_MS = 7000;
const PROJECT_QUOTES = [
  '"Building better communities through smarter management."',
  '"Every resident interaction matters."',
  '"Transparent operations, trusted living."',
  '"One platform for homes, people, and peace of mind."',
  '"From complaints to clarity - all in one place."',
  '"Where residents, staff, and administration stay connected."',
  '"Reliable records, faster service, happier communities."',
  '"Simple workflows for complex community operations."',
];

function isValidEmail(value) {
  return value.trim().length > 0 && EMAIL_REGEX.test(value.trim());
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const { login } = useAuth();
  const navigation = useNavigation();
  const floatAnim = useState(new Animated.Value(0))[0];

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

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 4200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 4200,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [floatAnim]);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % PROJECT_QUOTES.length);
    }, QUOTE_ROTATE_MS);

    return () => clearInterval(timer);
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
      <View style={styles.bgGradientTop} pointerEvents="none" />
      <View style={styles.bgGradientBottom} pointerEvents="none" />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.floatingBlobPrimary,
          {
            transform: [
              {
                translateY: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -14],
                }),
              },
              { rotate: '-14deg' },
            ],
          },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.floatingBlobSecondary,
          {
            transform: [
              {
                translateY: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 10],
                }),
              },
              { rotate: '16deg' },
            ],
          },
        ]}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Image source={APP_LOGO} style={styles.logo} resizeMode="contain" accessibilityLabel="App logo" />
            <Text style={styles.title}>Union Resident</Text>
              <Text style={styles.tagline}>Your community, connected.</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>
            <View style={styles.quoteCard}>
              <Text style={styles.quoteText}>{PROJECT_QUOTES[quoteIndex]}</Text>
              <Text style={styles.quoteMeta}>Quote {quoteIndex + 1} of {PROJECT_QUOTES.length}</Text>
            </View>
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
                onPress={() => navigation.navigate('ForgotPassword')}
                disabled={loading}
                style={styles.forgotRow}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
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
              <TouchableOpacity
                style={styles.signUpRow}
                onPress={() => navigation.navigate('SignUp')}
                disabled={loading}
              >
                <Text style={styles.signUpHint}>Don&apos;t have an account? </Text>
                <Text style={styles.signUpLink}>Sign up</Text>
              </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  bgGradientTop: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(37, 99, 235, 0.14)',
  },
  bgGradientBottom: {
    position: 'absolute',
    bottom: -140,
    left: -120,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: 'rgba(99, 102, 241, 0.11)',
  },
  floatingBlobPrimary: {
    position: 'absolute',
    top: 110,
    left: -40,
    width: 160,
    height: 120,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  floatingBlobSecondary: {
    position: 'absolute',
    bottom: 120,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 28,
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
  },
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 14 },
  logo: {
    width: '100%',
    height: 120,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.16)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 6,
  },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: 3 },
  tagline: { fontSize: 12, fontStyle: 'italic', color: colors.textMuted, textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginBottom: 12 },
  quoteCard: {
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.18)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: colors.textSecondary,
    lineHeight: 16,
    textAlign: 'center',
  },
  quoteMeta: {
    marginTop: 4,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    fontWeight: '600',
  },
  error: { color: colors.error, marginBottom: 12, textAlign: 'center' },
  emailWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(248,250,252,0.95)',
    borderRadius: 11,
    padding: 12,
    color: colors.text,
    marginBottom: 0,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.16)',
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
    marginBottom: 8,
  },
  inputPassword: {
    backgroundColor: 'rgba(248,250,252,0.95)',
    borderRadius: 11,
    padding: 12,
    paddingRight: 48,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.16)',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 11,
    padding: 14,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 4,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  forgotRow: { alignItems: 'flex-end', marginBottom: 4 },
  forgotText: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  signUpRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 14 },
  signUpHint: { fontSize: 14, color: colors.textSecondary },
  signUpLink: { fontSize: 14, fontWeight: '600', color: colors.primary },
});
