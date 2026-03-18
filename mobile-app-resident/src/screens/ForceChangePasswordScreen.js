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
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import SafeScreen from '../components/SafeScreen';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth';
import { STORAGE_KEYS } from '../constants';
import { colors } from '../theme';

export default function ForceChangePasswordScreen() {
  const { user, refreshUser } = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    if (!current || !next || !confirm) {
      setError('Fill all fields');
      return;
    }
    if (next.length < 6) {
      setError('New password at least 6 characters');
      return;
    }
    if (next !== confirm) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.changePasswordFirstLogin({
        current_password: current,
        new_password: next,
      });
      const { accessToken, refreshToken, user: u } = res.data?.data || {};
      if (accessToken) await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      if (refreshToken) await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      if (u) await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(u));
      await refreshUser();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.must_change_password) {
    return null;
  }

  return (
    <SafeScreen style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Change your password</Text>
          <Text style={styles.hint}>
            Set a new password before using the app. Use your initial password as &quot;current&quot;.
          </Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Current password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            value={current}
            onChangeText={setCurrent}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="New password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            value={next}
            onChangeText={setNext}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={submit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Save password</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { padding: 24, paddingTop: 48 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 12 },
  hint: { fontSize: 14, color: colors.textSecondary, marginBottom: 20, lineHeight: 20 },
  error: { color: colors.error, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  btn: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
