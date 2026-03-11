import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { messagesApi } from '@/api/messagesApi'
import { ROLES } from '@/utils/constants'

const MessagesUnreadContext = createContext(null)

const MESSAGES_ROLES = [ROLES.ADMIN, ROLES.RESIDENT, ROLES.SUPER_ADMIN]

export function MessagesUnreadProvider({ children }) {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [conversations, setConversations] = useState([])

  const refreshUnread = useCallback(async () => {
    if (!user?.id || !MESSAGES_ROLES.includes(user?.role)) {
      setUnreadCount(0)
      setConversations([])
      return { list: [], total: 0 }
    }
    try {
      const res = await messagesApi.getConversations()
      const raw = res.data?.data ?? res.data
      const list = Array.isArray(raw) ? raw : []
      const total = list.reduce((sum, c) => sum + (Number(c.unread_count) || 0), 0)
      setUnreadCount(total)
      setConversations(list)
      return { list, total }
    } catch {
      setUnreadCount(0)
      setConversations([])
      return { list: [], total: 0 }
    }
  }, [user?.id, user?.role])

  // Fetch unread count as soon as user with messages access is ready
  useEffect(() => {
    if (user?.id && MESSAGES_ROLES.includes(user?.role)) {
      refreshUnread()
    } else {
      setUnreadCount(0)
      setConversations([])
    }
  }, [user?.id, user?.role, refreshUnread])

  const value = {
    unreadCount,
    conversations,
    refreshUnread,
    hasMessagesAccess: user && MESSAGES_ROLES.includes(user.role),
  }

  return (
    <MessagesUnreadContext.Provider value={value}>
      {children}
    </MessagesUnreadContext.Provider>
  )
}

export function useMessagesUnread() {
  const ctx = useContext(MessagesUnreadContext)
  if (!ctx) {
    return {
      unreadCount: 0,
      conversations: [],
      refreshUnread: async () => ({ list: [], total: 0 }),
      hasMessagesAccess: false,
    }
  }
  return ctx
}
