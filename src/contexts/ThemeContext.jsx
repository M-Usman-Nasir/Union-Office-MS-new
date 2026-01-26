import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const ThemeContext = createContext(null)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

const getInitialMode = () => {
  // Check localStorage first
  const saved = localStorage.getItem('themeMode')
  if (saved === 'light' || saved === 'dark') {
    return saved
  }
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(getInitialMode)

  useEffect(() => {
    localStorage.setItem('themeMode', mode)
  }, [mode])

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#0ea5e9',
            light: '#38bdf8',
            dark: '#0284c7',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#64748b',
            light: '#94a3b8',
            dark: '#475569',
            contrastText: '#ffffff',
          },
          success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
            contrastText: '#ffffff',
          },
          warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
            contrastText: '#ffffff',
          },
          error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
            contrastText: '#ffffff',
          },
          info: {
            main: '#3b82f6',
            light: '#60a5fa',
            dark: '#2563eb',
            contrastText: '#ffffff',
          },
          background: {
            default: mode === 'dark' ? '#0f172a' : '#ffffff',
            paper: mode === 'dark' ? '#1e293b' : '#f8fafc',
          },
          text: {
            primary: mode === 'dark' ? '#f1f5f9' : '#1e293b',
            secondary: mode === 'dark' ? '#cbd5e1' : '#64748b',
            disabled: mode === 'dark' ? '#475569' : '#cbd5e1',
          },
          divider: mode === 'dark' ? '#334155' : '#e2e8f0',
        },
        typography: {
          fontFamily: ['Inter', 'Poppins', 'Roboto', 'system-ui', 'sans-serif'].join(','),
          h1: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '2.25rem',
            lineHeight: 1.2,
          },
          h2: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '1.875rem',
            lineHeight: 1.3,
          },
          h3: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.4,
          },
          h4: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: 1.4,
          },
          h5: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '1.125rem',
            lineHeight: 1.5,
          },
          h6: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: 1.5,
          },
          body1: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            lineHeight: 1.5,
          },
          body2: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            lineHeight: 1.5,
          },
          button: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            textTransform: 'none',
          },
        },
        shape: {
          borderRadius: 8,
        },
        spacing: 8,
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                padding: '8px 16px',
                fontWeight: 500,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow:
                  mode === 'dark'
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 8,
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
        },
      }),
    [mode]
  )

  const value = {
    mode,
    toggleMode,
    isDark: mode === 'dark',
  }

  return (
    <ThemeContext.Provider value={value}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  )
}
