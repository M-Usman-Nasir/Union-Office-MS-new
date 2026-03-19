import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeScreen from '../components/SafeScreen';
import { useAuth } from '../context/AuthContext';
import { defaultersApi } from '../api/defaulters';
import { propertyApi } from '../api/property';
import { colors, spacing } from '../theme';

const LIST_LIMIT = 500;

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount || 0);
}

function pendingAmount(item) {
  return parseFloat(item.amount_due ?? item.pending_amount) || 0;
}

function monthsOverdue(item) {
  const m = parseInt(String(item.months_overdue ?? 0), 10);
  return Number.isFinite(m) ? m : 0;
}

/** Approximate days label for UI (backend stores months_overdue). */
function overdueDaysLabel(item) {
  const mo = monthsOverdue(item);
  const days = Math.max(15, mo * 30);
  return `${days}+ Days`;
}

function severity(item) {
  const mo = monthsOverdue(item);
  if (mo >= 2) return 'critical';
  if (mo >= 1) return 'overdue';
  return 'due';
}

function SelectPickerModal({ visible, title, options, selectedKey, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.pickerOverlay}>
        <TouchableOpacity style={styles.pickerBackdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.pickerSheet}>
          <Text style={styles.pickerTitle}>{title}</Text>
          <ScrollView style={styles.pickerScroll} keyboardShouldPersistTaps="handled">
            {options.map((opt) => {
              const selected = opt.key === selectedKey || (opt.key == null && selectedKey == null);
              return (
                <TouchableOpacity
                  key={opt.key === null ? 'all' : String(opt.key)}
                  style={[styles.pickerRow, selected && styles.pickerRowSelected]}
                  onPress={() => {
                    onSelect(opt.key);
                    onClose();
                  }}
                >
                  <Text style={[styles.pickerRowText, selected && styles.pickerRowTextSelected]}>
                    {opt.label}
                  </Text>
                  {selected ? <Ionicons name="checkmark" size={20} color={colors.primary} /> : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

SelectPickerModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.oneOf([null])]),
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function DefaulterScreen() {
  const { user } = useAuth();
  const societyId = user?.society_apartment_id;

  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [blocks, setBlocks] = useState([]);
  const [floors, setFloors] = useState([]);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [selectedFloorId, setSelectedFloorId] = useState(null);
  const [blockPickerOpen, setBlockPickerOpen] = useState(false);
  const [floorPickerOpen, setFloorPickerOpen] = useState(false);

  const loadBlocks = useCallback(async () => {
    if (!societyId) return;
    try {
      const res = await propertyApi.getBlocks({ society_id: societyId });
      const raw = res.data?.data ?? res.data;
      setBlocks(Array.isArray(raw) ? raw : raw?.data || []);
    } catch (e) {
      setBlocks([]);
    }
  }, [societyId]);

  const loadFloors = useCallback(async (blockId) => {
    if (!blockId) {
      setFloors([]);
      return;
    }
    try {
      const res = await propertyApi.getFloors({ block_id: blockId });
      const raw = res.data?.data ?? res.data;
      setFloors(Array.isArray(raw) ? raw : raw?.data || []);
    } catch (e) {
      setFloors([]);
    }
  }, []);

  const loadDefaulters = useCallback(async () => {
    if (!societyId) {
      setList([]);
      setPagination({ total: 0 });
      setLoading(false);
      return;
    }
    try {
      const params = {
        society_id: societyId,
        limit: LIST_LIMIT,
        page: 1,
        status: 'active',
      };
      if (selectedBlockId != null) params.block_id = selectedBlockId;
      if (selectedFloorId != null) params.floor_id = selectedFloorId;

      const res = await defaultersApi.getAll(params);
      const raw = res.data?.data ?? res.data;
      const items = Array.isArray(raw) ? raw : raw?.data || [];
      setList(items);
      setPagination(res.data?.pagination || { total: items.length });
    } catch (e) {
      setList([]);
      setPagination({ total: 0 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [societyId, selectedBlockId, selectedFloorId]);

  useEffect(() => {
    if (user) loadBlocks();
  }, [user, loadBlocks]);

  useEffect(() => {
    if (selectedBlockId != null) {
      loadFloors(selectedBlockId);
    } else {
      setFloors([]);
      setSelectedFloorId(null);
    }
  }, [selectedBlockId, loadFloors]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      loadDefaulters();
    }
  }, [user, loadDefaulters]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDefaulters();
  };

  const resetFilters = () => {
    setSelectedBlockId(null);
    setSelectedFloorId(null);
  };

  const blockLabel = useMemo(() => {
    if (selectedBlockId == null) return 'All Blocks';
    const b = blocks.find((x) => x.id === selectedBlockId);
    return b?.name || b?.block_number || `Block ${selectedBlockId}`;
  }, [blocks, selectedBlockId]);

  const floorLabel = useMemo(() => {
    if (selectedFloorId == null) return 'All Floors';
    const f = floors.find((x) => x.id === selectedFloorId);
    if (f?.floor_number != null) return `Floor ${f.floor_number}`;
    return f?.name || `Floor ${selectedFloorId}`;
  }, [floors, selectedFloorId]);

  const blockOptions = useMemo(
    () => [{ key: null, label: 'All Blocks' }, ...blocks.map((b) => ({ key: b.id, label: b.name || b.block_number || `Block ${b.id}` }))],
    [blocks],
  );

  const floorOptions = useMemo(
    () => [{ key: null, label: 'All Floors' }, ...floors.map((f) => ({ key: f.id, label: f.floor_number != null ? `Floor ${f.floor_number}` : f.name || `Floor ${f.id}` }))],
    [floors],
  );

  const activeDefaultersCount = pagination?.total ?? list.length;
  const totalPendingSum = useMemo(() => list.reduce((sum, item) => sum + pendingAmount(item), 0), [list]);

  const openPhone = (phone) => {
    if (!phone) return;
    const cleaned = String(phone).replace(/\s/g, '');
    Linking.openURL(`tel:${cleaned}`).catch(() => {});
  };

  const renderItem = ({ item }) => {
    const unitNo = item.unit_number != null ? String(item.unit_number) : '—';
    const flatLabel = unitNo.startsWith('Flat') || unitNo.startsWith('Unit') ? unitNo : `Flat ${unitNo}`;
    const name = item.resident_name || item.name || item.owner_name || '—';
    const phone = item.resident_contact || item.contact_number || '';
    const amount = pendingAmount(item);
    const daysLine = overdueDaysLabel(item);
    const sev = severity(item);

    return (
      <View style={styles.listCard}>
        <View style={styles.listCardTop}>
          <Text style={styles.flatText}>{flatLabel}</Text>
          <Text style={styles.amountRight}>{formatCurrency(amount)}</Text>
        </View>
        <View style={styles.listCardMid}>
          <View style={styles.namePhone}>
            <Text style={styles.residentName} numberOfLines={1}>
              {name}
            </Text>
            {phone ? (
              <TouchableOpacity style={styles.phoneRow} onPress={() => openPhone(phone)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.phoneText} numberOfLines={1}>
                  {phone}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <Text style={styles.daysRight}>{daysLine}</Text>
        </View>
        <View style={styles.listCardBottom}>
          <Text style={styles.overdueSince}>Overdue since {daysLine}</Text>
          {sev === 'critical' ? (
            <View style={[styles.badge, styles.badgeCritical]}>
              <Text style={styles.badgeCriticalText}>CRITICAL</Text>
            </View>
          ) : sev === 'overdue' ? (
            <View style={[styles.badge, styles.badgeOverdue]}>
              <Text style={styles.badgeOverdueText}>OVERDUE</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.badgeDue]}>
              <Text style={styles.badgeDueText}>DUE</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const ListHeader = () => (
    <View style={styles.headerBlock}>
      <View style={styles.infoBanner}>
        <Ionicons name="warning" size={22} color={colors.warning} style={styles.bannerIcon} />
        <Text style={styles.bannerText}>
          This section helps maintain transparency. Filter by block, floor, or unit to view defaulters.
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.statCardLeft]}>
          <Text style={styles.statLabel}>ACTIVE DEFAULTERS</Text>
          <Text style={styles.statValue}>{activeDefaultersCount}</Text>
        </View>
        <View style={[styles.statCard, styles.statCardRight]}>
          <Text style={styles.statLabel}>TOTAL PENDING</Text>
          <Text style={styles.statValue}>{formatCurrency(totalPendingSum)}</Text>
        </View>
      </View>

      <View style={styles.filterCard}>
        <Text style={styles.filterLabel}>SELECT BLOCK</Text>
        <TouchableOpacity style={styles.selectRow} onPress={() => setBlockPickerOpen(true)} activeOpacity={0.7}>
          <Text style={styles.selectRowText} numberOfLines={1}>
            {blockLabel}
          </Text>
          <Ionicons name="chevron-down" size={22} color={colors.textMuted} />
        </TouchableOpacity>

        <Text style={[styles.filterLabel, styles.filterLabelSpacing]}>SELECT FLOOR</Text>
        <TouchableOpacity
          style={[styles.selectRow, selectedBlockId == null && styles.selectRowDisabled]}
          onPress={() => selectedBlockId != null && setFloorPickerOpen(true)}
          activeOpacity={selectedBlockId == null ? 1 : 0.7}
          disabled={selectedBlockId == null}
        >
          <Text style={[styles.selectRowText, selectedBlockId == null && styles.selectRowTextMuted]} numberOfLines={1}>
            {selectedBlockId == null ? 'Select a block first' : floorLabel}
          </Text>
          <Ionicons name="chevron-down" size={22} color={selectedBlockId == null ? colors.border : colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetBtn} onPress={resetFilters} activeOpacity={0.7}>
          <Text style={styles.resetBtnText}>Reset Filters</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.listSectionTitle}>RESIDENTS WITH PENDING DUES</Text>
    </View>
  );

  if (!societyId) {
    return (
      <SafeScreen style={styles.safe} edges={[]}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Society assignment required to view defaulters.</Text>
        </View>
      </SafeScreen>
    );
  }

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
        keyExtractor={(item) => String(item.id ?? item.unit_id)}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No defaulters match the current filters</Text>
          </View>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      />

      <SelectPickerModal
        visible={blockPickerOpen}
        title="Select block"
        options={blockOptions}
        selectedKey={selectedBlockId}
        onSelect={(key) => {
          setSelectedBlockId(key);
          setSelectedFloorId(null);
        }}
        onClose={() => setBlockPickerOpen(false)}
      />
      <SelectPickerModal
        visible={floorPickerOpen}
        title="Select floor"
        options={floorOptions}
        selectedKey={selectedFloorId}
        onSelect={(key) => setSelectedFloorId(key)}
        onClose={() => setFloorPickerOpen(false)}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  listContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.screenBottom,
    paddingTop: spacing.screenTop,
  },
  headerBlock: { marginBottom: 4 },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.alertCardBg,
    borderWidth: 1,
    borderColor: colors.alertCardBorder,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  bannerIcon: { marginRight: 10, marginTop: 2 },
  bannerText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.alertTitle,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.paymentCardBorder,
    padding: 14,
  },
  statCardLeft: {},
  statCardRight: {},
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  filterCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: colors.textMuted,
    marginBottom: 8,
  },
  filterLabelSpacing: { marginTop: 4 },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.surfaceSecondary,
  },
  selectRowDisabled: {
    opacity: 0.65,
    backgroundColor: colors.background,
  },
  selectRowText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
    marginRight: 8,
  },
  selectRowTextMuted: {
    color: colors.textMuted,
  },
  resetBtn: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  resetBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMuted,
  },
  listSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  listCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  flatText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
    flex: 1,
    marginRight: 8,
  },
  amountRight: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.error,
  },
  listCardMid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  namePhone: { flex: 1, marginRight: 8 },
  residentName: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 6,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  phoneText: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  daysRight: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  listCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overdueSince: {
    fontSize: 12,
    color: colors.textMuted,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  badgeCritical: {
    backgroundColor: '#FEE2E2',
  },
  badgeCriticalText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B91C1C',
    letterSpacing: 0.4,
  },
  badgeOverdue: {
    backgroundColor: '#FEF9C3',
  },
  badgeOverdueText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#854d0e',
    letterSpacing: 0.4,
  },
  badgeDue: {
    backgroundColor: '#FEFCE8',
  },
  badgeDueText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#a16207',
    letterSpacing: 0.4,
  },
  emptyWrap: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
  },
  pickerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 32,
  },
  pickerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  pickerSheet: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    maxHeight: '70%',
    paddingBottom: 8,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pickerScroll: { maxHeight: 360 },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pickerRowSelected: {
    backgroundColor: colors.statChipBg,
  },
  pickerRowText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  pickerRowTextSelected: {
    fontWeight: '600',
    color: colors.primary,
  },
});
