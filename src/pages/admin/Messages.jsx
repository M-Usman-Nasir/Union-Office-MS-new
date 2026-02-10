import { useState, useEffect, useRef } from 'react'
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Button,
  Paper,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import ChatIcon from '@mui/icons-material/Chat'
import { useAuth } from '@/contexts/AuthContext'
import { messagesApi } from '@/api/messagesApi'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

export default function Messages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [partners, setPartners] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [messages, setMessages] = useState([])
  const [otherUser, setOtherUser] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [loadingConv, setLoadingConv] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [newPartnerId, setNewPartnerId] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (!user) return
    messagesApi.getConversations()
      .then(res => {
        setConversations(res.data?.data || [])
      })
      .catch(() => setConversations([]))
      .finally(() => setLoadingConv(false))
    messagesApi.getPartners()
      .then(res => {
        setPartners(res.data?.data || [])
      })
      .catch(() => setPartners([]))
  }, [user])

  useEffect(() => {
    if (!selectedUserId) {
      setMessages([])
      setOtherUser(null)
      return
    }
    setLoadingMessages(true)
    messagesApi.getMessagesWith(selectedUserId)
      .then(res => {
        setMessages(res.data?.data || [])
        setOtherUser(res.data?.otherUser || null)
        setLoadingConv(false)
        messagesApi.getConversations().then(r => setConversations(r.data?.data || [])).catch(() => {})
      })
      .catch(() => {
        setMessages([])
        setOtherUser(null)
      })
      .finally(() => setLoadingMessages(false))
  }, [selectedUserId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    const body = newMessage.trim()
    if (!body || !selectedUserId) return
    setSending(true)
    try {
      await messagesApi.send({ to_user_id: selectedUserId, body })
      setNewMessage('')
      const res = await messagesApi.getMessagesWith(selectedUserId)
      setMessages(res.data?.data || [])
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to send')
    } finally {
      setSending(false)
    }
  }

  const startNewChat = () => {
    if (newPartnerId) setSelectedUserId(Number(newPartnerId))
    setNewPartnerId('')
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h5" gutterBottom>Messages</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Chat with residents (Union Admin) or with admins (Resident).
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' }, minHeight: 480 }}>
        <Paper sx={{ width: { md: 280 }, flexShrink: 0, overflow: 'auto' }}>
          {partners.length > 0 && (
            <Box sx={{ p: 2 }}>
              <FormControl size="small" fullWidth sx={{ mb: 1 }}>
                <InputLabel>New chat with</InputLabel>
                <Select
                  value={newPartnerId}
                  label="New chat with"
                  onChange={(e) => setNewPartnerId(e.target.value)}
                >
                  {partners.map((p) => (
                    <MenuItem key={p.id} value={String(p.id)}>{p.name} ({p.email})</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button size="small" variant="outlined" startIcon={<ChatIcon />} onClick={startNewChat} fullWidth>
                Start chat
              </Button>
            </Box>
          )}
          {loadingConv ? (
            <Box sx={{ p: 2, textAlign: 'center' }}><CircularProgress size={24} /></Box>
          ) : (
            <List dense>
              {conversations.map((c) => (
                <ListItem key={c.id} disablePadding>
                  <ListItemButton
                    selected={selectedUserId === c.id}
                    onClick={() => setSelectedUserId(c.id)}
                  >
                    <ListItemText
                      primary={c.name}
                      secondary={c.last_message ? (c.last_sent_by_me ? 'You: ' : '') + (c.last_message?.slice(0, 40) + (c.last_message?.length > 40 ? '…' : '')) + (c.unread_count > 0 ? ` (${c.unread_count})` : '') : 'No messages'}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              {conversations.length === 0 && !loadingConv && (
                <ListItem><ListItemText primary="No conversations yet. Start a chat above." /></ListItem>
              )}
            </List>
          )}
        </Paper>

        <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 400 }}>
          {!selectedUserId ? (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
              Select a conversation or start a new chat.
            </Box>
          ) : loadingMessages ? (
            <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>
          ) : (
            <>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography fontWeight={600}>{otherUser?.name || 'Chat'}</Typography>
                {otherUser?.email && <Typography variant="body2" color="text.secondary">{otherUser.email}</Typography>}
              </Box>
              <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {messages.map((m) => (
                  <Box
                    key={m.id}
                    sx={{
                      alignSelf: m.sender_id === user?.id ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                      bgcolor: m.sender_id === user?.id ? 'primary.main' : 'grey.200',
                      color: m.sender_id === user?.id ? 'primary.contrastText' : 'text.primary',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2">{m.body}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>{dayjs(m.created_at).format('DD/MM/YY HH:mm')}</Typography>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  disabled={sending}
                />
                <Button variant="contained" onClick={handleSend} disabled={sending || !newMessage.trim()}><SendIcon /></Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  )
}
