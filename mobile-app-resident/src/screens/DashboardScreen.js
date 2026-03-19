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
import { residentsApi } from '../api/residents';
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
  const [announcements, setAnnouncements] = useState([]);
  const [residentExtended, setResidentExtended] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [defaulterVisible, setDefaulterVisible] = useState(false);
  const [defaulters, setDefaulters] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselIndexRef = useRef(0);
  const autoScrollTimerRef = useRef(null);
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const welcomeSlide = useRef(new Animated.Value(12)).current;
  const nameMarqueeAnim = useRef(new Animated.Value(0)).current;
  /** Measured fixed top bar only (welcome card scrolls with content) */
  const [dashboardHeaderHeight, setDashboardHeaderHeight] = useState(52);

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
      const [complRes, maintRes, annRes, setRes, extRes, famRes] = await Promise.all([
        complaintsApi.getAll({ limit: 20, page: 1 }).catch(() => ({ data: {} })),
        maintenanceApi.getAll({ limit: 50, page: 1, unit_id: user?.unit_id }).catch(() => ({ data: {} })),
        announcementsApi.getAll({ limit: 8, page: 1 }).catch(() => ({ data: {} })),
        user?.society_apartment_id ? settingsApi.getSettings(user.society_apartment_id).catch(() => null) : null,
        user?.id ? residentsApi.getById(user.id).catch(() => ({ data: {} })) : Promise.resolve({ data: {} }),
        user?.id ? residentsApi.getFamilyMembers(user.id).catch(() => ({ data: {} })) : Promise.resolve({ data: {} }),
      ]);
      const complRaw = complRes.data?.data ?? complRes.data;
      setComplaints(Array.isArray(complRaw) ? { data: complRaw, total: complRaw.length } : { data: complRaw?.data || [], total: complRaw?.pagination?.total || 0 });
      const maintRaw = maintRes.data?.data ?? maintRes.data;
      setMaintenance(Array.isArray(maintRaw) ? { data: maintRaw, total: maintRaw.length } : { data: maintRaw?.data || [], total: maintRaw?.pagination?.total || 0 });
      const annRaw = annRes.data?.data ?? annRes.data;
      const annList = Array.isArray(annRaw) ? annRaw : (annRaw?.data || []);
      setAnnouncements(annList.slice(0, 6));
      const ext = extRes.data?.data ?? extRes.data;
      setResidentExtended(ext && typeof ext === 'object' ? ext : null);
      const famRaw = famRes.data?.data ?? famRes.data;
      setFamilyMembers(Array.isArray(famRaw) ? famRaw : []);
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

  const maintenanceList = maintenance.data || [];
  const paidMaintenance = maintenanceList
    .filter((m) => (m.status || '').toLowerCase() === 'paid')
    .sort((a, b) => new Date(b.updated_at || b.paid_at || b.created_at || 0) - new Date(a.updated_at || a.paid_at || a.created_at || 0));
  const lastPaidMaintenance = paidMaintenance[0];

  const ext = residentExtended;
  const vehicleCount =
    (parseInt(String(ext?.number_of_cars ?? 0), 10) || 0) +
    (parseInt(String(ext?.number_of_bikes ?? 0), 10) || 0);
  const familyCount = familyMembers.length;

  const unpaidMaintenance = maintenanceList.filter(
    (m) => !['paid', 'closed', 'cancelled'].includes((m.status || '').toLowerCase())
  );
  const sortedUnpaidByDue = [...unpaidMaintenance].sort(
    (a, b) =>
      new Date(a.due_date || a.created_at || 0) - new Date(b.due_date || b.created_at || 0)
  );
  const nextDueMaintenance = sortedUnpaidByDue[0];

  const vehicleDetailLines = [];
  if (ext?.car_make_model || ext?.license_plate) {
    vehicleDetailLines.push(
      [ext.car_make_model, ext.license_plate].filter(Boolean).join(' · ') || '—'
    );
  }
  if (ext?.bike_make_model || ext?.bike_license_plate) {
    vehicleDetailLines.push(
      [ext.bike_make_model, ext.bike_license_plate].filter(Boolean).join(' · ') || '—'
    );
  }

  const utilityTiles = [];
  if (ext?.k_electric_account) {
    utilityTiles.push({ key: 'ke', icon: 'flash-outline', label: 'Electric', value: String(ext.k_electric_account) });
  }
  if (ext?.gas_account) {
    utilityTiles.push({ key: 'gas', icon: 'flame-outline', label: 'Gas', value: String(ext.gas_account) });
  }
  if (ext?.water_account) {
    utilityTiles.push({ key: 'wtr', icon: 'water-outline', label: 'Water', value: String(ext.water_account) });
  }
  const phoneTv = ext?.phone_tv_account || ext?.telephone_bills;
  if (phoneTv) {
    utilityTiles.push({ key: 'tel', icon: 'call-outline', label: 'Phone / TV', value: String(phoneTv) });
  }

  const nameOpacity = nameMarqueeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.88, 1],
  });

  return (
    <SafeScreen style={styles.safe} edges={[]}>
      <View style={styles.screenInner}>
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

        {/* Fixed top bar: title + actions (does not scroll) */}
        <View
          style={styles.dashboardHeaderFixed}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h > 0) setDashboardHeaderHeight(Math.ceil(h));
          }}
        >
          <Text style={styles.dashboardHeaderTitle}>Dashboard</Text>
          <View style={styles.dashboardHeaderIcons}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={26} color={colors.navyHeaderIconBell} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('More', { screen: 'Messages' })}
              activeOpacity={0.7}
            >
              <Ionicons name="mail-outline" size={26} color={colors.navyHeaderIconMail} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={[
            styles.content,
            { paddingTop: dashboardHeaderHeight + 6 },
          ]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
        {/* Welcome card — same navy as header, scrolls away (not sticky) */}
        <View style={styles.welcomeCardScroll}>
          <Animated.View style={{ opacity: welcomeOpacity, transform: [{ translateY: welcomeSlide }] }}>
            <Text style={styles.welcomeCardGreeting}>
              Welcome,{' '}
              <Animated.Text style={[styles.welcomeCardName, { opacity: nameOpacity }]}>
                {user?.name || user?.email}
              </Animated.Text>
            </Text>
          </Animated.View>
          <View style={styles.welcomeCardLocationRows}>
            <View style={styles.welcomeCardDetailColumn}>
              {(user?.unit_number || user?.unit_name) ? (
                <Text style={styles.welcomeCardDetailText}>
                  Flat: {user?.unit_number || user?.unit_name}
                </Text>
              ) : null}
              {user?.apartment_name ? (
                <Text style={styles.welcomeCardDetailText} numberOfLines={2}>
                  Apartment: {user.apartment_name}
                </Text>
              ) : null}
            </View>
            <View style={styles.welcomeCardMetaRow}>
              {(user?.block_name || user?.block_number) && (
                <Text style={styles.welcomeCardDetailMuted}>
                  Block: {user?.block_name || user?.block_number}
                </Text>
              )}
              <Text style={styles.welcomeCardDetailMuted}>
                {(user?.block_name || user?.block_number) ? ' · ' : ''}
                {getTodayFormatted()}
              </Text>
            </View>
          </View>
        </View>

        {/* Top summary + payment (above weather) */}
        <View style={styles.summaryRow}>
          <TouchableOpacity
            style={styles.summaryChip}
            onPress={() => navigation.navigate('Finance')}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={styles.summaryChipLabel}>Due amount</Text>
            <Text style={styles.summaryChipValue} numberOfLines={1}>
              {loading
                ? '…'
                : !defaulterVisible
                  ? '—'
                  : totalPending > 0
                    ? formatCurrency(totalPending)
                    : formatCurrency(0)}
            </Text>
          </TouchableOpacity>
          <View style={styles.summaryChip}>
            <Text style={styles.summaryChipLabel}>Family</Text>
            <Text style={styles.summaryChipValue}>{loading ? '…' : familyCount}</Text>
          </View>
          <View style={styles.summaryChip}>
            <Text style={styles.summaryChipLabel}>Vehicles</Text>
            <Text style={styles.summaryChipValue}>{loading ? '…' : vehicleCount}</Text>
          </View>
        </View>
        {loading ? (
          <View style={[styles.paymentStatusCard, styles.paymentStatusLoading]}>
            <Text style={styles.muted}>Loading payment summary…</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.paymentStatusCard}
            onPress={() => navigation.navigate('Finance')}
            activeOpacity={0.9}
          >
            <View style={styles.paymentStatusRow}>
              <Ionicons
                name={totalPending > 0 ? 'alert-circle-outline' : 'checkmark-circle'}
                size={26}
                color={totalPending > 0 ? colors.warning : colors.success}
              />
              <Text
                style={[
                  styles.paymentStatusTitle,
                  totalPending > 0 ? styles.paymentStatusTitleWarn : styles.paymentStatusTitleOk,
                ]}
              >
                {totalPending > 0 ? 'Outstanding balance' : 'All payments up to date'}
              </Text>
            </View>
            <Text style={styles.paymentStatusSub}>
              {lastPaidMaintenance
                ? `Last payment: ${formatDate(lastPaidMaintenance.updated_at || lastPaidMaintenance.paid_at)}`
                : 'Last payment: —'}
              {nextDueMaintenance?.due_date
                ? ` · Next due: ${formatDate(nextDueMaintenance.due_date)}`
                : nextDueMaintenance
                  ? ' · Next due: see Maintenance'
                  : ''}
            </Text>
          </TouchableOpacity>
        )}

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
            {/* Important alerts */}
            <Text style={styles.sectionHeadingCaps}>Important alerts</Text>
            {nextDueMaintenance && (nextDueMaintenance.due_date || nextDueMaintenance.total_amount) ? (
              <View style={styles.alertBanner}>
                <Ionicons name="flash-outline" size={22} color={colors.alertTitle} style={styles.alertIcon} />
                <View style={styles.alertBannerBody}>
                  <Text style={styles.alertBannerTitle}>Maintenance reminder</Text>
                  <Text style={styles.alertBannerText}>
                    {nextDueMaintenance.due_date
                      ? `Maintenance due on ${formatDate(nextDueMaintenance.due_date)}`
                      : `Pending maintenance · ${formatCurrency(nextDueMaintenance.total_amount || nextDueMaintenance.amount)}`}
                  </Text>
                </View>
              </View>
            ) : null}
            {announcements.length === 0 &&
            !(nextDueMaintenance && (nextDueMaintenance.due_date || nextDueMaintenance.total_amount)) ? (
              <Text style={styles.muted}>No alerts right now</Text>
            ) : null}
            {announcements.map((a) => (
              <View key={a.id} style={styles.alertBanner}>
                <Ionicons name="notifications-outline" size={22} color={colors.alertTitle} style={styles.alertIcon} />
                <View style={styles.alertBannerBody}>
                  <Text style={styles.alertBannerTitle}>{a.title || 'Announcement'}</Text>
                  <Text style={styles.alertBannerText} numberOfLines={3}>
                    {a.description || '—'}
                  </Text>
                </View>
              </View>
            ))}

            {/* Quick actions */}
            <Text style={styles.sectionHeadingCaps}>Quick actions</Text>
            <View style={styles.quickActionsRow}>
              <TouchableOpacity
                style={styles.quickActionCardMock}
                onPress={() => navigation.navigate('Maintenance')}
                activeOpacity={0.9}
              >
                <Ionicons name="card-outline" size={28} color={colors.primary} />
                <Text style={styles.quickActionLabelMock}>Maintenance</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionCardMock}
                onPress={() => navigation.navigate('Complaints', { screen: 'NewComplaint' })}
                activeOpacity={0.9}
              >
                <Ionicons name="warning-outline" size={28} color={colors.error} />
                <Text style={styles.quickActionLabelMock}>Complaints</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.quickActionsRow}>
              {defaulterVisible ? (
                <TouchableOpacity
                  style={styles.quickActionCardMock}
                  onPress={() => navigation.navigate('Finance')}
                  activeOpacity={0.9}
                >
                  <Ionicons name="bar-chart-outline" size={28} color={colors.primary} />
                  <Text style={styles.quickActionLabelMock}>Defaulters</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.quickActionCardMock}
                  onPress={() => navigation.navigate('Notifications')}
                  activeOpacity={0.9}
                >
                  <Ionicons name="megaphone-outline" size={28} color={colors.primary} />
                  <Text style={styles.quickActionLabelMock}>Announcements</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.quickActionCardMock}
                onPress={() => navigation.navigate('More', { screen: 'Profile' })}
                activeOpacity={0.9}
              >
                <Ionicons name="person-outline" size={28} color={colors.textMuted} />
                <Text style={styles.quickActionLabelMock}>Profile</Text>
              </TouchableOpacity>
            </View>

            {/* Your details at a glance */}
            <Text style={styles.sectionHeadingCaps}>Your details at a glance</Text>
            <View style={styles.detailGlanceCard}>
              <View style={styles.detailGlanceHeader}>
                <Ionicons name="phone-portrait-outline" size={20} color={colors.primary} />
                <Text style={styles.detailGlanceTitle}>Contact information</Text>
              </View>
              <Text style={styles.detailGlanceLine}>Phone: {user?.contact_number || '—'}</Text>
              <Text style={styles.detailGlanceLine}>Email: {user?.email || '—'}</Text>
              <Text style={styles.detailGlanceLine}>CNIC: {user?.cnic || '—'}</Text>
            </View>
            <View style={styles.detailGlanceCard}>
              <View style={styles.detailGlanceHeader}>
                <Ionicons name="people-outline" size={20} color={colors.primary} />
                <Text style={styles.detailGlanceTitle}>Family members ({familyCount})</Text>
              </View>
              {familyMembers.length === 0 ? (
                <Text style={styles.detailGlanceMuted}>No family members on file</Text>
              ) : (
                familyMembers.map((fm) => (
                  <Text key={fm.id} style={styles.detailGlanceBullet}>
                    • {fm.name}{fm.relation ? ` (${fm.relation})` : ''}
                  </Text>
                ))
              )}
            </View>
            <View style={styles.detailGlanceCard}>
              <View style={styles.detailGlanceHeader}>
                <Ionicons name="car-outline" size={20} color={colors.primary} />
                <Text style={styles.detailGlanceTitle}>Vehicles ({vehicleCount})</Text>
              </View>
              {vehicleDetailLines.length === 0 ? (
                <Text style={styles.detailGlanceMuted}>No vehicle details on file</Text>
              ) : (
                vehicleDetailLines.map((line, idx) => (
                  <Text key={idx} style={styles.detailGlanceBullet}>• {line}</Text>
                ))
              )}
            </View>
            <View style={styles.detailGlanceCard}>
              <View style={styles.detailGlanceHeader}>
                <Ionicons name="clipboard-outline" size={20} color={colors.primary} />
                <Text style={styles.detailGlanceTitle}>Utility accounts</Text>
              </View>
              {utilityTiles.length === 0 ? (
                <Text style={styles.detailGlanceMuted}>No utility references on file</Text>
              ) : (
                <View style={styles.utilityGrid}>
                  {utilityTiles.map((u) => (
                    <View key={u.key} style={styles.utilityTile}>
                      <Ionicons name={u.icon} size={18} color={colors.primary} />
                      <Text style={styles.utilityTileLabel}>{u.label}</Text>
                      <Text style={styles.utilityTileValue} numberOfLines={2}>{u.value}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.unionLinkCard}
              onPress={() => navigation.navigate('More', { screen: 'UnionMembers' })}
              activeOpacity={0.9}
            >
              <Ionicons name="people-outline" size={22} color={colors.primary} />
              <View style={styles.unionLinkBody}>
                <Text style={styles.unionLinkTitle}>Union members</Text>
                <Text style={styles.unionLinkSub}>Committee and contact details</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="document-text-outline" size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Recent complaints</Text>
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
          </>
        )}
        </ScrollView>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  screenInner: { flex: 1 },
  bgLinesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0,
  },
  bgLine: {
    position: 'absolute',
    borderRadius: 2,
  },
  dashboardHeaderFixed: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 4,
    backgroundColor: colors.navy,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.14)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  },
  dashboardHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.onNavy,
  },
  dashboardHeaderIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  welcomeCardScroll: {
    backgroundColor: colors.navy,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  welcomeCardGreeting: { fontSize: 15, color: colors.onNavyMuted },
  welcomeCardName: { fontWeight: '600', color: colors.onNavy },
  welcomeCardLocationRows: {
    marginTop: 10,
    gap: 6,
  },
  welcomeCardDetailColumn: { gap: 2 },
  welcomeCardMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },
  welcomeCardDetailText: { fontSize: 13, color: colors.onNavy },
  welcomeCardDetailMuted: { fontSize: 13, color: colors.onNavySubtle },
  container: { flex: 1, zIndex: 1 },
  content: { paddingBottom: 16 },
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
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  summaryChip: {
    flex: 1,
    backgroundColor: colors.statChipBg,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: colors.statChipBorder,
    alignItems: 'center',
  },
  summaryChipLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  summaryChipValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 4,
    textAlign: 'center',
  },
  paymentStatusCard: {
    backgroundColor: colors.paymentCardBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.paymentCardBorder,
  },
  paymentStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  paymentStatusTitle: { fontSize: 16, fontWeight: '700', flex: 1 },
  paymentStatusTitleOk: { color: colors.success },
  paymentStatusTitleWarn: { color: colors.warning },
  paymentStatusSub: {
    fontSize: 12,
    color: colors.primaryDark,
    marginTop: 8,
    lineHeight: 18,
  },
  paymentStatusLoading: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  sectionHeadingCaps: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 4,
    textTransform: 'uppercase',
  },
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
  quickActionCardMock: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.statChipBorder,
  },
  quickActionLabelMock: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  alertBanner: {
    flexDirection: 'row',
    backgroundColor: colors.alertCardBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.alertCardBorder,
    alignItems: 'flex-start',
  },
  alertIcon: { marginRight: 10, marginTop: 2 },
  alertBannerBody: { flex: 1 },
  alertBannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.alertTitle,
    marginBottom: 4,
  },
  alertBannerText: { fontSize: 13, color: colors.text, lineHeight: 18 },
  detailGlanceCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailGlanceHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  detailGlanceTitle: { fontSize: 15, fontWeight: '600', color: colors.primaryDark },
  detailGlanceLine: { fontSize: 13, color: colors.text, marginBottom: 4 },
  detailGlanceBullet: { fontSize: 13, color: colors.text, marginBottom: 4 },
  detailGlanceMuted: { fontSize: 13, color: colors.textMuted },
  utilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  utilityTile: {
    width: (SCREEN_WIDTH - 40 - 28 - 8) / 2,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  utilityTileLabel: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
  utilityTileValue: { fontSize: 12, fontWeight: '600', color: colors.text, marginTop: 2 },
  unionLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  unionLinkBody: { flex: 1 },
  unionLinkTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  unionLinkSub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
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
