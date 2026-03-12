import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import SafeScreen from '../components/SafeScreen';
import { useAuth } from '../context/AuthContext';
import { maintenanceApi } from '../api/maintenance';
import { colors } from '../theme';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount || 0);
}

export default function MaintenanceScreen() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await maintenanceApi.getAll({
        unit_id: user?.unit_id,
        limit: 50,
        page: 1,
      });
      const raw = res.data?.data ?? res.data;
      setList(Array.isArray(raw) ? raw : (raw?.data || []));
    } catch (e) {
      setList([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) load();
  }, [user?.id, user?.unit_id]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.period}>{item.month} / {item.year}</Text>
      <Text style={styles.amount}>{formatCurrency(item.total_amount ?? item.amount)}</Text>
      <Text style={styles.status}>{item.status}</Text>
    </View>
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
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>No maintenance records for your unit</Text>}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { paddingBottom: 16 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  period: { color: colors.text, fontWeight: '600', marginBottom: 4 },
  amount: { color: colors.success, fontSize: 18, marginBottom: 4 },
  status: { color: colors.textMuted, fontSize: 14, textTransform: 'capitalize' },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 24 },
});
