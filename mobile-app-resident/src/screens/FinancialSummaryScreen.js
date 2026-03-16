import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import SafeScreen from '../components/SafeScreen';
import { useAuth } from '../context/AuthContext';
import { financeApi } from '../api/finance';
import { settingsApi } from '../api/settings';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount || 0);
}

export default function FinancialSummaryScreen() {
  const { user } = useAuth();
  const societyId = user?.society_apartment_id;
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [reportType, setReportType] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [summary, setSummary] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const isVisible = settings === null ? null : (settings?.financial_reports_visible !== false);
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const loadSettings = async () => {
    if (!societyId) return;
    try {
      const res = await settingsApi.getSettings(societyId);
      const data = res.data?.data ?? res.data;
      setSettings(data);
    } catch {
      setSettings({});
    }
  };

  const load = async () => {
    if (!societyId) {
      setLoading(false);
      return;
    }
    setError(null);
    try {
      if (reportType === 'monthly') {
        const res = await financeApi.getPublicSummary({
          society_id: societyId,
          month: selectedMonth,
          year: selectedYear,
        });
        // Backend returns { success, data: { summary: { total_income, total_expenses, net_income } } }
        const data = res.data?.data ?? res.data;
        const monthlySummary = data?.summary ?? data;
        setSummary(
          monthlySummary && (monthlySummary.total_income !== undefined || monthlySummary.total_expenses !== undefined)
            ? monthlySummary
            : { total_income: 0, total_expenses: 0, net_income: 0 }
        );
      } else {
        const res = await financeApi.getYearlyReport({
          society_id: societyId,
          year: selectedYear,
        });
        const raw = res.data?.data ?? res.data;
        const yearly = raw?.yearly ?? raw;
        const yearlyObj = yearly && typeof yearly === 'object' ? yearly : {};
        setSummary({
          total_income: yearlyObj.total_income ?? 0,
          total_expenses: yearlyObj.total_expenses ?? 0,
          net_income: yearlyObj.net_income ?? 0,
          monthly_trend: raw?.monthly || [],
        });
      }
    } catch (e) {
      setSummary(null);
      setError(e.response?.status === 403
        ? 'You do not have permission to view financial reports.'
        : e.response?.data?.message || 'Failed to load financial summary. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (societyId) loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when societyId is set
  }, [societyId]);

  useEffect(() => {
    if (societyId && isVisible === true) load();
    else if (isVisible === false || !societyId) setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when period or report type changes
  }, [societyId, isVisible, reportType, selectedMonth, selectedYear]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  if ((loading && !summary && !error) || (societyId && isVisible === null)) {
    return (
      <SafeScreen style={styles.safe} edges={[]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeScreen>
    );
  }

  if (!isVisible) {
    return (
      <SafeScreen style={styles.safe} edges={[]}>
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
          <Text style={styles.infoText}>
            Financial reports are currently not visible. Please contact your administrator if you need access.
          </Text>
        </View>
      </SafeScreen>
    );
  }

  if (error) {
    return (
      <SafeScreen style={styles.safe} edges={[]}>
        <Text style={styles.title}>Financial Summary</Text>
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={24} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeScreen>
    );
  }

  const hasData = summary && (summary.total_income !== undefined || summary.total_expenses !== undefined);

  return (
    <SafeScreen style={styles.safe} edges={[]}>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Financial Summary</Text>
        <Text style={styles.subtitle}>View your society{"'"}s financial overview</Text>

        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tab, reportType === 'monthly' && styles.tabActive]}
            onPress={() => setReportType('monthly')}
          >
            <Text style={[styles.tabText, reportType === 'monthly' && styles.tabTextActive]}>Monthly Summary</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, reportType === 'yearly' && styles.tabActive]}
            onPress={() => setReportType('yearly')}
          >
            <Text style={[styles.tabText, reportType === 'yearly' && styles.tabTextActive]}>Yearly Summary</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pickersRow}>
          {reportType === 'monthly' && (
            <View style={styles.pickerWrap}>
              <Text style={styles.pickerLabel}>Month</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScroll}>
                {MONTH_NAMES.map((name, i) => {
                  const monthNum = i + 1;
                  const isSelected = selectedMonth === monthNum;
                  return (
                    <TouchableOpacity
                      key={monthNum}
                      style={[styles.monthChip, isSelected && styles.monthChipActive]}
                      onPress={() => setSelectedMonth(monthNum)}
                    >
                      <Text style={[styles.monthChipText, isSelected && styles.monthChipTextActive]}>{name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
          <View style={styles.pickerWrap}>
            <Text style={styles.pickerLabel}>Year</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.yearScroll}>
              {yearOptions.map((y) => {
                const isSelected = selectedYear === y;
                return (
                  <TouchableOpacity
                    key={y}
                    style={[styles.yearChip, isSelected && styles.yearChipActive]}
                    onPress={() => setSelectedYear(y)}
                  >
                    <Text style={[styles.yearChipText, isSelected && styles.yearChipTextActive]}>{y}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {loading && summary ? (
          <View style={styles.centeredMin}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : !hasData ? (
          // Shown only when response lacked total_income/total_expenses (e.g. unexpected API shape)
          <View style={styles.card}>
            <Text style={styles.emptyText}>No financial data available for the selected period</Text>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.label}>Total Income</Text>
                <Ionicons name="trending-up" size={20} color={colors.success} />
              </View>
              <Text style={[styles.value, { color: colors.success }]}>{formatCurrency(summary.total_income)}</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.label}>Total Expenses</Text>
                <Ionicons name="trending-down" size={20} color={colors.error} />
              </View>
              <Text style={[styles.value, { color: colors.error }]}>{formatCurrency(summary.total_expenses)}</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.label}>Net Income</Text>
                <Ionicons name="wallet-outline" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.value, { color: colors.primary }]}>{formatCurrency(summary.net_income ?? summary.balance)}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingBottom: 24 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centeredMin: { paddingVertical: 24, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 20 },
  tabsRow: { flexDirection: 'row', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { paddingVertical: 12, paddingHorizontal: 16, marginRight: 8 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary, marginBottom: -1 },
  tabText: { fontSize: 15, color: colors.textMuted },
  tabTextActive: { fontSize: 15, fontWeight: '600', color: colors.primary },
  pickersRow: { marginBottom: 20 },
  pickerWrap: { marginBottom: 12 },
  pickerLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 6 },
  monthScroll: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  monthChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  monthChipActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  monthChipText: { fontSize: 14, color: colors.text },
  monthChipTextActive: { color: '#fff', fontWeight: '600' },
  yearScroll: { flexDirection: 'row', gap: 8 },
  yearChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  yearChipActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  yearChipText: { fontSize: 14, color: colors.text },
  yearChipTextActive: { color: '#fff', fontWeight: '600' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  label: { fontSize: 14, color: colors.textSecondary },
  value: { fontSize: 18, fontWeight: '700' },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingVertical: 16 },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surfaceSecondary,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoText: { flex: 1, fontSize: 14, color: colors.textSecondary },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: `${colors.error}14`,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: { flex: 1, fontSize: 14, color: colors.error },
});
