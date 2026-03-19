import { useState } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeScreen from '../components/SafeScreen';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth';
import { APP_LOGO } from '../constants';
import { colors } from '../theme';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value) {
  return value.trim().length > 0 && EMAIL_REGEX.test(value.trim());
}

export default function SignUpScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const emailValid = isValidEmail(email);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSignUp = async () => {
    setError('');
    setSuccessMessage('');
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedName) {
      setError('Name is required');
      return;
    }
    if (!trimmedEmail) {
      setError('Email is required');
      return;
    }
    if (!emailValid) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authApi.registerResident({
        name: trimmedName,
        email: trimmedEmail,
        password,
      });
      const result = await login({ email: trimmedEmail, password });
      if (result.success) {
        setSuccessMessage('Account created! Taking you in...');
        setLoading(false);
        return;
      }
      setSuccessMessage('Account created. Please sign in with your email and password.');
    } catch (e) {
      setError(e.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen style={styles.safe} edges={[]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Image source={APP_LOGO} style={styles.logo} resizeMode="contain" accessibilityLabel="App logo" />
            <Text style={styles.title}>Union Resident</Text>
              <Text style={styles.tagline}>Your community, connected.</Text>
              <Text style={styles.subtitle}>Create an account</Text>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}

              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!loading}
              />
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
                  placeholder="Password (min 6 characters)"
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
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.inputPassword, passwordsMatch && password.length > 0 && styles.inputValid]}
                  placeholder="Confirm password"
                  placeholderTextColor={colors.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword((prev) => !prev)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.signInRow}
                onPress={() => navigation.navigate('Login')}
                disabled={loading}
              >
                <Text style={styles.signInHint}>Already have an account? </Text>
                <Text style={styles.signInLink}>Sign in</Text>
              </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingVertical: 24 },
  logo: {
    width: '100%',
    height: 72,
    marginBottom: 20,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 4 },
  tagline: { fontSize: 13, fontStyle: 'italic', color: colors.textMuted, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 24 },
  error: { color: colors.error, marginBottom: 12, textAlign: 'center' },
  success: { color: colors.success, marginBottom: 12, textAlign: 'center', fontSize: 14 },
  input: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    padding: 14,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  inputValid: { borderColor: colors.success },
  emailWrapper: { position: 'relative', marginBottom: 12 },
  inputWithTick: { paddingRight: 44 },
  emailTick: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  passwordWrapper: { position: 'relative', marginBottom: 12 },
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
  signInRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  signInHint: { fontSize: 14, color: colors.textSecondary },
  signInLink: { fontSize: 14, fontWeight: '600', color: colors.primary },
});
