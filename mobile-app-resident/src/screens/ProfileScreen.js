/* global process */
import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  RefreshControl,
  Platform,
} from 'react-native';
import SafeScreen from '../components/SafeScreen';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth';
import { residentsApi } from '../api/residents';
import { colors } from '../theme';

function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getProfileImageUri(profileImage, baseUrl) {
  if (!profileImage) return null;
  if (profileImage.startsWith('data:image/')) return profileImage;
  const base = (baseUrl || '').replace(/\/api\/?$/, '');
  return base ? `${base}${profileImage}` : null;
}

function getInitials(name) {
  if (!name || typeof name !== 'string') return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatRelationLabel(relation) {
  if (!relation || typeof relation !== 'string') return '—';
  return relation
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function buildUnitSubtitle(data) {
  const flat = data?.unit_number != null && String(data.unit_number).trim() !== ''
    ? `Flat ${data.unit_number}`
    : null;
  const block =
    data?.block_name != null && String(data.block_name).trim() !== ''
      ? `Block ${data.block_name}`
      : null;
  const parts = [flat, block].filter(Boolean);
  return parts.length ? parts.join(', ') : '—';
}

function getOccupancyBadge(displayData, extendedData) {
  const name = (displayData?.name || '').trim().toLowerCase();
  const ownerName = (extendedData?.owner_name || '').trim().toLowerCase();
  if (ownerName && name && ownerName === name) {
    return { label: 'OWNER', variant: 'owner' };
  }
  if (extendedData?.owner_name && name && ownerName !== name) {
    return { label: 'TENANT', variant: 'tenant' };
  }
  const role = (displayData?.role || 'resident').replace(/_/g, ' ').toUpperCase();
  return { label: role, variant: 'default' };
}

function vehicleCountFromExtended(ext) {
  if (!ext) return 0;
  const cars = Number(ext.number_of_cars) || 0;
  const bikes = Number(ext.number_of_bikes) || 0;
  return cars + bikes;
}

function buildVehicleCards(ext) {
  if (!ext) return [];
  const items = [];
  const cars = Number(ext.number_of_cars) || 0;
  const bikes = Number(ext.number_of_bikes) || 0;
  if (cars > 0) {
    if (ext.car_make_model) {
      items.push({
        key: 'car',
        title: String(ext.car_make_model).trim(),
        subtitle: ext.license_plate ? `Plate: ${ext.license_plate}` : null,
      });
    } else {
      items.push({ key: 'car', title: cars === 1 ? '1 vehicle' : `${cars} vehicles`, subtitle: null });
    }
  }
  if (bikes > 0) {
    if (ext.bike_make_model) {
      items.push({
        key: 'bike',
        title: String(ext.bike_make_model).trim(),
        subtitle: ext.bike_license_plate ? `Plate: ${ext.bike_license_plate}` : null,
      });
    } else {
      items.push({ key: 'bike', title: bikes === 1 ? '1 bike' : `${bikes} bikes`, subtitle: null });
    }
  }
  return items;
}

/** One card per utility reference from unit (resident extended API). */
function buildUtilityCards(ext) {
  if (!ext) return [];
  const cards = [];
  const add = (key, icon, label, raw) => {
    if (raw == null || String(raw).trim() === '') return;
    cards.push({ key, icon, label, value: String(raw).trim() });
  };
  add('ke', 'flash-outline', 'K-Electric', ext.k_electric_account);
  add('gas', 'flame-outline', 'Gas', ext.gas_account);
  add('wtr', 'water-outline', 'Water', ext.water_account);
  const phoneTv = ext.phone_tv_account || ext.telephone_bills;
  add('tel', 'call-outline', 'Phone / TV', phoneTv);
  add('oth', 'receipt-outline', 'Other bills', ext.other_bills);
  return cards;
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState(null);
  const [extendedData, setExtendedData] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      const [meRes, residentRes, familyRes] = await Promise.all([
        authApi.getMe(),
        residentsApi.getById(user.id).catch(() => ({ data: null })),
        residentsApi.getFamilyMembers(user.id).catch(() => ({ data: {} })),
      ]);
      const me = meRes.data?.data || meRes.data;
      setProfileData(me || user);
      const resData = residentRes?.data?.data ?? residentRes?.data;
      setExtendedData(resData || null);
      const fmList = familyRes?.data?.data ?? familyRes?.data ?? [];
      setFamilyMembers(Array.isArray(fmList) ? fmList : []);
    } catch (e) {
      setProfileData(user);
      setExtendedData(null);
      setFamilyMembers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const displayData = profileData || user;
  const baseUrl = typeof process !== 'undefined' ? process.env?.EXPO_PUBLIC_API_URL : undefined;
  const imageUri = getProfileImageUri(displayData?.profile_image, baseUrl);
  const occupancy = getOccupancyBadge(displayData, extendedData);
  const vehicleCount = vehicleCountFromExtended(extendedData);
  const vehicleCards = buildVehicleCards(extendedData);
  const utilityCards = buildUtilityCards(extendedData);

  const hasAddress =
    extendedData?.address != null && String(extendedData.address).trim() !== '';
  const showAdditionalCard = Boolean(extendedData && (hasAddress || displayData?.move_in_date));

  if (loading && !displayData) {
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
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Main profile header — navy card */}
        <View style={styles.headerCard}>
          <TouchableOpacity
            style={styles.headerEditBtn}
            onPress={() => navigation.navigate('EditProfile', { profileData: displayData, extendedData })}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="pencil" size={20} color={colors.onNavyMuted} />
          </TouchableOpacity>

          <View style={styles.headerTopRow}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.headerAvatarImg} />
            ) : (
              <View style={styles.headerAvatarInitials}>
                <Text style={styles.headerAvatarInitialsText}>{getInitials(displayData?.name)}</Text>
              </View>
            )}
            <View style={styles.headerNameBlock}>
              <Text style={styles.headerName}>{displayData?.name || 'Resident'}</Text>
              <Text style={styles.headerAddress} numberOfLines={2}>
                {buildUnitSubtitle(displayData)}
              </Text>
            </View>
          </View>

          <View style={styles.headerDivider} />

          <View style={styles.headerInfoRow}>
            <Text style={styles.headerInfoLabel}>CNIC</Text>
            <Text style={styles.headerInfoValue} numberOfLines={1}>
              {displayData?.cnic || '—'}
            </Text>
          </View>
          <View style={styles.headerDividerThin} />
          <View style={styles.headerInfoRow}>
            <Text style={styles.headerInfoLabel}>Phone</Text>
            <Text style={styles.headerInfoValue} numberOfLines={1}>
              {displayData?.contact_number || '—'}
            </Text>
          </View>
          <View style={styles.headerDividerThin} />
          <View style={styles.headerInfoRow}>
            <Text style={styles.headerInfoLabel}>Email</Text>
            <Text style={styles.headerInfoValue} numberOfLines={2}>
              {displayData?.email || '—'}
            </Text>
          </View>
          <View style={styles.headerDividerThin} />
          <View style={styles.headerInfoRow}>
            <Text style={styles.headerInfoLabel}>Status</Text>
            <View
              style={[
                styles.statusPill,
                occupancy.variant === 'owner' && styles.statusPillOwner,
                occupancy.variant === 'tenant' && styles.statusPillTenant,
              ]}
            >
              <Text
                style={[
                  styles.statusPillText,
                  occupancy.variant === 'owner' && styles.statusPillTextOwner,
                  occupancy.variant === 'tenant' && styles.statusPillTextTenant,
                ]}
              >
                {occupancy.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Summary stats */}
        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>FAMILY MEMBERS</Text>
            <Text style={styles.statValue}>{familyMembers.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>VEHICLES</Text>
            <Text style={styles.statValue}>{vehicleCount}</Text>
          </View>
        </View>

        {/* Family members */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeadingRow}>
            <Ionicons name="people-outline" size={22} color={colors.textMuted} />
            <Text style={styles.sectionHeading}>FAMILY MEMBERS</Text>
          </View>
          {familyMembers.length === 0 ? (
            <Text style={styles.emptyHint}>No family members on file</Text>
          ) : (
            familyMembers.map((fm) => (
              <View key={fm.id} style={styles.memberCard}>
                <Text style={styles.memberTitle}>
                  {fm.name}
                  {fm.relation ? ` (${formatRelationLabel(fm.relation)})` : ''}
                </Text>
                <Text style={styles.memberMeta}>
                  Relationship: {formatRelationLabel(fm.relation)}
                </Text>
                <Text style={styles.memberMeta}>CNIC: —</Text>
              </View>
            ))
          )}
        </View>

        {/* Registered vehicles */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeadingRow}>
            <Ionicons name="car-outline" size={22} color={colors.textMuted} />
            <Text style={styles.sectionHeading}>REGISTERED VEHICLES</Text>
          </View>
          {vehicleCards.length === 0 ? (
            <Text style={styles.emptyHint}>No registered vehicles on file</Text>
          ) : (
            vehicleCards.map((v) => (
              <View key={v.key} style={styles.vehicleCard}>
                <Text style={styles.vehicleTitle}>{v.title}</Text>
                {v.subtitle ? <Text style={styles.vehicleSub}>{v.subtitle}</Text> : null}
              </View>
            ))
          )}
        </View>

        {/* Address & move-in (no utilities — those are separate cards below) */}
        {showAdditionalCard && (
          <View style={styles.cardLight}>
            <Text style={styles.sectionTitleMuted}>Additional details</Text>
            {hasAddress && (
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={18} color={colors.textMuted} />
                <Text style={styles.detailLabel}>Address</Text>
                <Text style={styles.detailValue} numberOfLines={4}>
                  {extendedData.address}
                </Text>
              </View>
            )}
            {displayData?.move_in_date ? (
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={18} color={colors.textMuted} />
                <Text style={styles.detailLabel}>Move-in date</Text>
                <Text style={styles.detailValue}>{formatDate(displayData.move_in_date)}</Text>
              </View>
            ) : null}
          </View>
        )}

        {/* Utility account numbers — one card per account */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeadingRow}>
            <Text style={styles.sectionHeadingEmoji} accessibilityLabel="Clipboard">
              📋
            </Text>
            <Text style={styles.sectionHeading}>UTILITY ACCOUNT NUMBERS</Text>
          </View>
          {utilityCards.length === 0 ? (
            <Text style={styles.emptyHint}>No utility account numbers on file</Text>
          ) : (
            utilityCards.map((u) => (
              <View key={u.key} style={styles.utilityCard}>
                <View style={styles.utilityIconWrap}>
                  <Ionicons name={u.icon} size={22} color={colors.primary} />
                </View>
                <View style={styles.utilityCardBody}>
                  <Text style={styles.utilityCardLabel}>{u.label}</Text>
                  <Text style={styles.utilityCardValue} selectable>
                    {u.value}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('Messages')}>
          <Text style={styles.linkText}>Messages</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('UnionInfo')}>
          <Text style={styles.linkText}>Union Info</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('UnionMembers')}>
          <Text style={styles.linkText}>Union Members</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Contact information — last content block before sign out */}
        <View style={styles.contactCard}>
          <View style={styles.sectionHeadingRow}>
            <Text style={styles.sectionHeadingEmoji} accessibilityLabel="Phone">
              📞
            </Text>
            <Text style={styles.sectionHeading}>CONTACT INFORMATION</Text>
          </View>
          <View style={styles.contactRow}>
            <View style={styles.contactIconWrap}>
              <Ionicons name="call-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.contactRowBody}>
              <Text style={styles.contactFieldLabel}>Phone</Text>
              <Text style={styles.contactFieldValue} selectable>
                {displayData?.contact_number || '—'}
              </Text>
            </View>
          </View>
          <View style={styles.contactRow}>
            <View style={styles.contactIconWrap}>
              <Ionicons name="mail-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.contactRowBody}>
              <Text style={styles.contactFieldLabel}>Email</Text>
              <Text style={styles.contactFieldValue} selectable>
                {displayData?.email || '—'}
              </Text>
            </View>
          </View>
          <View style={[styles.contactRow, styles.contactRowLast]}>
            <View style={styles.contactIconWrap}>
              <Ionicons name="medkit-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.contactRowBody}>
              <Text style={styles.contactFieldLabel}>Emergency contact</Text>
              <Text style={styles.contactFieldValue} selectable>
                {displayData?.emergency_contact || '—'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.button, styles.logout]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingBottom: 24 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  headerCard: {
    backgroundColor: colors.navy,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
      },
      android: { elevation: 8 },
    }),
  },
  headerEditBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 2,
    padding: 4,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 36,
  },
  headerAvatarImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#93c5fd',
  },
  headerAvatarInitials: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#93c5fd',
    backgroundColor: 'rgba(147, 197, 253, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarInitialsText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.onNavy,
  },
  headerNameBlock: { flex: 1, marginLeft: 16 },
  headerName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onNavy,
    marginBottom: 6,
  },
  headerAddress: {
    fontSize: 14,
    color: colors.onNavyMuted,
    lineHeight: 20,
  },
  headerDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(248, 250, 252, 0.35)',
    marginTop: 18,
    marginBottom: 12,
  },
  headerDividerThin: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(248, 250, 252, 0.22)',
    marginVertical: 10,
  },
  headerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerInfoLabel: {
    fontSize: 14,
    color: colors.onNavySubtle,
    flexShrink: 0,
  },
  headerInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onNavy,
    flex: 1,
    textAlign: 'right',
  },
  statusPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(248, 250, 252, 0.2)',
  },
  statusPillOwner: {
    backgroundColor: '#d1fae5',
  },
  statusPillTenant: {
    backgroundColor: '#e0e7ff',
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.onNavy,
    letterSpacing: 0.5,
  },
  statusPillTextOwner: {
    color: '#065f46',
  },
  statusPillTextTenant: {
    color: '#3730a3',
  },

  statRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.statChipBorder,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primaryDark,
  },

  sectionBlock: {
    marginBottom: 20,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    flex: 1,
  },
  sectionHeadingEmoji: {
    fontSize: 18,
    lineHeight: 22,
    marginRight: 4,
  },
  utilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.statChipBorder,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  utilityIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.statChipBg,
    borderWidth: 1,
    borderColor: colors.statChipBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  utilityCardBody: {
    flex: 1,
    minWidth: 0,
  },
  utilityCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  utilityCardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  contactCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  contactRowLast: {
    marginBottom: 0,
  },
  contactIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.statChipBg,
    borderWidth: 1,
    borderColor: colors.statChipBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contactRowBody: {
    flex: 1,
    minWidth: 0,
    paddingTop: 2,
  },
  contactFieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  contactFieldValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 22,
  },
  emptyHint: {
    fontSize: 14,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  memberCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 10,
  },
  memberTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 8,
  },
  memberMeta: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 4,
  },
  vehicleCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 10,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  vehicleSub: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },

  cardLight: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitleMuted: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
    flexWrap: 'wrap',
  },
  detailLabel: { fontSize: 14, color: colors.textMuted, flex: 1, minWidth: 100 },
  detailValue: { fontSize: 14, color: colors.text, fontWeight: '500', flex: 1.5 },

  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  linkText: { color: colors.text, fontWeight: '500' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 10,
    padding: 16,
    marginTop: 8,
  },
  logout: { backgroundColor: '#b91c1c' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
