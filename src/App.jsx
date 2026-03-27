import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import Layout from './components/layout/Layout'
import AdminLayout from './components/admin/AdminLayout'

import Home from './pages/public/Home'
import Services from './pages/public/Services'
import About from './pages/public/About'
import Reservation from './pages/public/Reservation'
import Contact from './pages/public/Contact'
import Actualites from './pages/public/Actualites'

import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Reservations from './pages/admin/Reservations'
import Agents from './pages/admin/Agents'
import Posts from './pages/admin/Posts'
import Planning from './pages/admin/Planning'
import Avis from './pages/admin/Avis'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
  return user ? children : <Navigate to="/admin/login" replace />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public site */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/services" element={<Layout><Services /></Layout>} />
          <Route path="/a-propos" element={<Layout><About /></Layout>} />
          <Route path="/reservation" element={<Layout><Reservation /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/actualites" element={<Layout><Actualites /></Layout>} />

          {/* Admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/reservations" element={
            <ProtectedRoute><AdminLayout><Reservations /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/agents" element={
            <ProtectedRoute><AdminLayout><Agents /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/posts" element={
            <ProtectedRoute><AdminLayout><Posts /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/planning" element={
            <ProtectedRoute><AdminLayout><Planning /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/avis" element={
            <ProtectedRoute><AdminLayout><Avis /></AdminLayout></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
