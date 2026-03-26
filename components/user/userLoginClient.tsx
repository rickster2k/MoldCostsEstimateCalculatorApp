'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ChevronLeft, UserRound } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import SignInViewSection from './signInViewSection';
import RecoverySection from './recoverySection';
import BackButtonDefault from '../shared/backButton';
import { verifyUserAccess } from '@/app/actions/firebaseActions/verifyUserAccess';
import RecoverySentSection from './recoverySentSection';
import { sendRecoveryEmail } from '@/app/actions/resendActions/sendRecoveryEmail';

type View = 'signin' | 'recovery' | 'recovery-sent';

export default function UserLoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  //meta state
  const [view, setView] = useState<View>('signin');

  // Sign-in state
  const [email, setEmail] = useState('');
  const [accountId, setAccountId] = useState('');

  // Recovery state
  const [recoveryEmail, setRecoveryEmail] = useState('');

  // auto login state
  const [autoLogging, setAutoLogging] = useState(false)
  const hasAutoSubmitted = useRef(false)


  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await sendRecoveryEmail({toEmail: recoveryEmail})
  
    toast.error("If you have an associated email, you should recieve instructions shortly.")
    if(response.error){
      console.log("Error occured: ", response.error)
    }
  }

  // Update performLogin signature and router.push:
  async function performLogin(loginEmail?: string, loginReportId?: string, loginPage?: string) {
      const resolvedEmail = loginEmail ?? email
      const resolvedReportId = loginReportId ?? accountId
      const sanitizedEmail = resolvedEmail.trim()
      const sanitizedReportId = resolvedReportId.trim()

      try {
          const result = await verifyUserAccess(sanitizedEmail, sanitizedReportId)
          if (result.success && result.estimate) {
              sessionStorage.setItem('estimate', JSON.stringify(result.estimate))
              window.dispatchEvent(new Event('estimate-session-change'))
              // Navigate to page param if provided, otherwise default to report
              router.push(loginPage ? `/user/report${loginPage}` : '/user/report')
          } else {
              setAutoLogging(false)
              toast.error(`Unable to Login. Invalid Email and/or Estimate ID`)
          }
      } catch (err) {
          console.error('Login error:', err)
          setAutoLogging(false)
          toast.error('An error occurred. Please try again later.')
      }
  }
// Update useEffect to grab page param and pass it:
useEffect(() => {
    const urlEmail = searchParams.get('email')
    const urlReportId = searchParams.get('estimateId')
    const urlPage = searchParams.get('page') ?? undefined

    if (urlEmail && urlReportId && !hasAutoSubmitted.current) {
        hasAutoSubmitted.current = true
        setEmail(urlEmail)
        setAccountId(urlReportId)
        setAutoLogging(true)
        performLogin(urlEmail, urlReportId, urlPage)
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [searchParams])

  
  // Full screen auto-login loading state
  if (autoLogging) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0d9488] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#1e3a5f] font-semibold text-lg">Loading your report…</p>
          <p className="text-slate-400 text-sm mt-1">Verifying your credentials</p>
        </div>
      </div>
    )
  }
  return (
    <div className=" max-w-md mx-auto fade-in p-6 rounded-3xl shadow-2xl border border-slate-100 relative">
      
      <div className="rounded-3xl w-full max-w-lg  overflow-hidden">

        <SignInViewSection>
          {view === 'signin' && (
            <>
            <BackButtonDefault  onClick={ () => { router.push('/') }}/>
            
            <div className="flex flex-col justify-center items-center text-center p-6 border-b border-slate-100">
              <div className='flex justify-center items-center rounded-2xl bg-theme1 w-10 h-10'>
                <UserRound className=' text-white'/>
              </div>
              
              <h1 className="font-black text-slate-900 text-xl">Sign In to Your Account</h1>
              <p className=" text-sm text-slate-500 mt-1 leading-relaxed">
                Enter the email address and Account # from your estimate confirmation email.
              </p>
            </div>

            <div className="p-6 space-y-6">
              <form onSubmit={ (e) =>  {e.preventDefault(); performLogin();}} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-theme1 outline-none font-semibold text-slate-700 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Estimate ID
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. MG-XXXXXXXX"
                    value={accountId}
                    onChange={e => setAccountId(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-theme1 outline-none font-semibold text-slate-700 font-mono tracking-widest transition-all"
                  />
                </div>

             
                <button
                    type="submit"
                    className="flex justify-center w-full py-4 bg-theme1 hover:bg-theme1Shade text-white font-black rounded-2xl transition-all shadow-lg shadow-teal-600/20"
                >
                  Access My Estimate
                </button>
              </form>

              <div className="text-center">
                <button
                    onClick={ () => {setView('recovery')}}
                    className="text-sm text-theme1 hover:text-teal-500 font-medium  transition-colors"
                >
                  Recover Your Estimate ID #?
                </button>
              </div>
            </div>
          </>
          
        )}
        </SignInViewSection>


        <RecoverySection>
          {view === 'recovery' && (
            <>
              <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { setView('signin'); }}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h1 className="font-black text-slate-900 text-xl">Account Recovery</h1>
              </div>

              <div className="p-6">
                <form onSubmit={handleRecovery} className="space-y-4">
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Enter your email address and we&lsquo;ll send you a link to your estimate(s).
                  </p>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="email@example.com"
                      value={recoveryEmail}
                      onChange={e => setRecoveryEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-theme1 outline-none font-semibold text-slate-700 transition-all"
                    />
                  </div>

               

                  <button
                    type="submit"
                    className="w-full py-4 bg-theme1 hover:theme1Shade text-white font-black rounded-2xl transition-all shadow-lg shadow-teal-600/20"
                  >
                    Send Recovery Email
                  </button>
                </form>
              </div>
            </>
          )}
        </RecoverySection>
          
        

        <RecoverySentSection>
        {view === 'recovery-sent' && (
          <div className="p-10 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="font-bold text-slate-900 text-lg">Recovery Email Sent</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              We&lsquo;ve sent an email to <strong>{recoveryEmail}</strong> with a link to access all
              your estimates.
            </p>
            <button
              type="button"
              onClick={() => setView('signin')}
              className="px-6 py-3 bg-theme1 hover:theme1Shade text-white font-bold rounded-xl transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        )}
        </RecoverySentSection>
        


      </div>

      <p className="mt-8 text-xs text-slate-400">
        Don&lsquo;t have an account?{' '}
        <Link href="/" className="text-theme1 font-bold hover:underline">
          Get a free estimate
        </Link>
      </p>

    </div>
  );
}