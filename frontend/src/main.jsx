/*

AI-generated: 0%
Human-written: 100% (logic: application root setup, wrapping with providers, ReactDOM rendering)

Notes:

Entire file is human-written.

Sets up React StrictMode, routing, theme provider, global CSS baseline, authentication context, and renders the main App component.

*/
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import App from './App.jsx'
import theme from './styles/theme.js'
import { AuthProvider } from './auth/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
