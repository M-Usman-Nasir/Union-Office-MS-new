import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

function formatDate(str) {
  if (!str) return 'N/A';
  return new Date(str).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function UnionMemberDetailScreen() {
  const { params } = useRoute();
  const member = params?.member;

  if (!member) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.centered}>
          <Text style={styles.muted}>Member not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const openPhone = () => {
    if (member.phone) Linking.openURL(`tel:${member.phone}`);
  };
  const openEmail = () => {
    if (member.email) Linking.openURL(`mailto:${member.email}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <Ionicons name="person" size={40} color={colors.primary} />
          </View>
          <Text style={styles.name}>{member.member_name || '—'}</Text>
          {member.designation ? (
            <Text style={styles.designation}>{member.designation}</Text>
          ) : null}
        </View>

        <View style={styles.card}>
          {member.unit_number != null && (
            <View style={styles.row}>
              <Ionicons name="business-outline" size={20} color={colors.textMuted} />
              <Text style={styles.label}>Unit</Text>
              <Text style={styles.value}>{member.unit_number}</Text>
            </View>
          )}
          {member.joining_date && (
            <View style={styles.row}>
              <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
              <Text style={styles.label}>Joining date</Text>
              <Text style={styles.value}>{formatDate(member.joining_date)}</Text>
            </View>
          )}
        </View>

        {(member.phone || member.email) && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Contact</Text>
            {member.phone ? (
              <TouchableOpacity style={styles.row} onPress={openPhone} activeOpacity={0.7}>
                <Ionicons name="call-outline" size={20} color={colors.textMuted} />
                <Text style={styles.label}>Phone</Text>
                <Text style={[styles.value, styles.link]} numberOfLines={1}>
                  {member.phone}
                </Text>
              </TouchableOpacity>
            ) : null}
            {member.email ? (
              <TouchableOpacity style={styles.row} onPress={openEmail} activeOpacity={0.7}>
                <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
                <Text style={styles.label}>Email</Text>
                <Text style={[styles.value, styles.link]} numberOfLines={1}>
                  {member.email}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 24 },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 4 },
  designation: { fontSize: 15, color: colors.textSecondary },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.textMuted, marginBottom: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  label: { fontSize: 14, color: colors.textSecondary, flex: 1 },
  value: { fontSize: 15, color: colors.text, fontWeight: '500', flex: 2 },
  link: { color: colors.primary },
  muted: { color: colors.textMuted, fontSize: 15 },
});
