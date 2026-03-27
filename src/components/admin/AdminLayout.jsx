import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, CalendarCheck, FileText,
  LogOut, Shield, Menu, X, ChevronRight, CalendarDays, Star, PenLine
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const sidebarLinks = [
  { path: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { path: '/admin/reservations', label: 'Réservations', icon: CalendarCheck },
  { path: '/admin/agents', label: 'Agents', icon: Users },
  { path: '/admin/planning', label: 'Planning', icon: CalendarDays },
  { path: '/admin/avis', label: 'Avis clients', icon: Star },
  { path: '/admin/contenu', label: 'Textes du site', icon: PenLine },
  { path: '/admin/posts', label: 'Actualités', icon: FileText },
]

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { pathname } = useLocation()
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } bg-dark-800 border-r border-dark-600 flex flex-col transition-all duration-300 flex-shrink-0`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-dark-600">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold-400" />
              <span className="font-serif text-sm font-semibold text-white">Turbo Sécurity</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-gold-400 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {sidebarLinks.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all duration-200 group ${
                pathname === path
                  ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1">{label}</span>
                  {pathname === path && <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-dark-600">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-sm text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-dark-700 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-dark-800 border-b border-dark-600 flex items-center justify-between px-6">
          <h1 className="text-white font-semibold">
            {sidebarLinks.find(l => l.path === pathname)?.label || 'Administration'}
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-400">Admin connecté</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
