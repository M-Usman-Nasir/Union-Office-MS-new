import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import SafeScreen from '../components/SafeScreen';
import { useAuth } from '../context/AuthContext';
import { financeApi } from '../api/finance';
import { colors } from '../theme';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount || 0);
}

export default function FinancialSummaryScreen() {
  const { user } = useAuth();
  const societyId = user?.society_apartment_id;
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });

  const load = async () => {
    if (!societyId) {
      setLoading(false);
      return;
    }
    try {
      const res = await financeApi.getPublicSummary({
        society_id: societyId,
        month: period.month,
        year: period.year,
      });
      const raw = res.data?.data || res.data;
      setSummary(raw?.summary || raw);
    } catch (e) {
      setSummary(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (societyId) load();
  }, [societyId, period.month, period.year]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  if (loading && !summary) {
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
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.period}>
          {period.month}/{period.year} · Public summary
        </Text>
        {!summary ? (
          <Text style={styles.muted}>No summary available for this period</Text>
        ) : (
          <View style={styles.card}>
            {summary.total_income != null && (
              <View style={styles.row}>
                <Text style={styles.label}>Total income</Text>
                <Text style={styles.value}>{formatCurrency(summary.total_income)}</Text>
              </View>
            )}
            {summary.total_expenses != null && (
              <View style={styles.row}>
                <Text style={styles.label}>Total expenses</Text>
                <Text style={styles.value}>{formatCurrency(summary.total_expenses)}</Text>
              </View>
            )}
            {(summary.net_income != null || summary.balance != null) && (
              <View style={styles.row}>
                <Text style={styles.label}>Net / Balance</Text>
                <Text style={styles.value}>{formatCurrency(summary.net_income ?? summary.balance)}</Text>
              </View>
            )}
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
  period: { color: colors.text, fontWeight: '600', marginBottom: 16 },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { color: colors.textSecondary },
  value: { color: colors.text, fontWeight: '600' },
  muted: { color: colors.textMuted, marginTop: 8 },
});
