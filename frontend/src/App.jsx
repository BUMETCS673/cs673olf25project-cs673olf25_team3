/*

AI-generated: 0%
Human-written: 100% (function: App; logic: routing setup, layout structure, integration of components and protected routes)

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
import Friends from './friends/Friends'

function App() {
  return (
    <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      <div>
        <Banner></Banner>
      </div>
      <div style={{display: 'flex', justifyContent: "center", flexDirection: "column", flexGrow: 1}}>
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
    </div>
  )
}

export default App
