import { AppRoutes } from './routes'
import PWAInstallPrompt from './components/pwa/PWAInstallPrompt'
import './App.css'

function App() {
  return (
    <>
      <AppRoutes />
      <PWAInstallPrompt />
    </>
  )
}

export default App