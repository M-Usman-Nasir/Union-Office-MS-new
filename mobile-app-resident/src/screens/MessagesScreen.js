import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { messagesApi } from '../api/messages';
import { colors } from '../theme';

function formatTime(str) {
  if (!str) return '';
  const d = new Date(str);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
}

export default function MessagesScreen({ navigation }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [partners, setPartners] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (selectedUserId && otherUser) {
      navigation.setOptions({
        title: otherUser.name || 'Chat',
        headerLeft: () => (
          <TouchableOpacity onPress={() => setSelectedUserId(null)} style={{ padding: 8, marginLeft: 8 }}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions({ title: 'Messages', headerLeft: undefined });
    }
  }, [selectedUserId, otherUser, navigation]);

  useEffect(() => {
    if (!user) return;
    messagesApi.getConversations()
      .then((res) => setConversations(res.data?.data || []))
      .catch(() => setConversations([]));
    messagesApi.getPartners()
      .then((res) => setPartners(res.data?.data || []))
      .catch(() => setPartners([]))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      setOtherUser(null);
      return;
    }
    setLoadingChat(true);
    messagesApi.getMessagesWith(selectedUserId)
      .then((res) => {
        setMessages(res.data?.data || []);
        setOtherUser(res.data?.otherUser || null);
        messagesApi.getConversations().then((r) => setConversations(r.data?.data || [])).catch(() => {});
      })
      .catch(() => {
        setMessages([]);
        setOtherUser(null);
      })
      .finally(() => setLoadingChat(false));
  }, [selectedUserId]);

  const handleSend = async () => {
    const body = input.trim();
    if (!body || !selectedUserId) return;
    setSending(true);
    try {
      await messagesApi.send({ to_user_id: selectedUserId, body });
      setInput('');
      const res = await messagesApi.getMessagesWith(selectedUserId);
      setMessages(res.data?.data || []);
    } catch (e) {
      // ignore
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>
      </SafeAreaView>
    );
  }

  if (!selectedUserId) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Chat with admin</Text>
          {partners.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.convRow}
              onPress={() => setSelectedUserId(p.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="person-circle-outline" size={40} color={colors.primary} />
              <View style={styles.convText}>
                <Text style={styles.convName}>{p.name}</Text>
                <Text style={styles.convEmail}>{p.email}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
          {conversations.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={styles.convRow}
              onPress={() => setSelectedUserId(c.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={40} color={colors.primary} />
              <View style={styles.convText}>
                <Text style={styles.convName}>{c.name}</Text>
                <Text style={styles.convEmail} numberOfLines={1}>{c.last_message || 'No messages yet'}</Text>
              </View>
              {c.unread_count > 0 && (
                <View style={styles.badge}><Text style={styles.badgeText}>{c.unread_count}</Text></View>
              )}
              <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
          {partners.length === 0 && conversations.length === 0 && (
            <Text style={styles.empty}>No admins available to message.</Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={styles.chatContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
        {loadingChat ? (
          <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>
        ) : (
          <>
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={styles.messagesList}
              renderItem={({ item }) => (
                <View style={[styles.bubble, item.sender_id === user?.id ? styles.bubbleMe : styles.bubbleThem]}>
                  <Text style={[styles.bubbleText, item.sender_id === user?.id && styles.bubbleTextMe]}>{item.body}</Text>
                  <Text style={[styles.bubbleTime, item.sender_id === user?.id && styles.bubbleTextMe]}>{formatTime(item.created_at)}</Text>
                </View>
              )}
            />
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor={colors.textMuted}
                value={input}
                onChangeText={setInput}
                multiline
                maxLength={2000}
                editable={!sending}
              />
              <TouchableOpacity
                style={[styles.sendBtn, (!input.trim() || sending) && styles.sendBtnDisabled]}
                onPress={handleSend}
                disabled={!input.trim() || sending}
              >
                <Ionicons name="send" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 },
  convRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  convText: { flex: 1, marginLeft: 12 },
  convName: { fontWeight: '600', color: colors.text },
  convEmail: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  badge: { backgroundColor: colors.primary, borderRadius: 12, minWidth: 24, alignItems: 'center', paddingHorizontal: 6, marginRight: 8 },
  badgeText: { color: '#fff', fontSize: 12 },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 24 },
  chatContainer: { flex: 1 },
  messagesList: { padding: 16, paddingBottom: 8 },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 8 },
  bubbleMe: { alignSelf: 'flex-end', backgroundColor: colors.primary },
  bubbleThem: { alignSelf: 'flex-start', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  bubbleText: { color: colors.text, fontSize: 15 },
  bubbleTextMe: { color: '#fff' },
  bubbleTime: { fontSize: 11, marginTop: 4, opacity: 0.8 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  input: { flex: 1, backgroundColor: colors.surfaceSecondary, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, marginRight: 8, maxHeight: 100, color: colors.text, borderWidth: 1, borderColor: colors.border },
  sendBtn: { backgroundColor: colors.primary, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { opacity: 0.5 },
});
