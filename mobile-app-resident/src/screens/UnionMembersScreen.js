import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { unionMembersApi } from '../api/unionMembers';
import { colors } from '../theme';

const PAGE_SIZE = 20;

function formatDate(str) {
  if (!str) return 'N/A';
  return new Date(str).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function UnionMembersScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const societyId = user?.society_apartment_id;
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, pages: 0 });
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const load = useCallback(async (page = 1, append = false) => {
    if (!societyId) return;
    const isRefresh = page === 1 && !append;
    if (isRefresh) setLoading(true);
    else if (append) setLoadingMore(true);
    else setRefreshing(true);
    try {
      const res = await unionMembersApi.getAll({
        page,
        limit: PAGE_SIZE,
        search: searchDebounced.trim() || undefined,
      });
      const raw = res.data?.data ?? res.data;
      const data = Array.isArray(raw) ? raw : raw?.data || [];
      const pag = res.data?.pagination ?? {
        page,
        limit: PAGE_SIZE,
        total: data.length,
        pages: 1,
      };
      setList(append ? (prev) => [...prev, ...data] : data);
      setPagination(pag);
    } catch (e) {
      if (!append) setList([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [societyId, searchDebounced]);

  useFocusEffect(
    useCallback(() => {
      if (societyId) load(1, false);
    }, [societyId, load])
  );

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!societyId) return;
    load(1, false);
  }, [societyId, searchDebounced]);

  const onRefresh = () => load(1, false);
  const onEndReached = () => {
    if (loadingMore || loading || pagination.page >= pagination.pages) return;
    load(pagination.page + 1, true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('UnionMemberDetail', { member: item })}
      activeOpacity={0.7}
    >
      <View style={styles.cardRow}>
        <Ionicons name="person-outline" size={22} color={colors.primary} />
        <Text style={styles.name} numberOfLines={1}>{item.member_name || '—'}</Text>
      </View>
      {item.designation ? (
        <Text style={styles.designation}>{item.designation}</Text>
      ) : null}
      {item.unit_number != null && (
        <Text style={styles.muted}>Unit {item.unit_number}</Text>
      )}
    </TouchableOpacity>
  );

  if (!societyId) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.centered}>
          <Text style={styles.muted}>No society assigned</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading && list.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={20} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, designation, phone, email..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No union members found</Text>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 4,
  },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  name: { fontSize: 16, fontWeight: '600', color: colors.text, flex: 1 },
  designation: { fontSize: 14, color: colors.textSecondary, marginBottom: 2 },
  muted: { fontSize: 13, color: colors.textMuted },
  empty: { alignItems: 'center', paddingTop: 48 },
  emptyText: { color: colors.textMuted, marginTop: 12, fontSize: 15 },
  footer: { paddingVertical: 16, alignItems: 'center' },
});
