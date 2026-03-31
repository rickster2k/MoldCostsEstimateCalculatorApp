'use client'

import { ChevronRight } from "lucide-react"
import ExpandableItem from "./userExpandableButton"




export default function DiyDisclaimerSection() {
    return (
        <section id="disclaimer-section" className="py-16 px-4 bg-slate-50 border-t border-slate-200 scroll-mt-24">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900">About This DIY Blueprint Service and Disclaimer</h2>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Our goal isn&apos;t to replace professional remediation — it&apos;s to help homeowners make smarter, safer decisions when the DIY route is the only practical option.
                    </p>
                </div>

                <div className="space-y-6">
                    <ExpandableItem title="Before You Choose the DIY Option" preview='Whenever possible, we strongly recommend hiring a qualified professional mold remediation company. Professional remediators have the total scope of work, training, containment equipment, and experience'>
                        <p>
                            Whenever possible, we strongly recommend hiring a qualified professional mold remediation company.
                            Professional remediators have the total scope of work, training, containment equipment, and experience
                            required to remove contamination safely while minimizing the risk of cross-contamination or unintended
                            damage to the home. It is also important to understand that only an on-site inspection can fully determine
                            the scope of a mold problem and the remediation required. If professional remediation is an option for you,
                            we encourage you to explore those services first. You can also review additional professional remediation
                            and consultation options available through IAQ.network.
                        </p>
                    </ExpandableItem>

                    <ExpandableItem title="Why This Blueprint Service Exists" preview='We understand the reality that many homeowners face.​ Professional remediation can be expensive, and some homeowners choose to handle smaller mold issues themselves. Unfortunately, many people'>
                        <p>
                            We understand the reality that many homeowners face. Professional remediation can be expensive, and some
                            homeowners choose to handle smaller mold issues themselves. Unfortunately, many people attempt DIY mold
                            removal without proper guidance, which can lead to ineffective cleanup, cross-contamination, or unnecessary
                            expenses. The DIY Mold Remediation Blueprint was created to help homeowners who have already decided to
                            pursue the DIY route understand safer, more structured, and more cost-effective ways to approach the work.
                            This Blueprint provides informational guidance based on the details you provide about your situation.
                        </p>
                    </ExpandableItem>

                    <ExpandableItem title="IMPORTANT DISCLAIMER" preview='This Blueprint is provided for informational and educational purposes only and should not be considered a substitute for professional inspection, testing, or remediation services'>
                        <div className="space-y-3">
                            <p>
                                This Blueprint is provided for informational and educational purposes only and should not be considered
                                a substitute for professional inspection, testing, or remediation services. Because we do not perform
                                an on-site inspection and cannot control the conditions within your property or how the remediation
                                work is performed:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>No warranties or guarantees of results are provided.</li>
                                <li>The recommendations are based solely on the information submitted.</li>
                                <li>Actual conditions within the property may differ from what is described.</li>
                            </ul>
                            <p>
                                By purchasing and using this DIY Blueprint service, the purchaser acknowledges that any remediation
                                work performed using the information provided is done at their own risk, and the authors and providers
                                of the Blueprint are not liable for outcomes resulting from its use.
                            </p>
                        </div>
                    </ExpandableItem>


                    <div className="pt-8">
                        <button
                            onClick={() => document.getElementById('order-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-10 py-6 bg-orange-500 text-white rounded-4xl font-black text-xl shadow-2xl shadow-orange-200 hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 flex items-center gap-4 mx-auto"
                        >
                            Get Your Personalized Blueprint <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}