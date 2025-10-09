/*
AI-generated: 0%
Human-written: 100% (function: App; logic: routing setup, layout structure, integration of components and protected routes, styling)

Notes:

Entire routing and layout logic is human-written.

Uses React Router to define routes, redirects, and wraps protected routes with AuthProtectedRoute.

Includes Banner and flexbox layout for the application structure.

*/

import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './auth/Login'
import SignUp from './auth/Signup'
import Logout from './auth/Logout'
import Home from './components/Home'
import Banner from './components/Banner'
import AuthProtectedRoute from './auth/AuthProtectedRoute'
import AddPlanPage from './plans/AddPlanPage'
import Friends from './friends/Friends'

function App() {
  return (
    <div className="app-container" style={styles.appContainer}>
      {/* Sticky top banner */}
      <header style={styles.banner}>
        <Banner />
      </header>

      {/* Main content area */}
      <main style={styles.main}>
        <div style={styles.contentWrapper}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="/home"
              element={
                <AuthProtectedRoute>
                  <Home />
                </AuthProtectedRoute>
              }
            />

            {/* Add Plan */}
            <Route
              path="/plans/add"
              element={
                <AuthProtectedRoute>
                  <AddPlanPage />
                </AuthProtectedRoute>
              }
            />

            {/* Edit Plan */}
            <Route
              path="/plans/edit/:planId"
              element={
                <AuthProtectedRoute>
                  <AddPlanPage editMode />
                </AuthProtectedRoute>
              }
            />

            <Route path="/friends" element={
                <AuthProtectedRoute>
                <Friends />
                </AuthProtectedRoute>
              } 
            />   

            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

const styles = {
  appContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  banner: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  main: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    padding: '2rem',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: '1000px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    padding: '2rem',
  },
}

export default App


