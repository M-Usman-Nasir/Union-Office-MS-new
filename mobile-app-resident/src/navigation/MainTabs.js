import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, StatusBar, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
  headerLeftRow: { flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 0 },
  appHeaderTitle: { fontSize: 20, fontWeight: '700', color: colors.onNavy, flex: 1 },
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

function ComplaintsStackHeader({ navigation, options, back }) {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, STATUS_BAR_HEIGHT, 28);
  const canGoBack = navigation.canGoBack?.() ?? !!back;

  const renderBack =
    options?.headerLeft
      ? options.headerLeft
      : canGoBack
        ? () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={headerStyles.headerBack}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.onNavy} />
            </TouchableOpacity>
          )
        : null;

  return (
    <View style={[headerStyles.appHeader, { paddingTop: topInset }]}>
      <View style={headerStyles.headerLeftRow}>
        {renderBack ? renderBack({ navigation }) : null}
        <Text style={headerStyles.appHeaderTitle} numberOfLines={1}>{options.title}</Text>
      </View>
      <HeaderRightActions navigation={navigation} />
    </View>
  );
}

// Single header for all tab screens so BottomTabView always uses the same component (avoids hook-order issues).
// We always "show" header (headerShown: true) and use hideHeader to hide it, so the navigator never changes hook order.
function TabHeader({ navigation, options, back }) {
  const insets = useSafeAreaInsets();
  if (options?.headerShown === false || options?.hideHeader === true) return null;
  return <ComplaintsStackHeader navigation={navigation} options={options} back={back} />;
}

function RecentAnnouncementsHeader({ navigation, options, back }) {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, STATUS_BAR_HEIGHT, 28);
  const canGoBack = navigation.canGoBack?.() ?? !!back;
  return (
    <View style={[headerStyles.appHeader, { paddingTop: topInset }]}>
      <View style={headerStyles.headerLeftRow}>
        {canGoBack ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={headerStyles.headerBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="arrow-back" size={24} color={colors.onNavy} />
          </TouchableOpacity>
        ) : null}
        <Text style={headerStyles.appHeaderTitle} numberOfLines={1}>{options?.title ?? 'Recent Announcements'}</Text>
      </View>
      <HeaderRightActions navigation={navigation} />
    </View>
  );
}

import DashboardScreen from '../screens/DashboardScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ComplaintsScreen from '../screens/ComplaintsScreen';
import ComplaintDetailScreen from '../screens/ComplaintDetailScreen';
import NewComplaintScreen from '../screens/NewComplaintScreen';
import MaintenanceScreen from '../screens/MaintenanceScreen';
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

function HomeStackScreen() {
  const headerStyle = { backgroundColor: colors.surface };
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
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
        }}
      />
    </HomeStack.Navigator>
  );
}

function ComplaintsStackScreen() {
  const screenOpts = {
    header: ComplaintsStackHeader,
    headerShadowVisible: false,
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
                <Ionicons name="arrow-back" size={24} color={colors.onNavy} />
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
  const statusBarHeight = Platform.OS === 'android' ? (insets.top || 24) : insets.top;
  const headerStyle = { backgroundColor: colors.surface };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        lazy: false, // Keep all tabs mounted so hook order in BottomTabView stays consistent (avoids Rules of Hooks error).
        tabBarIcon: ({ focused, color }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Complaints: focused ? 'document-text' : 'document-text-outline',
            Maintenance: focused ? 'card' : 'card-outline',
            Finance: focused ? 'bar-chart' : 'bar-chart-outline',
            More: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name] || 'ellipse'} size={28} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
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
        headerStatusBarHeight: statusBarHeight,
        headerTintColor: colors.text,
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} options={{ title: 'Dashboard', headerShown: true, header: TabHeader, hideHeader: true }} />
      <Tab.Screen name="Complaints" component={ComplaintsStackScreen} options={{ headerShown: true, header: TabHeader, hideHeader: true }} />
      <Tab.Screen
        name="Maintenance"
        component={MaintenanceScreen}
        options={{
          title: 'Maintenance',
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
