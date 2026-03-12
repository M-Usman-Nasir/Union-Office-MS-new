import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import SafeScreen from '../components/SafeScreen';
import { useAuth } from '../context/AuthContext';
import { apartmentApi } from '../api/apartment';
import { propertyApi } from '../api/property';
import { colors } from '../theme';

export default function UnionInfoScreen() {
  const { user } = useAuth();
  const societyId = user?.society_apartment_id;
  const [society, setSociety] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!societyId) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const [socRes, blockRes, unitRes] = await Promise.all([
          apartmentApi.getById(societyId),
          propertyApi.getBlocks({ society_id: societyId }),
          propertyApi.getUnits({ society_id: societyId }),
        ]);
        setSociety(socRes.data?.data || socRes.data);
        const b = blockRes.data?.data || blockRes.data;
        setBlocks(Array.isArray(b) ? b : b?.data || []);
        const u = unitRes.data?.data || unitRes.data;
        setUnits(Array.isArray(u) ? u : u?.data || []);
      } catch (e) {
        setSociety(null);
        setBlocks([]);
        setUnits([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [societyId]);

  if (loading) {
    return (
      <SafeScreen style={styles.safe} edges={[]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeScreen>
    );
  }

  if (!society) {
    return (
      <SafeScreen style={styles.safe} edges={[]}>
        <View style={styles.centered}>
          <Text style={styles.muted}>No society information available</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.safe} edges={[]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.name}>{society.name}</Text>
          {society.address ? <Text style={styles.muted}>{society.address}</Text> : null}
          {society.total_floors != null && (
            <Text style={styles.muted}>Floors: {society.total_floors}</Text>
          )}
        </View>
        {blocks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Blocks</Text>
            {blocks.map((b) => (
              <View key={b.id} style={styles.row}>
                <Text style={styles.label}>{b.name || b.block_number || `Block ${b.id}`}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Units ({units.length})</Text>
          {units.length === 0 ? (
            <Text style={styles.muted}>No units listed</Text>
          ) : (
            units.slice(0, 50).map((u) => (
              <View key={u.id} style={styles.row}>
                <Text style={styles.label}>{u.unit_number} · {u.owner_name || u.resident_name || '—'}</Text>
              </View>
            ))
          )}
          {units.length > 50 && <Text style={styles.muted}>... and {units.length - 50} more</Text>}
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingBottom: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: colors.border },
  name: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 },
  row: { backgroundColor: colors.surface, borderRadius: 8, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  label: { color: colors.text },
  muted: { color: colors.textMuted, fontSize: 14 },
});
