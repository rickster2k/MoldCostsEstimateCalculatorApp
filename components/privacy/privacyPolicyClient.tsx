'use client'

const SECTIONS = [
  {
    title: '1. Information We Collect',
    subsections: [
      {
        subtitle: 'Information You Provide Directly',
        content: null,
        list: ['Name', 'Email address', 'Phone number', 'Any message or details you voluntarily submit through our contact form'],
      },
      {
        subtitle: 'Automatically Collected Information',
        content: 'Our website may automatically collect basic technical information (such as IP address, browser type, and usage data) to help us improve site performance. This information does not identify you personally.',
        list: null,
      },
    ],
  },
  {
    title: '2. How We Use Your Information',
    intro: 'We may use the information you provide to:',
    list: [
      'To Create and Deliver your Mold Remediation Estimate',
      'Respond to your inquiries',
      'Provide customer support',
      'Send the requested information about our services',
      'Promotional emails and newsletters from our Company',
      'Improve our website and user experience',
    ],
    content: 'We do not use your submitted contact information for marketing without your consent.',
  },
  {
    title: '3. Information Sharing and Disclosure',
    content: `We do not sell, rent, or share your personal information with any third parties.\n\nAny contact information submitted through our website's contact form remains private and confidential. It is used solely for the purpose of communicating with you regarding your request and promotional offers we deliver directly to your inbox from our company.\n\nWe may disclose information only if required to do so by law or to protect our legal rights.`,
  },
  {
    title: '4. Data Security',
    content: 'We implement reasonable administrative, technical, and physical safeguards to protect the information you submit. However, no internet-based service can guarantee absolute security.',
  },
  {
    title: '5. Third-Party Links',
    content: 'Our website and email promotions may contain links to external websites and offers. We are not responsible for the privacy practices or content of those third-party sites.',
  },
  {
    title: "6. Children's Privacy",
    content: 'Our website is not intended for children under 13, and we do not knowingly collect personal information from children.',
  },
  {
    title: '7. Your Rights and Choices',
    intro: 'You may request that we:',
    list: ['Update your information', 'Delete your information', 'Stop contacting you'],
    content: 'To make a request, contact us using the information provided below, or the opt-out links included in our email messages.',
  },
  {
    title: '8. Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated revision date.',
  },
  {
    title: '9. Contact Us',
    content: null,
    contact: {
      name: 'IAQ Network',
      email: 'support@iaq.network',
      address: 'IAQ Network LLC, 205 Applegate Road, Suite 100, Stroudsburg, PA 18360',
    },
  },
]

export default function PrivacyPolicyClient() {
  return (
    <div className="w-full max-w-4xl mx-auto fade-in p-8 bg-white rounded-3xl shadow-lg border border-slate-100 my-8 text-slate-700">
      <div className="prose prose-slate max-w-none space-y-8 p-4">

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
          <p className="text-slate-500">Last Updated: 3/01/2026</p>
          <p className="text-slate-600 leading-relaxed">
            IAQ Network and MoldCosts.com (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, and safeguard the information you
            provide when you visit our website or submit information through our contact form.
          </p>
        </div>

        {SECTIONS.map((section) => (
          <div key={section.title} className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>

            {'subsections' in section && section.subsections && (
              <div className="space-y-4">
                {section.subsections.map((sub) => (
                  <div key={sub.subtitle} className="space-y-2">
                    <h3 className="text-base font-semibold text-slate-800">{sub.subtitle}</h3>
                    {sub.list && (
                      <ul className="list-disc list-inside space-y-1 text-slate-600">
                        {sub.list.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {sub.content && <p className="text-slate-600 leading-relaxed">{sub.content}</p>}
                  </div>
                ))}
              </div>
            )}

            {'intro' in section && section.intro && (
              <p className="text-slate-600 leading-relaxed">{section.intro}</p>
            )}

            {'list' in section && section.list && (
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            {section.content &&
              section.content.split('\n\n').map((para, i) => (
                <p key={i} className="text-slate-600 leading-relaxed">{para}</p>
              ))}

            {'contact' in section && section.contact && (
              <div className="space-y-1 text-slate-600">
                <p>
                  If you have questions about this Privacy Policy or would like to request changes to your
                  information, you may contact us at:
                </p>
                <div className="bg-slate-100 p-4 rounded-2xl">
                    <p className="font-bold text-slate-800">{section.contact.name}</p>
                    <p className="text-primary  font-bold text-theme1">{section.contact.email} </p>
                    <p>{section.contact.address}</p>
                </div>
                
                
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  )
}