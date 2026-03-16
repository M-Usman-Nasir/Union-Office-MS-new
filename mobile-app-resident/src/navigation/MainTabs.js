import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, StatusBar, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0;

const headerStyles = StyleSheet.create({
  complaintsHeader: {
    backgroundColor: colors.surface,
    paddingBottom: 12,
    paddingHorizontal: 8,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerBack: { padding: 8, marginRight: 4 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 0 },
  headerIcon: { marginRight: 8 },
  complaintsHeaderTitle: { fontSize: 18, fontWeight: '600', color: colors.text, flex: 1 },
});

function ComplaintsStackHeader({ navigation, options, back }) {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, STATUS_BAR_HEIGHT, 28);
  const canGoBack = navigation.canGoBack?.() ?? !!back;
  const iconName = options?.headerIconName || 'ellipse';
  const iconColor = options?.headerIconColor || colors.primary;

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
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          )
        : null;

  return (
    <View style={[headerStyles.complaintsHeader, { paddingTop: topInset }]}>
      {renderBack ? renderBack({ navigation }) : null}
      <View style={headerStyles.headerTitleRow}>
        <View style={headerStyles.headerIcon}>
          <Ionicons name={iconName} size={22} color={iconColor} />
        </View>
        <Text style={headerStyles.complaintsHeaderTitle} numberOfLines={1}>{options.title}</Text>
      </View>
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
    <View style={[headerStyles.complaintsHeader, { paddingTop: topInset }]}>
      {canGoBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={headerStyles.headerBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
      ) : null}
      <View style={headerStyles.headerTitleRow}>
        <View style={headerStyles.headerIcon}>
          <Ionicons name="megaphone-outline" size={22} color={colors.primary} />
        </View>
        <Text style={headerStyles.complaintsHeaderTitle} numberOfLines={1}>{options?.title ?? 'Recent Announcements'}</Text>
      </View>
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
      <ComplaintsStack.Screen name="ComplaintsList" component={ComplaintsScreen} options={{ title: 'Complaints', headerIconName: 'document-text-outline', headerIconColor: colors.primary }} />
      <ComplaintsStack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} options={{ title: 'Complaint', headerIconName: 'document-text', headerIconColor: colors.primary }} />
      <ComplaintsStack.Screen name="NewComplaint" component={NewComplaintScreen} options={{ title: 'New Complaint', headerIconName: 'create-outline', headerIconColor: colors.primary }} />
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
          headerIconName: 'person-outline',
          headerIconColor: colors.primary,
          headerLeft: ({ navigation }) => {
            const tabNav = navigation?.getParent?.();
            return (
              <TouchableOpacity
                onPress={() => tabNav?.navigate('Home')}
                style={headerStyles.headerBack}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
            );
          },
        }}
      />
      <MoreStack.Screen name="Messages" component={MessagesScreen} options={{ title: 'Messages', headerIconName: 'mail-outline', headerIconColor: colors.primary }} />
      <MoreStack.Screen name="UnionInfo" component={UnionInfoScreen} options={{ title: 'Union Info', headerIconName: 'business-outline', headerIconColor: colors.success }} />
      <MoreStack.Screen name="UnionMembers" component={UnionMembersScreen} options={{ title: 'Union Members', headerIconName: 'people-outline', headerIconColor: colors.warning }} />
      <MoreStack.Screen name="UnionMemberDetail" component={UnionMemberDetailScreen} options={{ title: 'Member', headerIconName: 'person', headerIconColor: colors.primary }} />
      <MoreStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile', headerIconName: 'create-outline', headerIconColor: colors.primary }} />
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
          headerIconName: 'card-outline',
          headerIconColor: colors.primary,
          headerShadowVisible: false,
        }}
      />
      <Tab.Screen
        name="Finance"
        component={FinancialSummaryScreen}
        options={{
          title: 'Finance',
          header: TabHeader,
          headerIconName: 'bar-chart-outline',
          headerIconColor: colors.success,
          headerShadowVisible: false,
        }}
      />
      <Tab.Screen name="More" component={MoreStackScreen} options={{ title: 'Profile', headerShown: true, header: TabHeader, hideHeader: true }} />
    </Tab.Navigator>
  );
}
