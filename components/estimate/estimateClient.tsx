'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import QuestionCard from './questionCard'
import { QUESTIONS, optionClass } from './questionData'
import { ContactInfo, EstimateData } from '@/lib/types'
import { DEFAULT_ESTIMATE_DATA } from '@/lib/constants'
import ProgressBar from './progressBar'
import IntakeClient from './intakeClient'
import { useRouter } from 'next/navigation'


const TOTAL_STEPS = 22
const DEFAULT_CONTACT: ContactInfo = {
  firstName: '', lastName: '', email: '',
  phone: '', preferredContact: undefined,
  zipCode: '', country: 'United States',
}


export default function EstimatorClient() {
  const router = useRouter()

  // ── Navigation 
  const [currentStep, setCurrentStep] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const progress = Math.min((currentStep / 19) * 100, 100)
  const isQuestionStep = currentStep >= 1 && currentStep <= 19

  const goNext = useCallback((delay = 0) => {
    if (isTransitioning) return
    const advance = () => setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS))
    if (delay > 0) {
      setIsTransitioning(true)
      setTimeout(() => { advance(); setIsTransitioning(false) }, delay)
    } else {
      advance()
    }
  }, [isTransitioning])

  //const goBack = useCallback(() => setCurrentStep(s => Math.max(s - 1, 1)), [])
  const goBack = useCallback(() => {
    if (currentStep === 1) {
      router.push('/')
    } else {
      setCurrentStep(s => Math.max(s - 1, 1))
    }
  }, [currentStep, router])
  // ── Estimate data 
  const [data, setData] = useState<EstimateData>(DEFAULT_ESTIMATE_DATA)
  
  // ── Contact state 
  const [contact, setContact] = useState<ContactInfo>(DEFAULT_CONTACT)

  // ── Render step content 
  function renderStep() {

    // ── Steps 1–19: question cards 
    if (isQuestionStep) {
      const q = QUESTIONS.find(q => q.step === currentStep)!

      const nextDisabled = (() => {
        if (currentStep === 3) return data.zipCode.length !== 5
        if (currentStep === 4) return data.affectedLocations.length === 0
        return false
      })()

      const nextLabel = currentStep === 19 ? 'Get Estimate' : 'Next Step'

      return (
        <QuestionCard
          stepNumber={currentStep}
          title={q.title}
          subtitle={q.subtitle}
          onBack={goBack}
          onNext={q.requiresNext ? () => goNext() : undefined}
          nextDisabled={nextDisabled}
          nextLabel={nextLabel}
        >
          {q.render ? (
            q.render(data, (updated) => {
              setData(updated)
              if (!q.requiresNext) goNext(300)
            })
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {q.options!.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isTransitioning}
                  onClick={() => {
                    setData({ ...data, [q.field]: opt.id })
                    goNext(300)
                  }}
                  className={optionClass(
                    (data as unknown as Record<string, unknown>)[q.field as string] === opt.id
                  )}
                >
                  {opt.desc ? (
                    <div>
                      <div className="font-bold text-slate-900">{opt.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                    </div>
                  ) : (
                    <span className="font-bold text-slate-700">{opt.label}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </QuestionCard>
      )
    }
    if (currentStep === 20) return (
      <IntakeClient contactInfo={contact} setContact={setContact} zipCode={data.zipCode} estimateData={data} goBack={goBack}/>
    )

    // ── Step 22: results / report ──────────────────────────────────────────
    // results is always set before reaching here via handleContactSubmit,
    // but the null guard covers any edge case and keeps TypeScript happy.
    //if (currentStep === 22) {
      /*if (!results) return (
        <div className="py-20 text-center text-slate-400 font-medium animate-pulse">
          Loading your estimate…
        </div>
      )
      return (
        <ResultsStep
          data={data}
          results={results}
          estimateId={estimateIdRef.current}
          contact={contact}
          setContact={setContact}
          isSaved={isSaved}
          isUserSignedIn={isUserSignedIn}
          requestEstimates={requestEstimates}         setRequestEstimates={setRequestEstimates}
          requestDiyBlueprint={requestDiyBlueprint}   setRequestDiyBlueprint={setRequestDiyBlueprint}
          requestConsultant={requestConsultant}       setRequestConsultant={setRequestConsultant}
          onSave={handleSaveSubmission}
          onRestart={handleRestart}
          saveSectionRef={saveSectionRef}
        />
      )*/
    //}

    return null
  }

  // ── Render ─────
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
        <ProgressBar current={currentStep} total={19} />
        {isQuestionStep && (
            <div className="sticky top-0 z-20 bg-white border-b border-slate-100">
                <div className="h-1 bg-slate-100">
                <div
                    className="h-full bg-theme1 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
                </div>
                <div className="max-w-2xl mx-auto px-4 py-2 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">{currentStep} / 19</span>
                <span className="text-xs font-bold text-theme1">{Math.round(progress)}% complete</span>
                </div>
            </div>
        )}

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  )
}