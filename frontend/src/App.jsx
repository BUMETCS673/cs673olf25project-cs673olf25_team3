import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './auth/Login'
import SignUp from './auth/Signup'
import Logout from './auth/Logout'
import Home from './components/Home'
import AuthProtectedRoute from './auth/AuthProtectedRoute'

function App() {
  return (
    <div>
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
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App
