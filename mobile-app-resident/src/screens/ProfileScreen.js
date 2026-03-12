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

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState(null);
  const [extendedData, setExtendedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      const [meRes, residentRes] = await Promise.all([
        authApi.getMe(),
        residentsApi.getById(user.id).catch(() => ({ data: null })),
      ]);
      const me = meRes.data?.data || meRes.data;
      setProfileData(me || user);
      const resData = residentRes?.data?.data ?? residentRes?.data;
      setExtendedData(resData || null);
    } catch (e) {
      setProfileData(user);
      setExtendedData(null);
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
      >
        {/* Profile card with avatar and main info */}
        <View style={styles.card}>
          <View style={styles.avatarRow}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color={colors.primary} />
              </View>
            )}
            <View style={styles.cardMain}>
              <Text style={styles.name}>{displayData?.name || 'Resident'}</Text>
              <Text style={styles.email}>{displayData?.email}</Text>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => navigation.navigate('EditProfile', { profileData: displayData, extendedData })}
                activeOpacity={0.7}
              >
                <Ionicons name="pencil" size={18} color={colors.primary} />
                <Text style={styles.editBtnText}>Edit profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Ionicons name="call-outline" size={18} color={colors.textMuted} />
            <Text style={styles.detailLabel}>Contact number</Text>
            <Text style={styles.detailValue}>{displayData?.contact_number || '—'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="medkit-outline" size={18} color={colors.textMuted} />
            <Text style={styles.detailLabel}>Emergency contact</Text>
            <Text style={styles.detailValue}>{displayData?.emergency_contact || '—'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="card-outline" size={18} color={colors.textMuted} />
            <Text style={styles.detailLabel}>CNIC</Text>
            <Text style={styles.detailValue}>{displayData?.cnic || '—'}</Text>
          </View>
          {displayData?.unit_id != null && (
            <View style={styles.detailRow}>
              <Ionicons name="business-outline" size={18} color={colors.textMuted} />
              <Text style={styles.detailLabel}>Unit ID</Text>
              <Text style={styles.detailValue}>{String(displayData.unit_id)}</Text>
            </View>
          )}
          {displayData?.move_in_date && (
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={18} color={colors.textMuted} />
              <Text style={styles.detailLabel}>Move-in date</Text>
              <Text style={styles.detailValue}>{formatDate(displayData.move_in_date)}</Text>
            </View>
          )}
        </View>

        {/* Extended resident details (read-only, from residents API) */}
        {extendedData && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Additional details</Text>
            {(extendedData.address != null && extendedData.address !== '') && (
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={18} color={colors.textMuted} />
                <Text style={styles.detailLabel}>Address</Text>
                <Text style={styles.detailValue} numberOfLines={2}>{extendedData.address}</Text>
              </View>
            )}
            {(extendedData.k_electric_account != null && extendedData.k_electric_account !== '') && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>K-Electric account</Text>
                <Text style={styles.detailValue}>{extendedData.k_electric_account}</Text>
              </View>
            )}
            {(extendedData.gas_account != null && extendedData.gas_account !== '') && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Gas account</Text>
                <Text style={styles.detailValue}>{extendedData.gas_account}</Text>
              </View>
            )}
            {(extendedData.water_account != null && extendedData.water_account !== '') && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Water account</Text>
                <Text style={styles.detailValue}>{extendedData.water_account}</Text>
              </View>
            )}
            {(extendedData.number_of_cars != null && extendedData.number_of_cars !== '' && Number(extendedData.number_of_cars) > 0) && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Cars</Text>
                <Text style={styles.detailValue}>
                  {extendedData.number_of_cars}
                  {extendedData.car_make_model ? ` · ${extendedData.car_make_model}` : ''}
                  {extendedData.license_plate ? ` (${extendedData.license_plate})` : ''}
                </Text>
              </View>
            )}
            {(extendedData.number_of_bikes != null && extendedData.number_of_bikes !== '' && Number(extendedData.number_of_bikes) > 0) && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bikes</Text>
                <Text style={styles.detailValue}>
                  {extendedData.number_of_bikes}
                  {extendedData.bike_make_model ? ` · ${extendedData.bike_make_model}` : ''}
                  {extendedData.bike_license_plate ? ` (${extendedData.bike_license_plate})` : ''}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Quick links */}
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => navigation.navigate('Messages')}
        >
          <Text style={styles.linkText}>Messages</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => navigation.navigate('UnionInfo')}
        >
          <Text style={styles.linkText}>Union Info</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => navigation.navigate('UnionMembers')}
        >
          <Text style={styles.linkText}>Union Members</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

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
  content: { paddingBottom: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardMain: { flex: 1, marginLeft: 16 },
  name: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 4 },
  email: { fontSize: 14, color: colors.textSecondary, marginBottom: 10 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: `${colors.primary}18`,
  },
  editBtnText: { fontSize: 15, fontWeight: '600', color: colors.primary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  detailLabel: { fontSize: 14, color: colors.textMuted, flex: 1 },
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
    marginTop: 24,
  },
  logout: { backgroundColor: '#b91c1c' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
