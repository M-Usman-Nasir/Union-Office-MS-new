import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
              return;
            }
            const tabNav = navigation.getParent?.();
            tabNav?.navigate?.('Home');
          }}
          style={styles.headerBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.navyHeaderIconMail} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load(1, false);
  }, []);

  const keyExtractor = useCallback((item) => String(item.id), []);

  const renderItem = useCallback(({ item }) => (
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
  ), [navigation]);

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
        <View style={styles.fabRow}>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('NewComplaint')}
            activeOpacity={0.85}
          >
            <Text style={styles.fabText}>+ New Complaint</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={styles.listFlex}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.empty}>No complaints yet</Text>}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={7}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews
        />
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  fabRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 12,
  },
  listFlex: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { flexGrow: 1, paddingBottom: 24 },
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
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  fabText: { color: '#fff', fontWeight: '600' },
  headerBack: { padding: 8, marginRight: 2 },
});
