import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import SafeScreen from '../components/SafeScreen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth';
import { residentsApi } from '../api/residents';
import { colors } from '../theme';

export default function EditProfileScreen() {
  const { user, refreshUser } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const initialData = route.params?.profileData || user;
  const initialExtended = route.params?.extendedData || null;

  const [name, setName] = useState(initialData?.name || '');
  const [contactNumber, setContactNumber] = useState(initialData?.contact_number || '');
  const [emergencyContact, setEmergencyContact] = useState(initialData?.emergency_contact || '');
  const [cnic, setCnic] = useState(initialData?.cnic || '');
  const [address, setAddress] = useState(initialExtended?.address ?? initialData?.address ?? '');
  const [kElectricAccount, setKElectricAccount] = useState(initialExtended?.k_electric_account ?? '');
  const [gasAccount, setGasAccount] = useState(initialExtended?.gas_account ?? '');
  const [waterAccount, setWaterAccount] = useState(initialExtended?.water_account ?? '');
  const [phoneTvAccount, setPhoneTvAccount] = useState(initialExtended?.phone_tv_account ?? '');
  const [numberOfCars, setNumberOfCars] = useState(initialExtended?.number_of_cars != null ? String(initialExtended.number_of_cars) : '');
  const [carMakeModel, setCarMakeModel] = useState(initialExtended?.car_make_model ?? '');
  const [licensePlate, setLicensePlate] = useState(initialExtended?.license_plate ?? '');
  const [numberOfBikes, setNumberOfBikes] = useState(initialExtended?.number_of_bikes != null ? String(initialExtended.number_of_bikes) : '');
  const [bikeMakeModel, setBikeMakeModel] = useState(initialExtended?.bike_make_model ?? '');
  const [bikeLicensePlate, setBikeLicensePlate] = useState(initialExtended?.bike_license_plate ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setContactNumber(initialData.contact_number || '');
      setEmergencyContact(initialData.emergency_contact || '');
      setCnic(initialData.cnic || '');
    }
  }, [initialData?.id]);

  useEffect(() => {
    if (initialExtended) {
      setAddress(initialExtended.address ?? '');
      setKElectricAccount(initialExtended.k_electric_account ?? '');
      setGasAccount(initialExtended.gas_account ?? '');
      setWaterAccount(initialExtended.water_account ?? '');
      setPhoneTvAccount(initialExtended.phone_tv_account ?? '');
      setNumberOfCars(initialExtended.number_of_cars != null ? String(initialExtended.number_of_cars) : '');
      setCarMakeModel(initialExtended.car_make_model ?? '');
      setLicensePlate(initialExtended.license_plate ?? '');
      setNumberOfBikes(initialExtended.number_of_bikes != null ? String(initialExtended.number_of_bikes) : '');
      setBikeMakeModel(initialExtended.bike_make_model ?? '');
      setBikeLicensePlate(initialExtended.bike_license_plate ?? '');
    }
  }, [initialExtended]);

  const handleSave = async () => {
    const trimmedName = (name || '').trim();
    if (!trimmedName) {
      setError('Name is required');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await authApi.updateProfile({
        name: trimmedName,
        contact_number: contactNumber.trim() || null,
        emergency_contact: emergencyContact.trim() || null,
        cnic: cnic.trim() || null,
      });
      const additionalPayload = {
        address: address.trim() || null,
        k_electric_account: kElectricAccount.trim() || null,
        gas_account: gasAccount.trim() || null,
        water_account: waterAccount.trim() || null,
        phone_tv_account: phoneTvAccount.trim() || null,
        number_of_cars: numberOfCars.trim() !== '' ? parseInt(numberOfCars, 10) : null,
        car_make_model: carMakeModel.trim() || null,
        license_plate: licensePlate.trim() || null,
        number_of_bikes: numberOfBikes.trim() !== '' ? parseInt(numberOfBikes, 10) : null,
        bike_make_model: bikeMakeModel.trim() || null,
        bike_license_plate: bikeLicensePlate.trim() || null,
      };
      await residentsApi.update(user.id, additionalPayload);
      await refreshUser();
      navigation.goBack();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(msg);
      Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeScreen style={styles.safe} edges={[]}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal information</Text>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Full name"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={user?.email || ''}
              editable={false}
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.hint}>Email cannot be changed</Text>
            <Text style={styles.label}>Contact number</Text>
            <TextInput
              style={styles.input}
              value={contactNumber}
              onChangeText={setContactNumber}
              placeholder="Phone number"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
            />
            <Text style={styles.label}>Emergency contact</Text>
            <TextInput
              style={styles.input}
              value={emergencyContact}
              onChangeText={setEmergencyContact}
              placeholder="Emergency contact number"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
            />
            <Text style={styles.label}>CNIC</Text>
            <TextInput
              style={styles.input}
              value={cnic}
              onChangeText={setCnic}
              placeholder="National ID (CNIC)"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional details</Text>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={address}
              onChangeText={setAddress}
              placeholder="Full address"
              placeholderTextColor={colors.textMuted}
              multiline
            />
            <Text style={styles.label}>K-Electric account</Text>
            <TextInput
              style={styles.input}
              value={kElectricAccount}
              onChangeText={setKElectricAccount}
              placeholder="Account number"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.label}>Gas account</Text>
            <TextInput
              style={styles.input}
              value={gasAccount}
              onChangeText={setGasAccount}
              placeholder="Account number"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.label}>Water account</Text>
            <TextInput
              style={styles.input}
              value={waterAccount}
              onChangeText={setWaterAccount}
              placeholder="Account number"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.label}>Phone / TV account</Text>
            <TextInput
              style={styles.input}
              value={phoneTvAccount}
              onChangeText={setPhoneTvAccount}
              placeholder="Account number"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.sectionTitle}>Vehicle (optional)</Text>
            <Text style={styles.label}>Number of cars</Text>
            <TextInput
              style={styles.input}
              value={numberOfCars}
              onChangeText={setNumberOfCars}
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
            />
            <Text style={styles.label}>Car make & model</Text>
            <TextInput
              style={styles.input}
              value={carMakeModel}
              onChangeText={setCarMakeModel}
              placeholder="e.g. Toyota Corolla"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.label}>License plate</Text>
            <TextInput
              style={styles.input}
              value={licensePlate}
              onChangeText={setLicensePlate}
              placeholder="Plate number"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.label}>Number of bikes</Text>
            <TextInput
              style={styles.input}
              value={numberOfBikes}
              onChangeText={setNumberOfBikes}
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
            />
            <Text style={styles.label}>Bike make & model</Text>
            <TextInput
              style={styles.input}
              value={bikeMakeModel}
              onChangeText={setBikeMakeModel}
              placeholder="e.g. Honda 70"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.label}>Bike license plate</Text>
            <TextInput
              style={styles.input}
              value={bikeLicensePlate}
              onChangeText={setBikeLicensePlate}
              placeholder="Plate number"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {error ? (
            <View style={styles.errorWrap}>
              <Ionicons name="alert-circle" size={18} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={22} color="#fff" />
                <Text style={styles.saveBtnText}>Save changes</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  keyboard: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: 16 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  inputDisabled: {
    opacity: 0.8,
  },
  inputMultiline: {
    minHeight: 72,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: -8,
    marginBottom: 14,
  },
  errorWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${colors.error}15`,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: `${colors.error}40`,
  },
  errorText: { color: colors.error, fontSize: 14, flex: 1 },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
