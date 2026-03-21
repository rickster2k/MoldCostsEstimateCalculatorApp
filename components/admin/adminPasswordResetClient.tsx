'use client'

import { updateAdminPassword } from '@/app/actions/firebaseActions/authActions/updateAdminPassword'
import { useState } from 'react'
import { toast } from 'sonner'

type Step = 'form' | 'confirm'

export default function AdminPasswordReset() {
  const [step, setStep] = useState<Step>('form')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const passwordsMatch = newPassword === confirmPassword
  const passwordLongEnough = newPassword.length >= 8
  const canSubmit = passwordsMatch && passwordLongEnough && newPassword.length > 0

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setStep('confirm') // show confirmation dialog
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    const res = await updateAdminPassword(newPassword)
    setIsLoading(false)

    if (res.success) {
      toast.success('Password updated successfully')
      setNewPassword('')
      setConfirmPassword('')
      setStep('form')
    } else {
      toast.error(res.error || 'Failed to update password')
      setStep('form')
    }
  }

  const handleCancel = () => {
    setStep('form')
  }

  return (
    <>
      {/* ── Card ── */}
      <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-2xl flex flex-col">
        <h2 className="text-2xl font-bold mb-2 text-[#1e3a5f]">Reset Admin Password</h2>
        <p className="text-sm text-slate-500 mb-6">
          Updates the password for the currently logged-in admin account.
        </p>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                className="w-full p-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-sm"
              >
                {showNew ? 'Hide' : 'Show'}
              </button>
            </div>
            {newPassword.length > 0 && !passwordLongEnough && (
              <p className="text-xs text-red-500 mt-1">Must be at least 8 characters.</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                className="w-full p-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0d9488] focus:border-transparent"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-sm"
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
            )}
            {confirmPassword.length > 0 && passwordsMatch && passwordLongEnough && (
              <p className="text-xs text-green-600 mt-1">✓ Passwords match.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="bg-[#1e3a5f] hover:bg-[#2d5485] text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* ── Confirmation Modal ── */}
      {step === 'confirm' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border p-8 max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">Are you sure?</h3>
            <p className="text-sm text-slate-600 mb-6">
              This will immediately update the admin password. You will need to use the new
              password on your next login.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 border border-slate-300 text-slate-700 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Updating…' : 'Yes, Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}