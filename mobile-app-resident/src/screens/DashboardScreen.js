/* global require */
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import SafeScreen from '../components/SafeScreen';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { complaintsApi } from '../api/complaints';
import { maintenanceApi } from '../api/maintenance';
import { announcementsApi } from '../api/announcements';
import { settingsApi } from '../api/settings';
import { defaultersApi } from '../api/defaulters';
import { colors } from '../theme';

const RECENT_COMPLAINTS_LIMIT = 3;
// Carousel: 6 Unsplash URLs + 14 local assets (all in one place)
const CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
  require('../../assets/images/1.png'),
  require('../../assets/images/2.jpg'),
  require('../../assets/images/3.jpg'),
  require('../../assets/images/4.jpg'),
  require('../../assets/images/5.jpg'),
  require('../../assets/images/6.jpg'),
  require('../../assets/images/7.jpg'),
  require('../../assets/images/8.jpg'),
  require('../../assets/images/9.jpg'),
  require('../../assets/images/10.jpg'),
  require('../../assets/images/11.jpg'),
  require('../../assets/images/12.png'),
  require('../../assets/images/13.jpg'),
  require('../../assets/images/14.png'),
];
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_ITEM_WIDTH = SCREEN_WIDTH * 0.85;
const CAROUSEL_GAP = 12;
const CAROUSEL_AUTO_INTERVAL_MS = 4000;

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount || 0);
}

function formatDate(str) {
  if (!str) return 'N/A';
  return new Date(str).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [complaints, setComplaints] = useState({ data: [], total: 0 });
  const [, setMaintenance] = useState({ data: [], total: 0 });
  const [, setAnnouncements] = useState([]);
  const [, setDefaulterVisible] = useState(false);
  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselIndexRef = useRef(0);
  const autoScrollTimerRef = useRef(null);

  useEffect(() => {
    carouselIndexRef.current = carouselIndex;
  }, [carouselIndex]);

  const scrollToCarouselIndex = (index) => {
    const i = Math.max(0, Math.min(index, CAROUSEL_IMAGES.length - 1));
    setCarouselIndex(i);
    const x = 20 + i * (CAROUSEL_ITEM_WIDTH + CAROUSEL_GAP);
    carouselRef.current?.scrollTo({ x, animated: true });
  };

  useEffect(() => {
    autoScrollTimerRef.current = setInterval(() => {
      const next = (carouselIndexRef.current + 1) % CAROUSEL_IMAGES.length;
      setCarouselIndex(next);
      const x = 20 + next * (CAROUSEL_ITEM_WIDTH + CAROUSEL_GAP);
      carouselRef.current?.scrollTo({ x, animated: true });
    }, CAROUSEL_AUTO_INTERVAL_MS);
    return () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    };
  }, []);

  const onCarouselScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round((x - 20) / (CAROUSEL_ITEM_WIDTH + CAROUSEL_GAP));
    const clamped = Math.max(0, Math.min(index, CAROUSEL_IMAGES.length - 1));
    if (clamped !== carouselIndex) setCarouselIndex(clamped);
  };

  const load = async () => {
    try {
      const [complRes, maintRes, annRes, setRes] = await Promise.all([
        complaintsApi.getAll({ limit: 5, page: 1 }).catch(() => ({ data: {} })),
        maintenanceApi.getAll({ limit: 5, page: 1, unit_id: user?.unit_id }).catch(() => ({ data: {} })),
        announcementsApi.getAll({ limit: 5, page: 1 }).catch(() => ({ data: {} })),
        user?.society_apartment_id ? settingsApi.getSettings(user.society_apartment_id).catch(() => null) : null,
      ]);
      const complRaw = complRes.data?.data ?? complRes.data;
      setComplaints(Array.isArray(complRaw) ? { data: complRaw, total: complRaw.length } : { data: complRaw?.data || [], total: complRaw?.pagination?.total || 0 });
      const maintRaw = maintRes.data?.data ?? maintRes.data;
      setMaintenance(Array.isArray(maintRaw) ? { data: maintRaw, total: maintRaw.length } : { data: maintRaw?.data || [], total: maintRaw?.pagination?.total || 0 });
      const annRaw = annRes.data?.data ?? annRes.data;
      setAnnouncements(Array.isArray(annRaw) ? annRaw : (annRaw?.data || []));
      const defaulterListVisible = setRes?.data?.defaulter_list_visible !== false;
      setDefaulterVisible(!!(user && defaulterListVisible));
      if (user && defaulterListVisible) {
        const defRes = await defaultersApi.getAll({ unit_id: user.unit_id }).catch(() => ({ data: {} }));
        const d = defRes.data?.data || defRes.data;
        setDefaulters(Array.isArray(d) ? d : d?.data || []);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) load();
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const totalPending = defaulters.reduce((sum, d) => sum + (parseFloat(d.pending_amount) || 0), 0);

  return (
    <SafeScreen style={styles.safe} edges={['top']}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Text style={styles.topBarTitle}>Dashboard</Text>
          <Text style={styles.topBarWelcome}>Welcome, {user?.name || user?.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.bellBtn}
          onPress={() => navigation.navigate('Notifications')}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Carousel */}
        <View style={styles.carouselWrap}>
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled={false}
            snapToInterval={CAROUSEL_ITEM_WIDTH + CAROUSEL_GAP}
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
            showsHorizontalScrollIndicator={false}
            onScroll={onCarouselScroll}
            scrollEventThrottle={32}
          >
            {CAROUSEL_IMAGES.map((uri, i) => (
              <TouchableOpacity
                key={i}
                style={styles.carouselItem}
                activeOpacity={1}
                onPress={() => scrollToCarouselIndex(i)}
              >
                <Image source={typeof uri === 'string' ? { uri } : uri} style={styles.carouselImage} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.carouselDots}>
            {CAROUSEL_IMAGES.map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.dot, i === carouselIndex && styles.dotActive]}
                onPress={() => scrollToCarouselIndex(i)}
                activeOpacity={0.8}
              />
            ))}
          </View>
        </View>

        {loading ? (
          <Text style={styles.muted}>Loading...</Text>
        ) : (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="document-text-outline" size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Recent Complaints</Text>
              </View>
              {(complaints.data || []).length === 0 ? (
                <Text style={styles.muted}>No complaints</Text>
              ) : (
                <>
                  {(complaints.data || []).slice(0, RECENT_COMPLAINTS_LIMIT).map((c) => (
                    <View key={c.id} style={styles.card}>
                      <Text style={styles.cardTitle}>{c.subject || c.title || 'Complaint'}</Text>
                      <Text style={styles.muted}>{c.status} · {formatDate(c.created_at)}</Text>
                    </View>
                  ))}
                  {(complaints.data || []).length > RECENT_COMPLAINTS_LIMIT && (
                    <TouchableOpacity
                      style={styles.showMore}
                      onPress={() => navigation.navigate('Complaints')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.showMoreText}>Show more ({(complaints.total || complaints.data.length)} total)</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="wallet-outline" size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Dues</Text>
              </View>
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('Finance')}
                activeOpacity={0.9}
              >
                <Text style={styles.duesLabel}>{totalPending > 0 ? 'Total pending' : 'Status'}</Text>
                <Text style={[styles.duesAmount, totalPending <= 0 && styles.duesAllClear]}>
                  {totalPending > 0 ? formatCurrency(totalPending) : 'No pending dues'}
                </Text>
              </TouchableOpacity>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topBarLeft: { flex: 1 },
  topBarTitle: { fontSize: 22, fontWeight: '700', color: colors.text },
  topBarWelcome: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  bellBtn: { padding: 8 },
  carouselWrap: { marginBottom: 8 },
  carouselContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: CAROUSEL_GAP,
  },
  carouselItem: {
    width: CAROUSEL_ITEM_WIDTH,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  carouselImage: { width: '100%', height: '100%' },
  carouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { color: colors.text, fontWeight: '600', marginBottom: 4 },
  muted: { color: colors.textMuted, fontSize: 14 },
  showMore: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  showMoreText: { color: colors.primary, fontSize: 15, fontWeight: '600' },
  duesLabel: { color: colors.textMuted, fontSize: 14, marginBottom: 4 },
  duesAmount: { color: colors.text, fontWeight: '700', fontSize: 18 },
  duesAllClear: { color: colors.success },
});
