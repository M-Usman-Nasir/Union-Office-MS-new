import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import SafeScreen from '../components/SafeScreen';
import { useAuth } from '../context/AuthContext';
import { complaintsApi } from '../api/complaints';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme';

function formatDate(str) {
  if (!str) return 'N/A';
  return new Date(str).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' });
}

const statusColor = (s) => {
  if (s === 'resolved' || s === 'closed') return colors.success;
  if (s === 'in_progress') return colors.primary;
  return colors.warning;
};

export default function ComplaintsScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const limit = 20;

  const load = async (pageNum = 1, append = false) => {
    try {
      const res = await complaintsApi.getAll({ page: pageNum, limit });
      const raw = res.data?.data ?? res.data;
      const items = Array.isArray(raw) ? raw : (raw?.data || []);
      setList(append ? (prev) => [...prev, ...items] : items);
    } catch (e) {
      if (!append) setList([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) load(1, false);
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    load(1, false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ComplaintDetail', { id: item.id })}
      activeOpacity={0.7}
    >
      <Text style={styles.subject} numberOfLines={2} ellipsizeMode="tail">
        {item.subject || item.title || 'Complaint'}
      </Text>
      <View style={styles.row}>
        <View style={[styles.badge, { backgroundColor: statusColor(item.status) }]}>
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
        <Text style={styles.date}>{formatDate(item.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeScreen style={styles.safe} edges={[]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.safe} edges={[]}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('NewComplaint')}
        >
          <Text style={styles.fabText}>+ New Complaint</Text>
        </TouchableOpacity>
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.empty}>No complaints yet</Text>}
        />
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingBottom: 80 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subject: { color: colors.text, fontWeight: '600', fontSize: 16, marginBottom: 8, flexShrink: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: '#fff', fontSize: 12 },
  date: { color: colors.textMuted, fontSize: 12 },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 24 },
  fab: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 1,
  },
  fabText: { color: '#fff', fontWeight: '600' },
});
