import { useState, useEffect, useMemo } from 'react';
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
import { colors, spacing } from '../theme';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount || 0);
}

function parseNum(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function humanizeCategory(raw) {
  if (raw == null || String(raw).trim() === '') return 'Uncategorized';
  return String(raw)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeIncomeBreakdown(rows) {
  return (rows || []).map((r) => ({
    category: humanizeCategory(r.income_type),
    total: parseNum(r.total),
    count: parseInt(r.count, 10) || 0,
  }));
}

function normalizeExpenseBreakdown(rows) {
  return (rows || []).map((r) => ({
    category: humanizeCategory(r.expense_type),
    total: parseNum(r.total),
    count: parseInt(r.count, 10) || 0,
  }));
}

export default function FinancialSummaryScreen() {
  const { user } = useAuth();
  const societyId = user?.society_apartment_id;
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [reportType, setReportType] = useState('monthly');
  /** View-only tab: which breakdown list to show */
  const [breakdownTab, setBreakdownTab] = useState('income');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [summary, setSummary] = useState(null);
  const [incomeBreakdown, setIncomeBreakdown] = useState([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const isVisible = settings === null ? null : settings?.financial_reports_visible !== false;
  /** Only show the current calendar year (e.g. 2026) — no past-year chips when data exists for one year only */
  const yearOptions = [currentYear];

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
        const data = res.data?.data ?? res.data;
        const monthlySummary = data?.summary ?? data;
        setSummary(
          monthlySummary && (monthlySummary.total_income !== undefined || monthlySummary.total_expenses !== undefined)
            ? {
                total_income: parseNum(monthlySummary.total_income),
                total_expenses: parseNum(monthlySummary.total_expenses),
                net_income: parseNum(monthlySummary.net_income),
              }
            : { total_income: 0, total_expenses: 0, net_income: 0 },
        );
        setIncomeBreakdown(normalizeIncomeBreakdown(data?.incomeBreakdown));
        setExpenseBreakdown(normalizeExpenseBreakdown(data?.expenseBreakdown));
      } else {
        const res = await financeApi.getYearlyReport({
          society_id: societyId,
          year: selectedYear,
        });
        const raw = res.data?.data ?? res.data;
        const yearly = raw?.yearly ?? raw;
        const yearlyObj = yearly && typeof yearly === 'object' ? yearly : {};
        setSummary({
          total_income: parseNum(yearlyObj.total_income),
          total_expenses: parseNum(yearlyObj.total_expenses),
          net_income: parseNum(yearlyObj.net_income),
        });
        setIncomeBreakdown(normalizeIncomeBreakdown(raw?.incomeBreakdown));
        setExpenseBreakdown(normalizeExpenseBreakdown(raw?.expenseBreakdown));
      }
    } catch (e) {
      setSummary(null);
      setIncomeBreakdown([]);
      setExpenseBreakdown([]);
      setError(
        e.response?.status === 403
          ? 'You do not have permission to view financial reports.'
          : e.response?.data?.message || 'Failed to load financial summary. Please try again.',
      );
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

  const breakdownTotal = breakdownTab === 'income' ? summary?.total_income ?? 0 : summary?.total_expenses ?? 0;

  const sortedBreakdown = useMemo(() => {
    const list = breakdownTab === 'income' ? incomeBreakdown : expenseBreakdown;
    return [...list].sort((a, b) => b.total - a.total);
  }, [breakdownTab, incomeBreakdown, expenseBreakdown]);

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
        <Text style={styles.title}>Union Finance Summary</Text>
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
        <Text style={styles.title}>Union Finance Summary</Text>
        <Text style={styles.subtitle}>
          Society-level totals by category only. No individual units or transactions — clean and transparent for all residents.
        </Text>

        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tab, reportType === 'monthly' && styles.tabActive]}
            onPress={() => setReportType('monthly')}
          >
            <Text style={[styles.tabText, reportType === 'monthly' && styles.tabTextActive]}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, reportType === 'yearly' && styles.tabActive]}
            onPress={() => setReportType('yearly')}
          >
            <Text style={[styles.tabText, reportType === 'yearly' && styles.tabTextActive]}>Yearly</Text>
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
                <Text style={styles.label}>Net</Text>
                <Ionicons name="wallet-outline" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.value, { color: colors.primary }]}>{formatCurrency(summary.net_income)}</Text>
            </View>

            <Text style={styles.breakdownSectionTitle}>By category type (totals only)</Text>
            <Text style={styles.viewOnlyHint}>
              One total per category. No unit numbers or individual entries — e.g. Maintenance shows combined amount (e.g. Rs 80,000), not per-unit list.
            </Text>

            <View style={styles.subTabsRow}>
              <TouchableOpacity
                style={[styles.subTab, breakdownTab === 'income' && styles.subTabActive]}
                onPress={() => setBreakdownTab('income')}
              >
                <Ionicons
                  name="trending-up"
                  size={18}
                  color={breakdownTab === 'income' ? colors.primary : colors.textMuted}
                />
                <Text style={[styles.subTabText, breakdownTab === 'income' && styles.subTabTextActive]}>Income</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.subTab, breakdownTab === 'expenses' && styles.subTabActive]}
                onPress={() => setBreakdownTab('expenses')}
              >
                <Ionicons
                  name="trending-down"
                  size={18}
                  color={breakdownTab === 'expenses' ? colors.primary : colors.textMuted}
                />
                <Text style={[styles.subTabText, breakdownTab === 'expenses' && styles.subTabTextActive]}>Expenses</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.breakdownCard}>
              {sortedBreakdown.length === 0 ? (
                <Text style={styles.emptyBreakdown}>
                  {breakdownTab === 'income'
                    ? 'No income recorded by category for this period.'
                    : 'No expenses recorded by category for this period.'}
                </Text>
              ) : (
                sortedBreakdown.map((row, index) => {
                  const pct = breakdownTotal > 0 ? Math.min(100, (row.total / breakdownTotal) * 100) : 0;
                  return (
                    <View
                      key={`${row.category}-${index}`}
                      style={[styles.breakdownRow, index < sortedBreakdown.length - 1 && styles.breakdownRowBorder]}
                    >
                      <View style={styles.breakdownRowTop}>
                        <Text style={styles.breakdownCategory} numberOfLines={2}>
                          {row.category}
                        </Text>
                        <Text style={[styles.breakdownAmount, breakdownTab === 'income' ? styles.amountIncome : styles.amountExpense]}>
                          {formatCurrency(row.total)}
                        </Text>
                      </View>
                      <View style={styles.barTrack}>
                        <View style={[styles.barFill, { width: `${pct}%` }, breakdownTab === 'income' ? styles.barIncome : styles.barExpense]} />
                      </View>
                      <Text style={styles.breakdownMeta}>
                        Combined total · {pct.toFixed(0)}% of {breakdownTab === 'income' ? 'income' : 'expenses'}
                      </Text>
                    </View>
                  );
                })
              )}
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
  content: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.screenBottom,
    paddingTop: spacing.screenTop,
  },
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
  breakdownSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  viewOnlyHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 12,
  },
  subTabsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  subTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  subTabActive: {
    borderColor: colors.primary,
    backgroundColor: colors.statChipBg,
  },
  subTabText: { fontSize: 15, fontWeight: '600', color: colors.textMuted },
  subTabTextActive: { color: colors.primary },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    marginBottom: 16,
  },
  breakdownRow: {
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  breakdownRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  breakdownRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  breakdownCategory: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  breakdownAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  amountIncome: { color: colors.success },
  amountExpense: { color: colors.error },
  barTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceSecondary,
    overflow: 'hidden',
    marginBottom: 6,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  barIncome: { backgroundColor: colors.success },
  barExpense: { backgroundColor: colors.error },
  breakdownMeta: {
    fontSize: 12,
    color: colors.textMuted,
  },
  emptyBreakdown: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surfaceSecondary,
    padding: 16,
    margin: spacing.screenHorizontal,
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
    marginHorizontal: spacing.screenHorizontal,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: { flex: 1, fontSize: 14, color: colors.error },
});
