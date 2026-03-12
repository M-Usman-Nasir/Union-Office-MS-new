import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import SafeScreen from '../components/SafeScreen';
import { useRoute } from '@react-navigation/native';
import { complaintsApi } from '../api/complaints';
import { colors } from '../theme';

function formatDate(str) {
  if (!str) return 'N/A';
  return new Date(str).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ComplaintDetailScreen() {
  const { params } = useRoute();
  const id = params?.id;
  const [complaint, setComplaint] = useState(null);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const [detailRes, progressRes] = await Promise.all([
          complaintsApi.getById(id),
          complaintsApi.getProgress(id).catch(() => ({ data: {} })),
        ]);
        setComplaint(detailRes.data?.data || detailRes.data);
        const p = progressRes.data?.data || progressRes.data;
        setProgress(Array.isArray(p) ? p : p?.data || []);
      } catch (e) {
        setComplaint(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <SafeScreen style={styles.safe} edges={[]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeScreen>
    );
  }

  if (!complaint) {
    return (
      <SafeScreen style={styles.safe} edges={[]}>
        <View style={styles.centered}>
          <Text style={styles.muted}>Complaint not found</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.safe} edges={[]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.subject}>{complaint.subject || complaint.title || 'Complaint'}</Text>
        <View style={styles.meta}>
          <Text style={styles.status}>{complaint.status}</Text>
          <Text style={styles.date}>{formatDate(complaint.created_at)}</Text>
        </View>
        {complaint.description ? (
          <Text style={styles.body}>{complaint.description}</Text>
        ) : null}
        {progress.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Progress</Text>
            {progress.map((p, i) => (
              <View key={p.id || i} style={styles.progressCard}>
                <Text style={styles.progressText}>{p.notes || p.comment}</Text>
                <Text style={styles.muted}>{formatDate(p.created_at)}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingBottom: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  subject: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 8 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  status: { color: colors.textSecondary, textTransform: 'capitalize' },
  date: { color: colors.textMuted, fontSize: 14 },
  body: { color: colors.text, lineHeight: 22, marginBottom: 24 },
  section: { marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 },
  progressCard: { backgroundColor: colors.surface, borderRadius: 8, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  progressText: { color: colors.text, marginBottom: 4 },
  muted: { color: colors.textMuted, fontSize: 12 },
});
