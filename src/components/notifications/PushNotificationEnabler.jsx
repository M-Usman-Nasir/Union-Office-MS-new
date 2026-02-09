import { useState, useEffect, useCallback } from 'react'
import {
  Snackbar,
  Alert,
  Button,
  Typography,
} from '@mui/material'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import { useAuth } from '@/contexts/AuthContext'
import { notificationApi } from '@/api/notificationApi'
import { ROLES } from '@/utils/constants'
import toast from 'react-hot-toast'

const STORAGE_KEY = 'push-notification-dismissed'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function PushNotificationEnabler() {
  const { user } = useAuth()
  const [showPrompt, setShowPrompt] = useState(false)
  const [loading, setLoading] = useState(false)

  const isResident = user?.role === ROLES.RESIDENT
  const canPush = typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window

  const subscribePush = useCallback(async () => {
    if (!canPush || !isResident) return false
    try {
      const reg = await navigator.serviceWorker.ready
      const res = await notificationApi.getVapidPublic()
      const publicKey = res.data?.data?.publicKey
      if (!publicKey) {
        toast.error('Push not configured')
        return false
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })
      const subscription = sub.toJSON()
      await notificationApi.subscribe({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys?.p256dh,
          auth: subscription.keys?.auth,
        },
      })
      return true
    } catch (err) {
      console.error('Push subscribe error:', err)
      if (err.response?.status === 503) {
        toast.error('Push notifications are not available')
      } else {
        toast.error(err.response?.data?.message || 'Could not enable notifications')
      }
      return false
    }
  }, [canPush, isResident])

  const handleEnable = async () => {
    setLoading(true)
    try {
      if (Notification.permission === 'denied') {
        toast.error('Notifications were previously blocked. Please allow them in browser settings.')
        setShowPrompt(false)
        return
      }
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
          toast.error('Permission denied')
          setShowPrompt(false)
          return
        }
      }
      const ok = await subscribePush()
      if (ok) {
        toast.success('You will receive reminders for pending dues')
        localStorage.setItem(STORAGE_KEY, 'subscribed')
        setShowPrompt(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem(STORAGE_KEY, Date.now().toString())
  }

  useEffect(() => {
    if (!isResident || !canPush) return
    if (Notification.permission === 'granted') {
      subscribePush().catch(() => {})
      return
    }
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (dismissed === 'subscribed') return
    if (dismissed) {
      const t = parseInt(dismissed, 10)
      if (Number.isNaN(t)) return
      if (Date.now() - t < 7 * 24 * 60 * 60 * 1000) return
    }
    setShowPrompt(true)
  }, [isResident, canPush, subscribePush])

  if (!showPrompt || !isResident) return null

  return (
    <Snackbar
      open={showPrompt}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ bottom: { xs: 90, sm: 24 } }}
    >
      <Alert
        severity="info"
        icon={<NotificationsActiveIcon />}
        action={
          <>
            <Button color="inherit" size="small" onClick={handleEnable} disabled={loading}>
              {loading ? 'Enabling…' : 'Enable'}
            </Button>
            <Button color="inherit" size="small" onClick={handleDismiss}>
              Later
            </Button>
          </>
        }
        sx={{ width: '100%', maxWidth: { xs: '90%', sm: 380 } }}
      >
        <Typography variant="body2">
          Get email and push reminders for pending maintenance dues
        </Typography>
      </Alert>
    </Snackbar>
  )
}
