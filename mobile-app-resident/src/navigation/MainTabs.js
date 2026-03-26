import React from 'react';
import PropTypes from 'prop-types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, StatusBar, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0;

const headerStyles = StyleSheet.create({
  /** Match DashboardScreen `dashboardHeaderFixed` (title + right icons only) */
  appHeader: {
    backgroundColor: colors.navy,
    paddingVertical: 10,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.14)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
  },
  headerBack: { padding: 8, marginRight: 2 },
  /** Keep back control from collapsing when title + right icons compete for width */
  headerBackWrap: { flexShrink: 0, justifyContent: 'center' },
  headerLeftRow: { flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 0 },
  appHeaderTitle: { fontSize: 20, fontWeight: '700', color: colors.onNavy, flex: 1, minWidth: 0 },
  headerRightIcons: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  headerIconBtn: { padding: 8 },
});

function HeaderRightActions({ navigation }) {
  const tabNav = navigation?.getParent?.();
  return (
    <View style={headerStyles.headerRightIcons}>
      <TouchableOpacity
        style={headerStyles.headerIconBtn}
        onPress={() => tabNav?.navigate?.('Home', { screen: 'Notifications' })}
        activeOpacity={0.7}
      >
        <Ionicons name="notifications-outline" size={26} color={colors.navyHeaderIconBell} />
      </TouchableOpacity>
      <TouchableOpacity
        style={headerStyles.headerIconBtn}
        onPress={() => tabNav?.navigate?.('More', { screen: 'Messages' })}
        activeOpacity={0.7}
      >
        <Ionicons name="mail-outline" size={26} color={colors.navyHeaderIconMail} />
      </TouchableOpacity>
    </View>
  );
}
HeaderRightActions.propTypes = {
  navigation: PropTypes.object,
};

function ComplaintsStackHeader({ navigation, options, back }) {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, STATUS_BAR_HEIGHT, 28);
  /** Native stack sets `back` when a previous route exists; `canGoBack()` alone can be wrong in nested setups */
  const hasCustomLeft = typeof options?.headerLeft === 'function';
  const showDefaultBack = !hasCustomLeft && (back != null || navigation.canGoBack?.() === true);

  const leftEl = (() => {
    if (hasCustomLeft) {
      return options.headerLeft({
        navigation,
        canGoBack: back != null || navigation.canGoBack?.() === true,
        tintColor: colors.onNavy,
      });
    }
    if (showDefaultBack) {
      return (
        <View style={headerStyles.headerBackWrap} collapsable={false}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={headerStyles.headerBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={colors.navyHeaderIconMail} />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  })();

  return (
    <View style={[headerStyles.appHeader, { paddingTop: topInset }]}>
      <View style={headerStyles.headerLeftRow}>
        {leftEl}
        <Text style={headerStyles.appHeaderTitle} numberOfLines={1}>{options.title}</Text>
      </View>
      <HeaderRightActions navigation={navigation} />
    </View>
  );
}
ComplaintsStackHeader.propTypes = {
  navigation: PropTypes.object,
  options: PropTypes.object,
  back: PropTypes.shape({ title: PropTypes.string }),
};

// Single header for all tab screens so BottomTabView always uses the same component (avoids hook-order issues).
// We always "show" header (headerShown: true) and use hideHeader to hide it, so the navigator never changes hook order.
function TabHeader({ navigation, options, back }) {
  if (options?.headerShown === false || options?.hideHeader === true) return null;
  return <ComplaintsStackHeader navigation={navigation} options={options} back={back} />;
}
TabHeader.propTypes = {
  navigation: PropTypes.object,
  options: PropTypes.object,
  back: PropTypes.shape({ title: PropTypes.string }),
};

function RecentAnnouncementsHeader({ navigation, options, back }) {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, STATUS_BAR_HEIGHT, 28);
  const showBack = back != null || navigation.canGoBack?.() === true;
  return (
    <View style={[headerStyles.appHeader, { paddingTop: topInset }]}>
      <View style={headerStyles.headerLeftRow}>
        {showBack ? (
          <View style={headerStyles.headerBackWrap} collapsable={false}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={headerStyles.headerBack}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={24} color={colors.navyHeaderIconMail} />
            </TouchableOpacity>
          </View>
        ) : null}
        <Text style={headerStyles.appHeaderTitle} numberOfLines={1}>{options?.title ?? 'Recent Announcements'}</Text>
      </View>
      <HeaderRightActions navigation={navigation} />
    </View>
  );
}
RecentAnnouncementsHeader.propTypes = {
  navigation: PropTypes.object,
  options: PropTypes.object,
  back: PropTypes.shape({ title: PropTypes.string }),
};

import DashboardScreen from '../screens/DashboardScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ComplaintsScreen from '../screens/ComplaintsScreen';
import ComplaintDetailScreen from '../screens/ComplaintDetailScreen';
import NewComplaintScreen from '../screens/NewComplaintScreen';
import MaintenanceScreen from '../screens/MaintenanceScreen';
import DefaulterScreen from '../screens/DefaulterScreen';
import FinancialSummaryScreen from '../screens/FinancialSummaryScreen';
import UnionInfoScreen from '../screens/UnionInfoScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MessagesScreen from '../screens/MessagesScreen';
import UnionMembersScreen from '../screens/UnionMembersScreen';
import UnionMemberDetailScreen from '../screens/UnionMemberDetailScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Tab = createBottomTabNavigator();
const ComplaintsStack = createNativeStackNavigator();
const MoreStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const TAB_ICON_ANIMATION_PRESET = 'subtle'; // use lighter animation to reduce tab-bar jank

const TAB_ICON_ANIMATION = {
  bouncy: {
    restScale: 0.92,
    springFriction: 5.2,
    springTension: 150,
    pulseDuration: 220,
    pulseFrom: 0.84,
  },
  subtle: {
    restScale: 0.96,
    springFriction: 8,
    springTension: 95,
    pulseDuration: 260,
    pulseFrom: 0.95,
  },
};
const TAB_ICONS = {
  Home: 'home-outline',
  Complaints: 'document-text-outline',
  Maintenance: 'card-outline',
  Defaulter: 'warning-outline',
  Finance: 'bar-chart-outline',
  More: 'person-outline',
};

const TAB_ICON_COLORS = {
  Home: { active: '#2563EB', inactive: '#93C5FD' },
  Complaints: { active: '#0EA5E9', inactive: '#7DD3FC' },
  Maintenance: { active: '#14B8A6', inactive: '#99F6E4' },
  Defaulter: { active: '#F97316', inactive: '#FDBA74' },
  Finance: { active: '#10B981', inactive: '#86EFAC' },
  More: { active: '#8B5CF6', inactive: '#C4B5FD' },
};

const TabIcon = React.memo(function TabIcon({ routeName, focused }) {

  const animation = TAB_ICON_ANIMATION[TAB_ICON_ANIMATION_PRESET] ?? TAB_ICON_ANIMATION.subtle;
  const iconColor = (focused ? TAB_ICON_COLORS[routeName]?.active : TAB_ICON_COLORS[routeName]?.inactive)
    ?? (focused ? colors.primary : colors.textMuted);
  const scale = React.useRef(new Animated.Value(focused ? 1 : animation.restScale)).current;

  React.useEffect(() => {
    if (focused && TAB_ICON_ANIMATION_PRESET === 'bouncy') {
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.2,
          friction: 4,
          tension: 220,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 0.96,
          friction: 5,
          tension: 180,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          tension: 160,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }
    Animated.spring(scale, {
      toValue: focused ? 1 : animation.restScale,
      friction: animation.springFriction,
      tension: animation.springTension,
      useNativeDriver: true,
    }).start();
  }, [animation.restScale, animation.springFriction, animation.springTension, focused, scale]);

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
      }}
    >
      <Animated.View
        style={{
          width: focused ? 44 : 36,
          height: focused ? 44 : 36,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={TAB_ICONS[routeName] || 'ellipse'} size={focused ? 26 : 24} color={iconColor} />
      </Animated.View>
    </Animated.View>
  );
});
TabIcon.propTypes = {
  routeName: PropTypes.string.isRequired,
  focused: PropTypes.bool.isRequired,
};

function HomeStackScreen() {
  const headerStyle = { backgroundColor: colors.surface };
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false, headerStatusBarHeight: 0 }}>
      <HomeStack.Screen name="Dashboard" component={DashboardScreen} />
      <HomeStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Recent Announcements',
          headerShown: true,
          header: RecentAnnouncementsHeader,
          headerStyle,
          headerShadowVisible: false,
          headerTintColor: colors.text,
          headerStatusBarHeight: 0,
        }}
      />
    </HomeStack.Navigator>
  );
}

function ComplaintsStackScreen() {
  const screenOpts = {
    header: ComplaintsStackHeader,
    headerShadowVisible: false,
    headerStatusBarHeight: 0,
  };
  return (
    <ComplaintsStack.Navigator screenOptions={screenOpts}>
      <ComplaintsStack.Screen name="ComplaintsList" component={ComplaintsScreen} options={{ title: 'Complaints' }} />
      <ComplaintsStack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} options={{ title: 'Complaint' }} />
      <ComplaintsStack.Screen name="NewComplaint" component={NewComplaintScreen} options={{ title: 'New Complaint' }} />
    </ComplaintsStack.Navigator>
  );
}

function MoreStackScreen() {
  const screenOpts = {
    header: ComplaintsStackHeader,
    headerShadowVisible: false,
    headerStatusBarHeight: 0,
  };
  return (
    <MoreStack.Navigator screenOptions={screenOpts}>
      <MoreStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerLeft: ({ navigation }) => {
            const tabNav = navigation?.getParent?.();
            return (
              <TouchableOpacity
                onPress={() => tabNav?.navigate('Home')}
                style={headerStyles.headerBack}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons name="arrow-back" size={24} color={colors.navyHeaderIconMail} />
              </TouchableOpacity>
            );
          },
        }}
      />
      <MoreStack.Screen name="Messages" component={MessagesScreen} options={{ title: 'Messages' }} />
      <MoreStack.Screen name="UnionInfo" component={UnionInfoScreen} options={{ title: 'Union Info' }} />
      <MoreStack.Screen name="UnionMembers" component={UnionMembersScreen} options={{ title: 'Union Members' }} />
      <MoreStack.Screen name="UnionMemberDetail" component={UnionMemberDetailScreen} options={{ title: 'Member' }} />
      <MoreStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
    </MoreStack.Navigator>
  );
}

export default function MainTabs() {
  const insets = useSafeAreaInsets();
  const headerStyle = { backgroundColor: colors.surface };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        lazy: false, // Keep all tabs mounted so hook order in BottomTabView stays consistent (avoids Rules of Hooks error).
        tabBarIcon: ({ focused }) => <TabIcon routeName={route.name} focused={focused} />,
        tabBarActiveTintColor: '#1D4ED8',
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingTop: 10,
          paddingBottom: Math.max(12, insets.bottom),
          minHeight: 60 + Math.max(12, insets.bottom),
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        headerStyle,
        headerStatusBarHeight: 0,
        headerTintColor: colors.text,
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} options={{ title: 'Home', headerShown: true, header: TabHeader, hideHeader: true }} />
      <Tab.Screen
        name="Maintenance"
        component={MaintenanceScreen}
        options={{
          title: 'Maintenance',
          header: TabHeader,
          headerShadowVisible: false,
        }}
      />
      <Tab.Screen name="Complaints" component={ComplaintsStackScreen} options={{ headerShown: true, header: TabHeader, hideHeader: true }} />
      <Tab.Screen
        name="Defaulter"
        component={DefaulterScreen}
        options={{
          title: 'Defaulter',
          header: TabHeader,
          headerShadowVisible: false,
        }}
      />
      <Tab.Screen
        name="Finance"
        component={FinancialSummaryScreen}
        options={{
          title: 'Finance',
          header: TabHeader,
          headerShadowVisible: false,
        }}
      />
      <Tab.Screen name="More" component={MoreStackScreen} options={{ title: 'Profile', headerShown: true, header: TabHeader, hideHeader: true }} />
    </Tab.Navigator>
  );
}