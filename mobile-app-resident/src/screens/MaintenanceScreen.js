/* global process */
import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import SafeScreen from '../components/SafeScreen';
import { useAuth } from '../context/AuthContext';
import { maintenanceApi } from '../api/maintenance';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { colors, spacing } from '../theme';

const baseApiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const getServerBaseUrl = () => baseApiUrl.replace(/\/api\/?$/, '');
const resolveFileUrl = (pathOrUrl) => {
  if (!pathOrUrl) return null;
  if (String(pathOrUrl).startsWith('http://') || String(pathOrUrl).startsWith('https://')) return pathOrUrl;
  return `${getServerBaseUrl()}${pathOrUrl}`;
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** First page size for maintenance history (no date filter; ~10 years at one row/month). */
const MAINTENANCE_HISTORY_LIMIT = 120;

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount || 0);
}

function formatPaymentDate(dateValue) {
  if (!dateValue) return null;
  return new Date(dateValue).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDueShort(dateValue) {
  if (!dateValue) return null;
  return new Date(dateValue).toLocaleDateString('en-PK', {
    month: 'short',
    day: 'numeric',
  });
}

function formatMonthYear(month, year) {
  const m = parseInt(String(month), 10);
  const y = parseInt(String(year), 10);
  if (!m || m < 1 || m > 12 || !y) return '—';
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

function isPaidStatus(status) {
  return ['paid', 'closed', 'cancelled'].includes((status || '').toLowerCase());
}

function rowBalance(m) {
  const total = parseFloat(m.total_amount) || 0;
  const paid = parseFloat(m.amount_paid) || 0;
  return Math.max(0, total - paid);
}

export default function MaintenanceScreen() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadRow, setUploadRow] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [proofNote, setProofNote] = useState('');
  const [submitProofLoading, setSubmitProofLoading] = useState(false);

  const load = async () => {
    if (!user?.unit_id) return;
    try {
      const [res, reqRes] = await Promise.all([
        maintenanceApi.getAll({ unit_id: user.unit_id, limit: MAINTENANCE_HISTORY_LIMIT, page: 1 }),
        maintenanceApi.getMyPaymentRequests().catch(() => ({ data: { data: [] } })),
      ]);
      const raw = res.data?.data ?? res.data;
      setList(Array.isArray(raw) ? raw : (raw?.data || []));
      const reqData = reqRes.data?.data ?? reqRes.data;
      setPaymentRequests(Array.isArray(reqData) ? reqData : (reqData?.data || []));
    } catch (e) {
      setList([]);
      setPaymentRequests([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when user/unit changes only
  }, [user?.id, user?.unit_id]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const pendingByMaintenanceId = (paymentRequests || [])
    .filter((r) => (r.status || '').toLowerCase() === 'pending')
    .reduce((acc, r) => ({ ...acc, [r.maintenance_id]: true }), {});

  const pendingRequestByMaintenanceId = useMemo(() => {
    const map = {};
    for (const r of paymentRequests || []) {
      if ((r.status || '').toLowerCase() !== 'pending' || r.maintenance_id == null) continue;
      map[r.maintenance_id] = r;
    }
    return map;
  }, [paymentRequests]);

  const canUploadProof = (row) =>
    (row.status === 'pending' || row.status === 'partially_paid') && !pendingByMaintenanceId[row.id];

  const sortedList = useMemo(() => {
    return [...list].sort((a, b) => {
      const ya = parseInt(String(a.year), 10) || 0;
      const yb = parseInt(String(b.year), 10) || 0;
      if (yb !== ya) return yb - ya;
      const ma = parseInt(String(a.month), 10) || 0;
      const mb = parseInt(String(b.month), 10) || 0;
      return mb - ma;
    });
  }, [list]);

  const totalDue = useMemo(() => {
    return list.reduce((sum, m) => {
      if (isPaidStatus(m.status)) return sum;
      return sum + rowBalance(m);
    }, 0);
  }, [list]);

  const lastPaidRecord = useMemo(() => {
    const paid = list.filter((m) => isPaidStatus(m.status) && m.payment_date);
    if (!paid.length) return null;
    return [...paid].sort(
      (a, b) => new Date(b.payment_date || 0) - new Date(a.payment_date || 0),
    )[0];
  }, [list]);

  const firstPayableRow = useMemo(() => {
    const pending = (paymentRequests || [])
      .filter((r) => (r.status || '').toLowerCase() === 'pending')
      .reduce((acc, r) => ({ ...acc, [r.maintenance_id]: true }), {});
    return sortedList.find(
      (m) => (m.status === 'pending' || m.status === 'partially_paid') && !pending[m.id],
    );
  }, [sortedList, paymentRequests]);

  const paidUp = totalDue < 0.01;

  const openUploadModal = (row) => {
    setUploadRow(row);
    setReceiptFile(null);
    setProofNote('');
    setUploadModalVisible(true);
  };

  const closeUploadModal = () => {
    setUploadModalVisible(false);
    setUploadRow(null);
    setReceiptFile(null);
    setProofNote('');
  };

  const pickReceipt = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled) return;
      const file = result.assets?.[0] || result;
      setReceiptFile(file);
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not pick file');
    }
  };

  const handleSubmitProof = async () => {
    if (!uploadRow || !receiptFile) {
      Alert.alert('Required', 'Please select a file (image or PDF).');
      return;
    }
    setSubmitProofLoading(true);
    try {
      const formData = new FormData();
      formData.append('proof', {
        uri: receiptFile.uri,
        name: receiptFile.name || `proof_${Date.now()}.jpg`,
        type: receiptFile.mimeType || 'image/jpeg',
      });
      if (proofNote.trim()) formData.append('note', proofNote.trim());
      await maintenanceApi.submitPaymentProof(uploadRow.id, formData);
      Alert.alert('Success', 'Payment proof submitted. The office will review it shortly.');
      closeUploadModal();
      load();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to submit proof');
    } finally {
      setSubmitProofLoading(false);
    }
  };

  const openReceipt = (receiptPath) => {
    if (!receiptPath) return;
    const url = resolveFileUrl(receiptPath);
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open receipt'));
  };

  const onPayNow = () => {
    if (firstPayableRow) {
      openUploadModal(firstPayableRow);
      return;
    }
    if (!paidUp) {
      Alert.alert(
        'Payment',
        'Your payment is being verified or no online proof is needed for this period. Contact the office if you need help.',
      );
      return;
    }
    Alert.alert('Paid up', 'You have no outstanding maintenance dues.');
  };

  const getRowDisplayStatus = (row) => {
    if (pendingByMaintenanceId[row.id]) return 'pending_verify';
    if (isPaidStatus(row.status)) return 'paid';
    return 'unpaid';
  };

  const onPressHistoryRow = (item) => {
    const display = getRowDisplayStatus(item);
    if (display === 'paid' && item.receipt_path) {
      openReceipt(item.receipt_path);
      return;
    }
    if (display === 'unpaid' && canUploadProof(item)) {
      openUploadModal(item);
      return;
    }
    if (display === 'pending_verify') {
      const proof = pendingRequestByMaintenanceId[item.id]?.proof_path;
      if (proof) {
        openReceipt(proof);
        return;
      }
      Alert.alert('Under review', 'Your payment proof is being verified by the office.');
    }
  };

  const renderHistoryRow = ({ item, index }) => {
    const display = getRowDisplayStatus(item);
    const amount = isPaidStatus(item.status)
      ? parseFloat(item.total_amount) || 0
      : rowBalance(item) || parseFloat(item.total_amount) || 0;
    const dueLine = item.due_date
      ? `Due: ${formatDueShort(item.due_date)}`
      : item.month && item.year
        ? `Due: end of ${MONTH_NAMES[(parseInt(String(item.month), 10) || 1) - 1]?.slice(0, 3) || ''} ${item.year}`
        : 'Due: —';
    const paidLine = formatPaymentDate(item.payment_date);
    const isFirst = index === 0;
    const isLast = index === sortedList.length - 1;

    return (
      <TouchableOpacity
        style={[
          styles.historyRow,
          isFirst && styles.historyRowFirst,
          isLast && styles.historyRowLast,
        ]}
        onPress={() => onPressHistoryRow(item)}
        activeOpacity={0.7}
      >
        <View style={styles.historyRowLeft}>
          <Text style={styles.historyMonth}>{formatMonthYear(item.month, item.year)}</Text>
          <Text style={styles.historySub}>
            {display === 'paid' && paidLine ? `Paid: ${paidLine}` : dueLine}
          </Text>
        </View>
        <View style={styles.historyRowRight}>
          <Text style={styles.historyAmount}>{formatCurrency(amount)}</Text>
          {display === 'paid' ? (
            <View style={[styles.badge, styles.badgePaid]}>
              <Text style={styles.badgePaidText}>PAID</Text>
            </View>
          ) : display === 'pending_verify' ? (
            <View style={[styles.badge, styles.badgePending]}>
              <Text style={styles.badgePendingText}>PENDING</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.badgeUnpaid]}>
              <Text style={styles.badgeUnpaidText}>UNPAID</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View style={styles.headerBlock}>
      <View style={styles.paymentSummaryCard}>
        <Text style={styles.sectionLabel}>PAYMENT SUMMARY</Text>
        <Text style={styles.totalDueLabel}>Total Due</Text>
        <Text style={styles.totalDueAmount}>{formatCurrency(totalDue)}</Text>
        <Text style={styles.lastPaymentText}>
          Last payment: {lastPaidRecord ? formatPaymentDate(lastPaidRecord.payment_date) : '—'}
        </Text>
        <View style={[styles.summaryBadge, paidUp ? styles.summaryBadgePaid : styles.summaryBadgeDue]}>
          <Text style={[styles.summaryBadgeText, paidUp ? styles.summaryBadgeTextPaid : styles.summaryBadgeTextDue]}>
            {paidUp ? 'PAID UP' : 'DUE'}
          </Text>
        </View>
      </View>

      <Text style={styles.historySectionTitle}>MAINTENANCE HISTORY</Text>
    </View>
  );

  const ListFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity
        style={[styles.payNowBtn, paidUp && !firstPayableRow && styles.payNowBtnMuted]}
        onPress={onPayNow}
        activeOpacity={0.85}
      >
        <Text style={styles.payNowBtnText}>Pay Now</Text>
      </TouchableOpacity>
      <Text style={styles.footerHint}>
        Tap a row to upload proof (unpaid), open your submitted proof (pending), or open receipt (paid).
      </Text>
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
        data={sortedList}
        renderItem={renderHistoryRow}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        ListEmptyComponent={
          <View style={styles.historyCardEmpty}>
            <Text style={styles.empty}>No maintenance records for your unit</Text>
          </View>
        }
      />

      <Modal visible={uploadModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Submit payment proof</Text>
            {uploadRow && (
              <>
                <Text style={styles.modalSubtext}>
                  {formatMonthYear(uploadRow.month, uploadRow.year)} · {formatCurrency(uploadRow.total_amount)} due
                </Text>
                <TouchableOpacity style={styles.chooseFileBtn} onPress={pickReceipt} disabled={submitProofLoading}>
                  <Ionicons name="document-attach-outline" size={20} color={colors.primary} />
                  <Text style={styles.chooseFileBtnText}>Choose file (image or PDF)</Text>
                </TouchableOpacity>
                {receiptFile && (
                  <Text style={styles.selectedFile} numberOfLines={1}>
                    Selected: {receiptFile.name}
                  </Text>
                )}
                <TextInput
                  style={styles.noteInput}
                  placeholder="Note (optional) — e.g. transaction reference"
                  placeholderTextColor={colors.textMuted}
                  value={proofNote}
                  onChangeText={setProofNote}
                  multiline
                  numberOfLines={2}
                  editable={!submitProofLoading}
                />
              </>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={closeUploadModal} disabled={submitProofLoading}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSubmitBtn, (!receiptFile || submitProofLoading) && styles.modalSubmitBtnDisabled]}
                onPress={handleSubmitProof}
                disabled={!receiptFile || submitProofLoading}
              >
                {submitProofLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalSubmitText}>Submit proof</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.screenTop,
    paddingBottom: spacing.screenBottom,
  },
  headerBlock: { marginBottom: 12 },
  paymentSummaryCard: {
    backgroundColor: colors.paymentCardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.paymentCardBorder,
    padding: 18,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  totalDueLabel: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 4,
  },
  totalDueAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  lastPaymentText: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 12,
  },
  summaryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  summaryBadgePaid: {
    backgroundColor: 'rgba(22, 163, 74, 0.14)',
  },
  summaryBadgeDue: {
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
  },
  summaryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  summaryBadgeTextPaid: {
    color: colors.success,
  },
  summaryBadgeTextDue: {
    color: colors.error,
  },
  historySectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  historyCardEmpty: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  historyRowFirst: {
    borderTopWidth: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  historyRowLast: {
    borderBottomWidth: 1,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  historyRowLeft: { flex: 1, paddingRight: 12 },
  historyRowRight: { alignItems: 'flex-end' },
  historyMonth: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  historySub: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
    textAlign: 'right',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgePaid: {
    backgroundColor: '#E6F7ED',
  },
  badgePaidText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803d',
    letterSpacing: 0.3,
  },
  badgeUnpaid: {
    backgroundColor: '#FEE2E2',
  },
  badgeUnpaidText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B91C1C',
    letterSpacing: 0.3,
  },
  badgePending: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  badgePendingText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.3,
  },
  footer: {
    marginTop: 8,
    paddingBottom: 8,
  },
  payNowBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payNowBtnMuted: {
    opacity: 0.85,
  },
  payNowBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  footerHint: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 8,
  },
  empty: {
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, width: '100%', maxWidth: 400 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
  modalSubtext: { fontSize: 14, color: colors.textSecondary, marginBottom: 16 },
  chooseFileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    marginBottom: 8,
  },
  chooseFileBtnText: { fontSize: 15, color: colors.primary, fontWeight: '500' },
  selectedFile: { fontSize: 12, color: colors.textMuted, marginBottom: 12 },
  noteInput: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  modalCancelBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  modalCancelText: { fontSize: 15, color: colors.textMuted },
  modalSubmitBtn: { backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  modalSubmitBtnDisabled: { opacity: 0.6 },
  modalSubmitText: { fontSize: 15, color: '#fff', fontWeight: '600' },
});
