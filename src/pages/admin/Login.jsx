import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Shield, Loader } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: err } = await signIn(email, password)
    setLoading(false)

    if (err) {
      setError('Email ou mot de passe incorrect.')
    } else {
      navigate('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-700 rounded-sm flex items-center justify-center mx-auto mb-4">
            <Shield className="w-9 h-9 text-dark-900" />
          </div>
          <h1 className="font-serif text-2xl text-white font-semibold">Turbo Sécurity</h1>
          <p className="text-gray-500 text-sm mt-1">Administration — Accès sécurisé</p>
        </div>

        <div className="card-dark p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-3 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors"
                placeholder="admin@turbosecurity.fr"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Mot de passe</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full bg-dark-600 border border-dark-500 text-white px-4 py-3 rounded-sm text-sm focus:border-gold-500 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <><Loader className="w-4 h-4 animate-spin" /> Connexion...</> : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
