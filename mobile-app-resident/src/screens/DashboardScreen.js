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
  Animated,
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
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CAROUSEL_ITEM_WIDTH = SCREEN_WIDTH * 0.85;

// Decorative background line colors (stylish, low opacity)
const BG_LINES = [
  { color: 'rgba(37, 99, 235, 0.2)', angle: '-22deg', topPct: 0.08, left: -80, width: 420, height: 4 },
  { color: 'rgba(22, 163, 74, 0.22)', angle: '15deg', topPct: 0.22, right: -100, width: 380, height: 3 },
  { color: 'rgba(202, 138, 4, 0.2)', angle: '-18deg', topPct: 0.38, left: -60, width: 400, height: 3 },
  { color: 'rgba(99, 102, 241, 0.18)', angle: '25deg', topPct: 0.52, right: -80, width: 360, height: 4 },
  { color: 'rgba(6, 182, 212, 0.2)', angle: '-12deg', topPct: 0.68, left: -120, width: 440, height: 3 },
  { color: 'rgba(37, 99, 235, 0.16)', angle: '20deg', topPct: 0.85, right: -60, width: 340, height: 4 },
];
const CAROUSEL_GAP = 12;
const CAROUSEL_AUTO_INTERVAL_MS = 4000;

// Open-Meteo (free, no API key). Default: Karachi, PK. Replace with user location if available.
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
const DEFAULT_LAT = 24.8607;
const DEFAULT_LON = 67.0011;

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(amount || 0);
}

function formatDate(str) {
  if (!str) return 'N/A';
  return new Date(str).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getTodayFormatted() {
  return new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [complaints, setComplaints] = useState({ data: [], total: 0 });
  const [maintenance, setMaintenance] = useState({ data: [], total: 0 });
  const [, setAnnouncements] = useState([]);
  const [defaulterVisible, setDefaulterVisible] = useState(false);
  const [defaulters, setDefaulters] = useState([]);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselIndexRef = useRef(0);
  const autoScrollTimerRef = useRef(null);
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const welcomeSlide = useRef(new Animated.Value(12)).current;
  const nameMarqueeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    carouselIndexRef.current = carouselIndex;
  }, [carouselIndex]);

  const scrollToCarouselIndex = (index) => {
    const i = Math.max(0, Math.min(index, CAROUSEL_IMAGES.length - 1));
    setCarouselIndex(i);
    const x = i * (CAROUSEL_ITEM_WIDTH + CAROUSEL_GAP);
    carouselRef.current?.scrollTo({ x, animated: true });
  };

  useEffect(() => {
    autoScrollTimerRef.current = setInterval(() => {
      const next = (carouselIndexRef.current + 1) % CAROUSEL_IMAGES.length;
      setCarouselIndex(next);
      const x = next * (CAROUSEL_ITEM_WIDTH + CAROUSEL_GAP);
      carouselRef.current?.scrollTo({ x, animated: true });
    }, CAROUSEL_AUTO_INTERVAL_MS);
    return () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    };
  }, []);

  const onCarouselScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / (CAROUSEL_ITEM_WIDTH + CAROUSEL_GAP));
    const clamped = Math.max(0, Math.min(index, CAROUSEL_IMAGES.length - 1));
    if (clamped !== carouselIndex) setCarouselIndex(clamped);
  };

  const load = async () => {
    try {
      const [complRes, maintRes, annRes, setRes, payReqRes] = await Promise.all([
        complaintsApi.getAll({ limit: 20, page: 1 }).catch(() => ({ data: {} })),
        maintenanceApi.getAll({ limit: 50, page: 1, unit_id: user?.unit_id }).catch(() => ({ data: {} })),
        announcementsApi.getAll({ limit: 5, page: 1 }).catch(() => ({ data: {} })),
        user?.society_apartment_id ? settingsApi.getSettings(user.society_apartment_id).catch(() => null) : null,
        user ? maintenanceApi.getMyPaymentRequests().then((r) => r.data).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
      ]);
      const complRaw = complRes.data?.data ?? complRes.data;
      setComplaints(Array.isArray(complRaw) ? { data: complRaw, total: complRaw.length } : { data: complRaw?.data || [], total: complRaw?.pagination?.total || 0 });
      const maintRaw = maintRes.data?.data ?? maintRes.data;
      setMaintenance(Array.isArray(maintRaw) ? { data: maintRaw, total: maintRaw.length } : { data: maintRaw?.data || [], total: maintRaw?.pagination?.total || 0 });
      const annRaw = annRes.data?.data ?? annRes.data;
      setAnnouncements(Array.isArray(annRaw) ? annRaw : (annRaw?.data || []));
      const payReqData = payReqRes?.data ?? payReqRes;
      setPaymentRequests(Array.isArray(payReqData) ? payReqData : payReqData?.data || []);
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

  const fetchWeather = async () => {
    try {
      const url = `${WEATHER_API}?latitude=${DEFAULT_LAT}&longitude=${DEFAULT_LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index`;
      const res = await fetch(url);
      const data = await res.json();
      const cur = data?.current;
      if (cur) {
        setWeather({
          temp: cur.temperature_2m,
          humidity: cur.relative_humidity_2m,
          wind: cur.wind_speed_10m,
          uv: cur.uv_index,
        });
      }
    } catch (e) {
      console.warn('Weather fetch failed', e);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000); // refresh every 10 min
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when user id changes only
  }, [user?.id]);

  // One-time welcome fade-in + slide when user is ready
  useEffect(() => {
    if (!user) return;
    Animated.parallel([
      Animated.timing(welcomeOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(welcomeSlide, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-time when user is set
  }, [user?.id]);

  // Continuous subtle marquee/glow for the welcome name
  useEffect(() => {
    if (!user) return;
    const loop = () => {
      Animated.sequence([
        Animated.timing(nameMarqueeAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(nameMarqueeAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) loop();
      });
    };
    loop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- start loop when user is set
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
    fetchWeather();
  };

  const totalPending = defaulters.reduce((sum, d) => sum + (parseFloat(d.pending_amount) || 0), 0);

  const complaintList = complaints.data || [];
  const activeComplaintsCount = complaintList.filter(
    (c) => !['resolved', 'closed'].includes((c.status || '').toLowerCase())
  ).length;
  const inProgressComplaintsCount = complaintList.filter((c) =>
    (c.status || '').toLowerCase().includes('progress')
  ).length;
  const maintenanceList = maintenance.data || [];
  const maintenanceTotalCount = maintenance.total || maintenanceList.length;
  const pendingApprovalCount = (paymentRequests || []).filter(
    (pr) => (pr.status || '').toLowerCase() === 'pending'
  ).length;
  const paidMaintenance = maintenanceList
    .filter((m) => (m.status || '').toLowerCase() === 'paid')
    .sort((a, b) => new Date(b.updated_at || b.paid_at || b.created_at || 0) - new Date(a.updated_at || a.paid_at || a.created_at || 0));
  const lastPaidMaintenance = paidMaintenance[0];

  const nameOpacity = nameMarqueeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.88, 1],
  });

  return (
    <SafeScreen style={styles.safe} edges={[]}>
      {/* Stylish colorful background lines */}
      <View style={styles.bgLinesContainer} pointerEvents="none">
        {BG_LINES.map((line, i) => (
          <View
            key={i}
            style={[
              styles.bgLine,
              {
                backgroundColor: line.color,
                width: line.width,
                height: line.height,
                top: SCREEN_HEIGHT * line.topPct,
                ...(line.left !== undefined ? { left: line.left } : { right: line.right }),
                transform: [{ rotate: line.angle }],
              },
            ]}
          />
        ))}
      </View>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Text style={styles.topBarTitle}>Dashboard</Text>
          <Animated.View style={{ opacity: welcomeOpacity, transform: [{ translateY: welcomeSlide }] }}>
            <Text style={styles.topBarWelcome}>
              Welcome,{' '}
              <Animated.Text style={[styles.topBarWelcomeName, { opacity: nameOpacity }]}>
                {user?.name || user?.email}
              </Animated.Text>
            </Text>
          </Animated.View>
          <View style={styles.topBarDetails}>
            {(user?.unit_name || user?.unit_number) && (
              <Text style={styles.topBarDetailText}>Unit: {user?.unit_name || user?.unit_number}</Text>
            )}
            {(user?.block_name || user?.block_number) && (
              <>
                {(user?.unit_name || user?.unit_number) && <Text style={styles.topBarDetailDot}> · </Text>}
                <Text style={styles.topBarDetailText}>Block: {user?.block_name || user?.block_number}</Text>
              </>
            )}
            <Text style={styles.topBarDetailText}>
              {(user?.unit_name || user?.unit_number || user?.block_name || user?.block_number) ? ' · ' : ''}
              {getTodayFormatted()}
            </Text>
          </View>
        </View>
        <View style={styles.topBarIcons}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('More', { screen: 'Messages' })}
            activeOpacity={0.7}
          >
            <Ionicons name="mail-outline" size={26} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={26} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Live weather: Temp, Hum, Wind, UV */}
        <View style={styles.weatherSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="partly-sunny-outline" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Live weather</Text>
          </View>
          <View style={styles.weatherRow}>
            <View style={styles.weatherCard}>
              <Ionicons name="thermometer-outline" size={22} color={colors.primary} />
              <Text style={styles.weatherLabel}>Temp</Text>
              <Text style={styles.weatherValue}>
                {weather ? `${Math.round(weather.temp)}°C` : '—'}
              </Text>
            </View>
            <View style={styles.weatherCard}>
              <Ionicons name="water-outline" size={22} color={colors.primary} />
              <Text style={styles.weatherLabel}>Hum</Text>
              <Text style={styles.weatherValue}>
                {weather ? `${weather.humidity}%` : '—'}
              </Text>
            </View>
            <View style={styles.weatherCard}>
              <Ionicons name="navigate-outline" size={22} color={colors.primary} />
              <Text style={styles.weatherLabel}>Wind</Text>
              <Text style={styles.weatherValue}>
                {weather ? `${weather.wind} km/h` : '—'}
              </Text>
            </View>
            <View style={styles.weatherCard}>
              <Ionicons name="sunny-outline" size={22} color={colors.primary} />
              <Text style={styles.weatherLabel}>UV</Text>
              <Text style={styles.weatherValue}>
                {weather != null && weather.uv != null ? weather.uv.toFixed(1) : '—'}
              </Text>
            </View>
          </View>
        </View>

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
            {/* Overview stat cards (6) — 2 per row */}
            <View style={styles.overviewGrid}>
              <View style={styles.overviewRow}>
                <View style={styles.overviewCard}>
                  <Ionicons name="wallet-outline" size={20} color={colors.primary} />
                  <Text style={styles.overviewLabel}>Pending Dues</Text>
                  <Text style={styles.overviewValue} numberOfLines={1}>
                    {defaulterVisible && totalPending > 0 ? formatCurrency(totalPending) : defaulterVisible ? 'No outstanding' : '—'}
                  </Text>
                </View>
                <View style={styles.overviewCard}>
                  <Ionicons name="document-text-outline" size={20} color={colors.primary} />
                  <Text style={styles.overviewLabel}>Active Complaints</Text>
                  <Text style={styles.overviewValue}>{activeComplaintsCount}</Text>
                </View>
              </View>
              <View style={styles.overviewRow}>
                <View style={styles.overviewCard}>
                  <Ionicons name="time-outline" size={20} color={colors.primary} />
                  <Text style={styles.overviewLabel}>In Progress</Text>
                  <Text style={styles.overviewValue}>{inProgressComplaintsCount}</Text>
                </View>
                <View style={styles.overviewCard}>
                  <Ionicons name="construct-outline" size={20} color={colors.primary} />
                  <Text style={styles.overviewLabel}>Maintenance</Text>
                  <Text style={styles.overviewValue}>{maintenanceTotalCount}</Text>
                </View>
              </View>
              <View style={styles.overviewRow}>
                <View style={styles.overviewCard}>
                  <Ionicons name="hourglass-outline" size={20} color={colors.primary} />
                  <Text style={styles.overviewLabel}>Pending Approval</Text>
                  <Text style={styles.overviewValue}>{pendingApprovalCount}</Text>
                </View>
                <View style={styles.overviewCard}>
                  <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
                  <Text style={styles.overviewLabel}>Last Payment</Text>
                  <Text style={styles.overviewValueSmall} numberOfLines={1}>
                    {lastPaidMaintenance
                      ? `${formatCurrency(lastPaidMaintenance.amount || lastPaidMaintenance.total)} · ${formatDate(lastPaidMaintenance.updated_at || lastPaidMaintenance.paid_at)}`
                      : '—'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Payment history card */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('Finance')}
                activeOpacity={0.9}
              >
                <View style={styles.sectionHeader}>
                  <Ionicons name="list-outline" size={20} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Payment history</Text>
                </View>
                <Text style={styles.muted}>View financial summary and payment history</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="flash-outline" size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Quick Actions</Text>
              </View>
              <View style={styles.quickActionsRow}>
                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={() => navigation.navigate('Complaints', { screen: 'NewComplaint' })}
                  activeOpacity={0.9}
                >
                  <Ionicons name="create-outline" size={24} color={colors.primary} />
                  <Text style={styles.quickActionLabel}>Submit Complaint</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={() => navigation.navigate('Notifications')}
                  activeOpacity={0.9}
                >
                  <Ionicons name="megaphone-outline" size={24} color={colors.primary} />
                  <Text style={styles.quickActionLabel}>Announcements</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.quickActionsRow}>
                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={() => navigation.navigate('Maintenance')}
                  activeOpacity={0.9}
                >
                  <Ionicons name="construct-outline" size={24} color={colors.primary} />
                  <Text style={styles.quickActionLabel}>Maintenance</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={() => navigation.navigate('More', { screen: 'UnionMembers' })}
                  activeOpacity={0.9}
                >
                  <Ionicons name="people-outline" size={24} color={colors.primary} />
                  <Text style={styles.quickActionLabel}>Union Members</Text>
                </TouchableOpacity>
              </View>
            </View>

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

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="people-outline" size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Union Members</Text>
              </View>
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('More', { screen: 'UnionMembers' })}
                activeOpacity={0.9}
              >
                <Text style={styles.cardTitle}>View union members</Text>
                <Text style={styles.muted}>Committee and contact details</Text>
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
  bgLinesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  bgLine: {
    position: 'absolute',
    borderRadius: 2,
  },
  container: { flex: 1 },
  content: { paddingBottom: 16 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topBarLeft: { flex: 1 },
  topBarTitle: { fontSize: 22, fontWeight: '700', color: colors.text },
  topBarWelcome: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  topBarWelcomeName: { fontWeight: '600', color: colors.text },
  topBarDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  topBarDetailText: { fontSize: 13, color: colors.textMuted },
  topBarDetailDot: { fontSize: 13, color: colors.textMuted },
  topBarIcons: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconBtn: { padding: 8 },
  carouselWrap: { marginBottom: 8 },
  carouselContent: {
    paddingVertical: 16,
    gap: CAROUSEL_GAP,
  },
  carouselItem: {
    width: CAROUSEL_ITEM_WIDTH,
    height: 220,
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
  overviewGrid: { marginBottom: 20 },
  overviewRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  overviewLabel: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  overviewValue: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 2 },
  overviewValueSmall: { fontSize: 12, fontWeight: '600', color: colors.text, marginTop: 2 },
  weatherSection: { marginBottom: 20 },
  weatherRow: {
    flexDirection: 'row',
    gap: 8,
  },
  weatherCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  weatherLabel: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
  weatherValue: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 2 },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionLabel: { fontSize: 12, fontWeight: '600', color: colors.text, marginTop: 6 },
  section: { marginBottom: 24 },
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
