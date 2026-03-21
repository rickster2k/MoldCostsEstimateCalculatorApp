'use client'

import { useState } from 'react'
import { GlobalStats, Shop } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import AdminPasswordReset from './adminPasswordResetClient'
import { updateDiyShop } from '@/app/actions/firebaseActions/globalStats/updateDiyShop'
import { updateRemoteConsultShop } from '@/app/actions/firebaseActions/globalStats/updateRemoteConsultShot'
import { Settings, FileText, ShieldCheck, ExternalLink, Save } from 'lucide-react'

interface AdminSettingsTabProps {
  globalStats: GlobalStats
}

interface ShopConfigProps {
  title: string
  icon: React.ReactNode
  shop: Shop
  setShop: (shop: Shop) => void
  onSave: () => Promise<void>
  isSaving: boolean
  accentColor: 'orange' | 'blue'
}

function ShopConfig({ title, icon, shop, setShop, onSave, isSaving, accentColor }: ShopConfigProps) {
  const buttonBg     = accentColor === 'orange' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/10' : 'bg-[#000080] hover:bg-[#000066] shadow-blue-500/10'
  const iconBg       = accentColor === 'orange' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-8 md:p-10 space-y-8">

        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
            {icon}
          </div>
          <h3 className="text-xl font-black text-slate-900">{title}</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Checkout URL
            </label>
            <div className="relative">
              <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="url"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-50 focus:border-primary outline-none transition-all font-bold text-slate-700"
                value={shop.paymentUrl}
                onChange={e => setShop({ ...shop, paymentUrl: e.target.value })}
                placeholder="https://buy.stripe.com/..."
              />
            </div>
            
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Service Price ($)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-50 focus:border-primary outline-none transition-all font-bold text-slate-700"
                value={shop.pricePoint}
                onChange={e => setShop({ ...shop, pricePoint: parseFloat(e.target.value) || 0 })}
                placeholder="49.00"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1 ml-1">
              The price displayed on all purchase buttons (e.g., 49.00 for $49)
            </p>
          </div>

          <button
            onClick={onSave}
            disabled={isSaving}
            className={`w-full ${buttonBg} text-white font-black py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

    

      </div>
    </div>
  )
}

export default function AdminSettingsTab({ globalStats }: AdminSettingsTabProps) {
  const [diyShop,          setDiyShop]          = useState<Shop>(globalStats.diyShop)
  const [remoteConsultShop, setRemoteConsultShop] = useState<Shop>(globalStats.remoteConsultShop)
  const [isSavingDiy,      setIsSavingDiy]      = useState(false)
  const [isSavingConsult,  setIsSavingConsult]  = useState(false)
  const router = useRouter()

  async function handleUpdateShopClick(
    updateAction: (paymentUrl: string, pricePoint: number) => Promise<{ success: boolean }>,
    shop: Shop,
    setIsSaving: (v: boolean) => void
  ) {
    setIsSaving(true)
    try {
      const res = await updateAction(shop.paymentUrl, shop.pricePoint)
      if (res.success) {
        toast.success('Shop updated successfully.')
        router.refresh()
      } else {
        toast.error('Failed to update shop values.')
      }
    } catch (err) {
      console.error('Shop update error:', err)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900">Shop Settings</h2>
          <p className="text-slate-500 font-medium">Configure your service payment links and pricing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ShopConfig
          title="DIY Remediation Blueprint"
          icon={<FileText className="w-5 h-5" />}
          shop={diyShop}
          setShop={setDiyShop}
          onSave={() => handleUpdateShopClick(updateDiyShop, diyShop, setIsSavingDiy)}
          isSaving={isSavingDiy}
          accentColor="orange"
        />

        <ShopConfig
          title="Remote Consultation"
          icon={<ShieldCheck className="w-5 h-5" />}
          shop={remoteConsultShop}
          setShop={setRemoteConsultShop}
          onSave={() => handleUpdateShopClick(updateRemoteConsultShop, remoteConsultShop, setIsSavingConsult)}
          isSaving={isSavingConsult}
          accentColor="blue"
        />
      </div>

      <AdminPasswordReset />

    </div>
  )
}