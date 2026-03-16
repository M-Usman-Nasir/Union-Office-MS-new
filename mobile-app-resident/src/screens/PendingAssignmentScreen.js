import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeScreen from '../components/SafeScreen';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function PendingAssignmentScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeScreen style={styles.safe} edges={[]}>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <Ionicons name="business-outline" size={64} color={colors.primary} />
        </View>
        <Text style={styles.title}>You’re not assigned yet</Text>
        <Text style={styles.message}>
          Your account is set up, but you’re not linked to any society or apartment. You’ll be able to use the app once an administrator adds you to a society.
        </Text>
        <Text style={styles.hint}>
          Contact your union or society admin and ask to be added to your apartment. Then sign in again after they’ve assigned you.
        </Text>
        {user?.email ? (
          <Text style={styles.email}>Signed in as {user.email}</Text>
        ) : null}
        <TouchableOpacity style={styles.button} onPress={() => logout()}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  iconWrap: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 16 },
  message: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginBottom: 12, lineHeight: 24 },
  hint: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  email: { fontSize: 13, color: colors.textMuted, marginBottom: 32 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
