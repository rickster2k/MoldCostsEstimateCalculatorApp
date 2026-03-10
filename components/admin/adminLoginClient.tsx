'use client'

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function AdminLoginClient() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false, // we handle routing
    })

    if (result?.error) {
      toast.error('Invalid credentials or insufficient permissions.')
      setLoading(false)
      return
    }

    // Session now exists, middleware will allow access
    router.replace('/admin/dashboard')
  }

  return (
    <div className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-xl mt-20">
      <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Email Address
        </label>
        <input
          type="email"
          required
          placeholder="Enter email"
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Password
        </label>
        <input
          type="password"
          required
          placeholder="Enter Password"
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-theme1 hover:bg-teal-500 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
