'use client'

import { CheckCircle2, ArrowRight, Send, ClipboardCheck, Contact } from 'lucide-react'
import { ContactInfo, Estimate } from '@/lib/types'
import { fmt } from '@/lib/utils'
import ReportHeaderSection from './formatting/reportHeaderSection'
import EstimateBreakdownSection from './formatting/esimateBreakdownSection'
import AdvertisementSection from './formatting/advertisementSection'
import Link from 'next/link'
import AdvertisementDetailSection from './formatting/advertisementDetailSection'
import { useState } from 'react'
import SummaryOfSelectionsSection from './formatting/summaryOfSelection'
import ContactInfoSection from './formatting/contactInfoSection'
import { toast } from 'sonner'
import { updateContactInfo } from '@/app/actions/firebaseActions/estimateActions/updateUserContactInfo'
import { COUNTRIES } from '@/lib/constants'
import { updateServiceRequests } from '@/app/actions/firebaseActions/estimateActions/updateServiceRequests'
import { ACCESSIBILITY_LABELS, AD_ROWS, AREA_SIZE_LABELS, CAUSE_LABELS, FOGGING_LABELS, HEALTH_SYMPTOMS_LABELS, HIRING_TIMELINE_LABELS, PROPERTY_SIZE_LABELS, PROPERTY_TYPE_LABELS, SEVERITY_LABELS, START_TIME_LABELS, YES_NO_LABELS } from './constants/userReportConstants'

export default function UserReport({ estimate }: { estimate: Estimate }) {
    const { estimateResults, estimateId, data, contact } = estimate
    const { lowEstimate, highEstimate, averageEstimate, breakdown } = estimateResults
    console.log("contact info: ", contact)
    /*State controller for User */
    const [requestRealEstimates, setRequestRealEstimates] = useState<boolean>(estimate.requestRealEstimates)// User opted in to being matched with local contractors
    const [requestDiyBlueprint, setRequestDiyBlueprint] = useState<boolean>(estimate.requestDiyBlueprint)// User requested the DIY Remediation Blueprint
    const [requestConsultant, setRequestConsultant] = useState<boolean>(estimate.requestConsultant)// User requested a 1-on-1 expert consultation 


    /* Request Service State */
    const [isUpdatingServices, setIsUpdatingServices] = useState(false)

    /* Contact State */
    const [contactInfo, setContactInfo] = useState<ContactInfo>(contact)// Contact state 
    const [isUpdatingContact, setIsUpdatingContact] = useState(false)

    async function handleUpdateContact() {
        setIsUpdatingContact(true)
        try {
            const result = await updateContactInfo(estimate.id, contactInfo)
            if (result.success) {
                toast.success('Contact information updated.')
            } else {
                toast.error('Failed to update. Please try again.')
            }
        } catch (err) {
            console.error('Contact update error:', err)
            toast.error('An error occurred. Please try again.')
        } finally {
            setIsUpdatingContact(false)
        }
    }

    async function handleUpdateServiceRequests() {
        setIsUpdatingServices(true)
        try {
            const result = await updateServiceRequests(
                estimate.id,
                requestRealEstimates,
                requestDiyBlueprint,
                requestConsultant
            )
            if (result.success) {
                toast.success('Service requests updated.')
            } else {
                toast.error('Failed to update. Please try again.')
            }
        } catch (err) {
            console.error('Service request update error:', err)
            toast.error('An error occurred. Please try again.')
        } finally {
            setIsUpdatingServices(false)
        }
    }
    
    const BREAKDOWN_ROWS = [
        { label: 'Base Remediation cost', val: breakdown.baseCost            },
        { label: 'Severity Adjustment',   val: breakdown.severityAdjustment  },
        { label: 'Access Complexity',     val: breakdown.complexityAdjustment },
        { label: 'Additional Services',   val: breakdown.additionalServices   },
        ...(breakdown.foggingCost ? [{ label: 'Whole-home fogging', val: breakdown.foggingCost }] : []),
    ]

    const AD_DETAIL_ROWS = [
        {id:'ad1', hrefEndpoint: '', buttonName:'',setter: setRequestRealEstimates, title: 'Ready to receive Real Estimates From Local Remediators?', description:'Receive mold remediation estimates from up to three qualified remediation companies in your area. Estimates will be based on the answers you provided for the Remediation Calculator, emailed to you directly from vetted remediators. Allow up to 5 business days for estimates to be received. Remediators may contact you for more info.', ctaLabel:'Yes, please send me up to three cost estimates from qualified remediators in my area using the Remediation Calculator info I\'ve submitted.', bg: 'bg-green-600', border: 'border-green-200', text: 'text-green-800', hover: 'hover:bg-green-100'},
        {id:'ad2', hrefEndpoint: '/diy', buttonName:'Click Here to Learn More About DIY Remediation',setter: setRequestDiyBlueprint,title: 'Get a Do-It-Yourself Remediation Blueprint', description: 'If mold remediation costs are above your means, let one of our professional remediation consultants create a personalized, step-by-step, home mold removal guide to safely decontaminate your home yourself for a fraction of the cost of hiring a remediation company.', ctaLabel:'Yes, send me more info on your Do-It-Yourself Remediation Blueprint.', bg: 'bg-orange-600', border: 'border-orange-200', text: 'text-orange-800', hover: 'hover:bg-orange-100'},
        {id:'ad3', hrefEndpoint: '/remote', buttonName:'Click Here to Learn More About Remote Remediation Consultant',setter: setRequestConsultant,title: 'Get a Remote Remediation Consultant to Guide You Through the Process', description: 'Have questions or concerns regarding an expensive mold remediation service quote or scope-of-service outline you received from a remediation company? Want practical advice on a cost & time-effective plan of action and Scope of Work before hiring a remediation company? Get a second, unbiased opinion, action plan, and recommendations for your specific issue from a certified indoor environmental consultant before agreeing to unnecessary services and upsells.', ctaLabel:'Yes, send me more info on your Remote Remediation Consulting Service.' , bg: 'bg-blue-600', border: 'border-blue-200', text: 'text-blue-800', hover: 'hover:bg-blue-100'}
    ]

   
  return (
    <div className="space-y-10 max-w-2xl mx-auto flex flex-col  min-w-12xl">
    
    <ReportHeaderSection>
        <div className='flex flex-col gap-2 justify-center items-center text-center'>
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-theme1" />
            </div>
            <p className='font-bold sm:text-2xl md:text-3xl ' >Here&lsquo;s Your Mold Remediation Estimate</p>
            <p className='font-light text-slate-400'>Based on regional pricing for {contact.zipCode} </p>
        </div>
    </ReportHeaderSection>
   
    <EstimateBreakdownSection>
        <div className="bg-linear-to-br from-theme1 to-[#1E3A5F] rounded-3xl p-8 text-white text-center space-y-2 shadow-2xl shadow-primary/30">
            <p className="text-sm font-bold uppercase tracking-widest opacity-70">
                Estimated Remediation Cost
            </p>
            <div className="text-5xl font-black tracking-tight">
                ${fmt(lowEstimate)} – ${fmt(highEstimate)}
            </div>
            <p className="text-sm opacity-70 font-medium">
                Average estimate: ${fmt(averageEstimate)}
            </p>
            <div className="pt-2 text-xs bg-white/10 rounded-xl px-4 py-2 inline-block font-mono tracking-widest">
                Estimate ID: {estimateId}
            </div>

            {/* Cost breakdown */}
            <div className="rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-50 text-lg">Cost Breakdown</h3>
            <div className='flex flex-col gap-2'>
                {BREAKDOWN_ROWS.map(row => (
                <div key={row.label} className="flex justify-between items-center">
                <span className=" text-sm font-medium">{row.label}</span>
                <span className="font-bold text-slate-80">${fmt(row.val)}</span>
                </div>
            ))}

            </div>
            
            <div className="flex justify-between items-center pt-3 border-t-2 border-slate-200">
                <span className="font-bold ">Average Estimate Total</span>
                <span className="font-black text-primary text-lg">${fmt(averageEstimate)}</span>
            </div>
            </div>
        </div>
    </EstimateBreakdownSection>
    
    <AdvertisementSection>
        <div className='flex flex-col gap-2'>
            {AD_ROWS.map(row => (
                <Link 
                    className={`rounded-2xl border p-4 font-semibold transition-colors ${row.bg} ${row.border} ${row.text} ${row.hover}`}
                    href={`/user/report#${row.targetId}`}
                    key={row.targetId}
                >
                    <div className="flex items-center justify-between gap-2">
                        <div>{row.label}</div>
                        <ArrowRight className='w-6 h-6 shrink-0' />
                    </div>
                </Link>
               
            ))}
        </div>
    </AdvertisementSection>
    
    <SummaryOfSelectionsSection>
        <div className='bg-slate-200 p-4 rounded-4xl flex flex-col gap-4'>
            <div className="flex items-center gap-2">
            <ClipboardCheck className='text-theme1 w-6 h-6 shrink-0' />
            <h3 className='font-bold'>Summary of Your Selections</h3>
            </div>
            <hr className="border-slate-300" />
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {[
                { label: 'Property Type',      value: PROPERTY_TYPE_LABELS[data.propertyType]           ?? data.propertyType      },
                { label: 'Property Size',      value: PROPERTY_SIZE_LABELS[data.propertySize]           ?? data.propertySize      },
                { label: 'Zip Code',           value: data.zipCode                                                                },
                { label: 'Affected Area Size', value: AREA_SIZE_LABELS[data.areaSizeCategory]           ?? data.areaSizeCategory  },
                { label: 'Growth Severity',    value: SEVERITY_LABELS[data.severity]                    ?? data.severity          },
                { label: 'Cause',              value: CAUSE_LABELS[data.cause]                          ?? data.cause             },
                { label: 'Moisture Fixed',     value: YES_NO_LABELS[data.moistureFixed]                 ?? data.moistureFixed     },
                { label: 'Start Time',         value: START_TIME_LABELS[data.startTime]                 ?? data.startTime         },
                { label: 'Accessibility',      value: ACCESSIBILITY_LABELS[data.accessibility]          ?? data.accessibility     },
                { label: 'HVAC Affected',      value: YES_NO_LABELS[data.hvacAffected]                  ?? data.hvacAffected      },
                { label: 'Furniture Affected', value: YES_NO_LABELS[data.furnitureAffected]             ?? data.furnitureAffected },
                { label: 'Health Symptoms',    value: HEALTH_SYMPTOMS_LABELS[data.healthSymptoms]       ?? data.healthSymptoms    },
                { label: 'Needs Testing',      value: YES_NO_LABELS[data.needsTesting]                  ?? data.needsTesting      },
                { label: 'Fogging Interest',   value: FOGGING_LABELS[data.foggingInterest]              ?? data.foggingInterest   },
                { label: 'Insurance Claim',    value: YES_NO_LABELS[data.planInsuranceClaim]            ?? data.planInsuranceClaim},
                { label: 'Has Insurance',      value: YES_NO_LABELS[data.hasInsurance]                  ?? data.hasInsurance      },
                { label: 'Hiring Timeline',    value: HIRING_TIMELINE_LABELS[data.hiringTimeline]       ?? data.hiringTimeline    },
            ].map(row => (
                <div key={row.label} className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{row.label}</span>
                <span className="text-sm font-semibold text-slate-800 capitalize">{row.value}</span>
                </div>
            ))}

            {/* Affected Locations spans full width since it's multi-value */}
            <div className="col-span-2 flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Affected Locations</span>
                <span className="text-sm font-semibold text-slate-800 capitalize">
                {data.affectedLocations.map(l => l.replace(/-/g, ' ')).join(', ')}
                </span>
            </div>

            {/* Previous estimates — only show rows with data */}
            {data.previousEstimates.some(e => e.companyName || e.priceEstimate) && (
                <div className="col-span-2 flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Previous Estimates</span>
                {data.previousEstimates
                    .filter(e => e.companyName || e.priceEstimate)
                    .map((e, i) => (
                    <div key={i} className="text-sm font-semibold text-slate-800">
                        {e.companyName && <span>{e.companyName}</span>}
                        {e.cityName && <span className="text-slate-500"> · {e.cityName}</span>}
                        {e.priceEstimate && <span className="text-slate-500"> · {e.priceEstimate}</span>}
                    </div>
                    ))
                }
                </div>
            )}
            </div>
        </div>
    </SummaryOfSelectionsSection>

    <ContactInfoSection>
        <div className='bg-slate-200 p-4 rounded-4xl flex flex-col gap-4'>    
            <div className="flex items-center gap-2">
            <Contact className='text-theme1 w-6 h-6 shrink-0' />
            <h3 className='font-bold'>Contact Information</h3>
            </div>
            <hr className="border-slate-300" />  

            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">First Name</span>
                    <input
                    type="text"
                    value={contactInfo.firstName}
                    onChange={e => setContactInfo({ ...contactInfo, firstName: e.target.value })}
                    className="px-3 py-2 rounded-xl border-2 border-slate-300 focus:border-theme1 outline-none text-sm font-semibold text-slate-800 bg-white"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Last Name</span>
                    <input
                    type="text"
                    value={contactInfo.lastName}
                    onChange={e => setContactInfo({ ...contactInfo, lastName: e.target.value })}
                    className="px-3 py-2 rounded-xl border-2 border-slate-300 focus:border-theme1 outline-none text-sm font-semibold text-slate-800 bg-white"
                    />
                </div>

                <div className="col-span-2 flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email</span>
                    <input
                    type="email"
                    value={contactInfo.email}
                    onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="px-3 py-2 rounded-xl border-2 border-slate-300 focus:border-theme1 outline-none text-sm font-semibold text-slate-800 bg-white"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Phone</span>
                    <input
                    type="tel"
                    value={contactInfo.phone ?? ''}
                    onChange={e => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="px-3 py-2 rounded-xl border-2 border-slate-300 focus:border-theme1 outline-none text-sm font-semibold text-slate-800 bg-white"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Preferred Contact</span>
                    <select
                    value={contactInfo.preferredContact ?? ''}
                    onChange={e => setContactInfo({ ...contactInfo, preferredContact: e.target.value as ContactInfo['preferredContact'] })}
                    className="px-3 py-2 rounded-xl border-2 border-slate-300 focus:border-theme1 outline-none text-sm font-semibold text-slate-800 bg-white"
                    >
                    <option value="">Select…</option>
                    <option value="email">Email</option>
                    <option value="call">Phone call</option>
                    <option value="text">Text message</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Zip Code</span>
                    <input
                    type="text"
                    value={contactInfo.zipCode}
                    onChange={e => setContactInfo({ ...contactInfo, zipCode: e.target.value })}
                    className="px-3 py-2 rounded-xl border-2 border-slate-300 focus:border-theme1 outline-none text-sm font-semibold text-slate-800 bg-white"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Country</span>
                    <select
                        required
                        value={contactInfo.country}
                        onChange={e => setContactInfo({ ...contactInfo, country: e.target.value })}
                        className="px-3 py-2 rounded-xl border-2 border-slate-300 focus:border-theme1 outline-none text-sm font-semibold text-slate-800 bg-white"
                    >
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <hr className="border-slate-300" />

            <button
                onClick={handleUpdateContact}
                disabled={isUpdatingContact}
                className="w-full py-3 rounded-2xl bg-theme1 hover:bg-theme1Shade text-white font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                {isUpdatingContact ? 'Saving…' : 'Save Contact Info'}
            </button>
        </div>
    </ContactInfoSection>      
    
    <AdvertisementDetailSection>
        <div className='bg-slate-200 p-4 rounded-4xl flex flex-col gap-4'>
            <div className="flex items-center gap-2">
                <Send className='text-theme1 w-6 h-6 shrink-0' />
                <h3 className='font-bold'> Send More Details About the Below Services</h3>
            </div>
            
            <p className='text-slate-400 font-light text-sm'>Place a check mark in each of the below service boxes that interest you. Be aware that once you submit request for more services, there is chance you may </p>
            <hr className="border-slate-300" />
            {AD_DETAIL_ROWS.map((row) => {
            const isActive =
                row.id === 'ad1' ? requestRealEstimates :
                row.id === 'ad2' ? requestDiyBlueprint :
                requestConsultant

            return (
                <div id={row.id} key={row.id} className={`flex flex-col rounded-2xl border p-4 transition-colors ${row.bg} ${row.border}`}>
                <h3 className='font-bold text-white pb-4'>{row.title}</h3>
                <p className='font-light text-slate-100 pb-4 sm:text-sm'>{row.description}</p>
                
                <button
                    onClick={() => row.setter(!isActive)}
                    className='flex items-center gap-3 w-fit cursor-pointer group'
                >
                    {isActive
                    ? <CheckCircle2 className='w-6 h-6 text-white shrink-0' />
                    : <div className='w-6 h-6 rounded-full border-2 border-white/60 shrink-0 group-hover:border-white transition-colors' />
                    }
                    <span className='font-semibold text-white text-sm text-left'>{row.ctaLabel}</span>
                </button>
                
                {(isActive && row.buttonName) && 
                    <>
                        <hr className="border-slate-300 mt-4" />
                        <div className='flex flex-col mt-4 bg-white rounded-2xl p-4 items-center gap-2'>
                            
                            <Link className='bg-theme1 hover:bg-theme1Shade font-semibold text-white p-2 px-8 rounded-2xl' href={`/user/report${row.hrefEndpoint}`}> {row.buttonName}</Link>
                            <p className='text-slate-500 text-sm text-center '> You have indicated interest in the above service, make sure to click the button
                                <span className='font-bold'> Update Interest of Selected Services</span> to save your selections. 
                            </p>
                        </div>
                    </>
                }
                </div>
            )
            })}

            <hr className="border-slate-300" />

            <button
                onClick={handleUpdateServiceRequests}
                disabled={isUpdatingServices}
                className="w-full py-3 rounded-2xl bg-theme1 hover:bg-theme1Shade text-white font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isUpdatingServices ? 'Sending…' : 'Update Interest of Selected Services'} 
            </button>

            <p className='text-gray-500 text-sm text-center'>
                By submitting your contact information, you agree to our{' '}
                <Link href={'/tos'} className='underline'>Terms of Service</Link>
                {' '}and{' '}
                <Link href={'/privacy'} className='underline'>Privacy Policy</Link>,
                and consent to being contacted by a professional using the information provided.
                To opt out of communications at any time, please contact us at{' '}
                <a href='mailto:support@iaq.network' className='underline'>support@iaq.network</a>.
            </p>

        </div>
    </AdvertisementDetailSection>

    </div>
  )
}