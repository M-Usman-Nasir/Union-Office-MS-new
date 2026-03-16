/* global process */
import { useState, useEffect } from 'react';
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
  ScrollView,
} from 'react-native';
import SafeScreen from '../components/SafeScreen';
import { useAuth } from '../context/AuthContext';
import { maintenanceApi } from '../api/maintenance';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { colors } from '../theme';

const baseApiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const getServerBaseUrl = () => baseApiUrl.replace(/\/api\/?$/, '');

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount || 0);
}

function formatPaymentDate(dateValue) {
  if (!dateValue) return '—';
  return new Date(dateValue).toLocaleDateString('en-PK', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function getStatusColor(status) {
  if (status === 'paid') return colors.success;
  if (status === 'partially_paid') return colors.warning;
  if (status === 'pending') return colors.error;
  return colors.textMuted;
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
        maintenanceApi.getAll({ unit_id: user.unit_id, limit: 50, page: 1 }),
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

  const canUploadProof = (row) =>
    (row.status === 'pending' || row.status === 'partially_paid') && !pendingByMaintenanceId[row.id];

  const totalPending =
    list.filter((m) => (m.status || '').toLowerCase() === 'pending').reduce((sum, m) => sum + parseFloat(m.total_amount || 0), 0) || 0;
  const totalPaid =
    list.filter((m) => (m.status || '').toLowerCase() === 'paid').reduce((sum, m) => sum + parseFloat(m.total_amount || 0), 0) || 0;

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
    const url = `${getServerBaseUrl()}${receiptPath}`;
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open receipt'));
  };

  const renderStatus = (row) => {
    if (pendingByMaintenanceId[row.id]) {
      return <Text style={[styles.statusChip, styles.statusPendingVerification]}>Pending verification</Text>;
    }
    const status = (row.status || '').toLowerCase();
    return (
      <View style={[styles.statusChip, { backgroundColor: getStatusColor(status) }]}>
        <Text style={styles.statusChipText}>{row.status}</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Payment ID</Text>
        <Text style={styles.cardValue}>{item.id != null ? `PAY-${String(item.id).padStart(3, '0')}` : '—'}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Flat</Text>
        <Text style={styles.cardValue}>{item.unit_number ?? '—'}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Month</Text>
        <Text style={styles.cardValue}>{item.month}/{item.year}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Base</Text>
        <Text style={styles.cardValue}>{formatCurrency(item.base_amount)}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Total</Text>
        <Text style={[styles.cardValue, styles.totalAmount]}>{formatCurrency(item.total_amount)}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Amount paid</Text>
        <Text style={styles.cardValue}>{formatCurrency(item.amount_paid || 0)}</Text>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Payment date</Text>
        <Text style={styles.cardValue}>{formatPaymentDate(item.payment_date)}</Text>
      </View>
      <View style={[styles.cardRow, styles.cardRowStatus]}>
        <Text style={styles.cardLabel}>Status</Text>
        {renderStatus(item)}
      </View>
      {item.receipt_path ? (
        <TouchableOpacity style={styles.receiptBtn} onPress={() => openReceipt(item.receipt_path)}>
          <Ionicons name="document-text-outline" size={18} color={colors.primary} />
          <Text style={styles.receiptBtnText}>View receipt</Text>
        </TouchableOpacity>
      ) : null}
      {item.status === 'paid' ? null : pendingByMaintenanceId[item.id] ? (
        <View style={styles.underReviewWrap}>
          <Text style={styles.underReviewText}>Under review</Text>
        </View>
      ) : canUploadProof(item) ? (
        <TouchableOpacity style={styles.uploadProofBtn} onPress={() => openUploadModal(item)}>
          <Ionicons name="cloud-upload-outline" size={18} color={colors.primary} />
          <Text style={styles.uploadProofBtnText}>Upload proof</Text>
        </TouchableOpacity>
      ) : null}
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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>My Maintenance</Text>
        <Text style={styles.subtitle}>
          For unpaid or partially paid dues, you can submit payment proof (e.g. bank slip or receipt). The office will verify and mark it as paid.
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: colors.error }]}>{formatCurrency(totalPending)}</Text>
            <Text style={styles.summaryLabel}>Pending Amount</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: colors.success }]}>{formatCurrency(totalPaid)}</Text>
            <Text style={styles.summaryLabel}>Total Paid</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{list.length}</Text>
            <Text style={styles.summaryLabel}>Total Records</Text>
          </View>
        </View>

        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No maintenance records for your unit</Text>}
        />
      </ScrollView>

      <Modal visible={uploadModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Submit payment proof</Text>
            {uploadRow && (
              <>
                <Text style={styles.modalSubtext}>
                  {uploadRow.month}/{uploadRow.year} · {formatCurrency(uploadRow.total_amount)} due
                </Text>
                <TouchableOpacity style={styles.chooseFileBtn} onPress={pickReceipt} disabled={submitProofLoading}>
                  <Ionicons name="document-attach-outline" size={20} color={colors.primary} />
                  <Text style={styles.chooseFileBtnText}>Choose file (image or PDF)</Text>
                </TouchableOpacity>
                {receiptFile && (
                  <Text style={styles.selectedFile} numberOfLines={1}>Selected: {receiptFile.name}</Text>
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
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 20 },
  summaryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  summaryCard: {
    flex: 1,
    minWidth: '28%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryValue: { fontSize: 16, fontWeight: '700', color: colors.text },
  summaryLabel: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  list: { paddingBottom: 16 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardRowStatus: { alignItems: 'center' },
  cardLabel: { fontSize: 13, color: colors.textMuted },
  cardValue: { fontSize: 14, color: colors.text, fontWeight: '500' },
  totalAmount: { color: colors.primary, fontWeight: '600' },
  statusChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusChipText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  statusPendingVerification: { backgroundColor: colors.primary },
  receiptBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  receiptBtnText: { fontSize: 14, color: colors.primary, fontWeight: '600' },
  underReviewWrap: { marginTop: 10 },
  underReviewText: { fontSize: 13, color: colors.textMuted, fontStyle: 'italic' },
  uploadProofBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  uploadProofBtnText: { fontSize: 14, color: colors.primary, fontWeight: '600' },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 24 },
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
