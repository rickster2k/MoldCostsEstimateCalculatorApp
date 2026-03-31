'use client'

import { Capitalize } from '@/lib/utils/formattingUtils'
import {  Mail } from 'lucide-react'
import Link from 'next/link'

interface EstimateSentStepProps {
  firstName: string,
  email: string,
  estimateId: string,
}

export default function EstimateSentStep({ firstName, email, estimateId }: EstimateSentStepProps) {
  return (
    <div className="py-20 flex flex-col items-center text-center space-y-8">

      <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
        <Mail className="w-10 h-10 text-theme1" />
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl font-black text-slate-900">Your Estimate Has Been Sent!</h2>
        <p>Thanks <span className='font-black'>{Capitalize(firstName)}</span>  Your personalized Mold Remediation Estimate has been emailed to your <span className='font-black'>{email}</span> account. </p>
        
        <div className='bg-slate-100 p-8 rounded-4xl flex flex-col gap-4'>
          <h4 className='text-slate-500 font-extralight'> YOUR ACCOUNT # </h4>
          <p className='text-theme1 font-bold text-4xl'> {estimateId}</p>
          <p className='text-slate-400 font-light'> Make sure to remember your account number as you can also directly access your Estimate in your browser by clicking the below link. </p>
        </div>

        <div className='bg-yellow-50 p-8 rounded-4xl flex flex-col gap-4'>
          <p className='text-orange-400 font-bold'> IMPORTANT: Check your Spam folder or Promotions folder if you did not recieve the email. </p>
        </div>

      </div>


      <Link
        href='/user/report'
        className=" bg-theme1 hover:bg-theme1Shade text-white py-4 px-10 rounded-2xl transition-all shadow-lg shadow-teal-400/20 flex items-center gap-3"
      >
        View Your Estimate Online Now   <span className="font-bold tracking-tighter">{'>>'}</span>
      </Link>
      
    </div>
  )
}