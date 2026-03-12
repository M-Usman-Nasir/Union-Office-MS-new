import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import SafeScreen from '../components/SafeScreen';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useAuth } from '../context/AuthContext';
import { complaintsApi } from '../api/complaints';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme';

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const MAX_ATTACHMENTS = 5;
const MAX_FILE_SIZE_MB = 5;

export default function NewComplaintScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pickAttachments = async () => {
    if (attachmentFiles.length >= MAX_ATTACHMENTS) {
      Alert.alert('Limit reached', `Max ${MAX_ATTACHMENTS} files. Remove one to add another.`);
      return;
    }
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled) return;
      const file = result.assets?.[0] || result;
      const size = file.size ?? 0;
      if (size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        Alert.alert('File too large', `Max ${MAX_FILE_SIZE_MB}MB per file.`);
        return;
      }
      setAttachmentFiles((prev) => [...prev, file].slice(0, MAX_ATTACHMENTS));
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not pick file');
    }
  };

  const removeAttachment = (index) => {
    setAttachmentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setError('');
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    setLoading(true);
    try {
      const hasAttachments = attachmentFiles.length > 0;
      if (hasAttachments) {
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        formData.append('priority', priority);
        formData.append('unit_id', String(user?.unit_id ?? ''));
        formData.append('society_apartment_id', String(user?.society_apartment_id ?? ''));
        attachmentFiles.forEach((file) => {
          formData.append('attachments', {
            uri: file.uri,
            name: file.name || `file_${Date.now()}`,
            type: file.mimeType || 'application/octet-stream',
          });
        });
        await complaintsApi.createWithAttachments(formData);
      } else {
        await complaintsApi.create({
          title: title.trim(),
          subject: title.trim(),
          description: description.trim(),
          priority,
          society_apartment_id: user?.society_apartment_id,
          unit_id: user?.unit_id,
        });
      }
      Alert.alert('Success', 'Complaint submitted.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen style={styles.safe} edges={[]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter complaint title"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
          editable={!loading}
        />

        <Text style={styles.label}>Priority *</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => (
            <TouchableOpacity
              key={p.value}
              style={[styles.priorityBtn, priority === p.value && styles.priorityBtnActive]}
              onPress={() => setPriority(p.value)}
              disabled={loading}
            >
              <Text style={[styles.priorityBtnText, priority === p.value && styles.priorityBtnTextActive]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your complaint"
          placeholderTextColor={colors.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          editable={!loading}
        />

        <Text style={styles.label}>Attachments (optional)</Text>
        <Text style={styles.hint}>Images or PDF, max {MAX_ATTACHMENTS} files, {MAX_FILE_SIZE_MB}MB each</Text>
        <TouchableOpacity style={styles.attachBtn} onPress={pickAttachments} disabled={loading}>
          <Ionicons name="attach" size={20} color={colors.primary} />
          <Text style={styles.attachBtnText}>Choose files</Text>
        </TouchableOpacity>
        {attachmentFiles.length > 0 && (
          <View style={styles.attachmentList}>
            {attachmentFiles.map((file, index) => (
              <View key={index} style={styles.attachmentItem}>
                <Ionicons name="document-text" size={18} color={colors.textSecondary} />
                <Text style={styles.attachmentName} numberOfLines={1}>{file.name || `File ${index + 1}`}</Text>
                <TouchableOpacity onPress={() => removeAttachment(index)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="close-circle" size={22} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit Complaint</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { paddingBottom: 16 },
  error: { color: colors.error, marginBottom: 12, fontSize: 14 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 14,
    color: colors.text,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  priorityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  priorityBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  priorityBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  priorityBtnText: { fontSize: 14, fontWeight: '500', color: colors.text },
  priorityBtnTextActive: { color: '#fff' },
  attachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  attachBtnText: { fontSize: 15, color: colors.primary, fontWeight: '500' },
  attachmentList: { marginBottom: 16 },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  attachmentName: { flex: 1, fontSize: 14, color: colors.text },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
