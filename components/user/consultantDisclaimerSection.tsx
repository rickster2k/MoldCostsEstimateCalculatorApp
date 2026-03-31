// components/user/consultantDisclaimerSection.tsx
'use client'

import { ChevronRight } from "lucide-react"
import ExpandableItem from "./userExpandableButton"


export default function ConsultantDisclaimerSection() {
    return (
        <section id="disclaimer-section" className="py-16 px-4 bg-slate-50 border-t border-slate-200 scroll-mt-24">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900">Important Remediation Consultation Disclaimer</h2>
                </div>

                <div className="space-y-6">
                    <ExpandableItem
                        title=""
                        preview="The Mold Remediation Consultation Service is an independent professional review service intended to help homeowners better understand mold inspection reports, laboratory results, remediation estimates, and"
                        color="blue"
                    >
                        <div className="space-y-4">
                            <p>
                                The Mold Remediation Consultation Service is an independent professional review service intended
                                to help homeowners better understand mold inspection reports, laboratory results, remediation
                                estimates, and scope-of-work documents provided by third parties.
                            </p>
                            <p>
                                All analysis, recommendations, and guidance provided through this service are based solely on
                                the information and documentation submitted by the homeowner. This consultation does not include
                                a physical inspection of the property and may not account for hidden conditions or circumstances
                                that cannot be identified within the materials provided.
                            </p>
                            <p>
                                This service is intended for informational and educational purposes only and should not be
                                considered a substitute for on-site inspections, engineering evaluations, contractor assessments,
                                or other professional services that may be required for your specific property.
                            </p>
                            <p>
                                While reasonable professional care is used in preparing the consultation report, no warranties
                                or guarantees — express or implied — are made regarding the accuracy, completeness,
                                effectiveness, or outcomes of any recommendations provided.
                            </p>
                            <p>
                                By purchasing this consultation service, you acknowledge and agree that the provider shall not
                                be held liable for any decisions, actions, damages, losses, or costs arising from the use of
                                the information, analysis, or recommendations contained within the consultation report.
                            </p>
                            <p>
                                All decisions regarding mold remediation work, contractor selection, and implementation of any
                                recommendations remain the sole responsibility of the homeowner.
                            </p>
                            <p>
                                This service does not provide medical advice and should not be used as a substitute for
                                consultation with qualified healthcare professionals regarding health concerns related to indoor
                                environmental conditions.
                            </p>
                        </div>
                    </ExpandableItem>


                    <button
                        onClick={() => document.getElementById('consult-order-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-10 py-6 bg-[#000080] text-white rounded-4xl font-black text-xl shadow-2xl shadow-blue-200 hover:bg-[#000066] transition-all hover:scale-105 active:scale-95 flex items-center gap-4 mx-auto"
                    >
                        Get My Expert Consultation <ChevronRight className="w-6 h-6" />
                    </button>
                  
                </div>
            </div>
        </section>
    )
}