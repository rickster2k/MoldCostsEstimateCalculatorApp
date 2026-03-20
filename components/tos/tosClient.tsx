'use client'

const SECTIONS = [
  {
    title: '1. Use of Our Website & Applications',
    intro: 'You agree to use this Site only for lawful purposes and in a way that does not infringe on the rights of others or restrict anyone else\'s use of the Site.',
    prohibitions: {
      label: 'You may not:',
      list: [
        'Attempt to access secured portions of the Site without authorization',
        'Upload malicious software',
        'Interfere with the function or security of the Site',
        'Use the Site to engage in fraudulent or misleading behavior',
      ],
    },
  },
  {
    title: '2. Intellectual Property',
    content: 'All content on this Site—including text, graphics, logos, images, designs, videos, and downloadable materials—is the property of IAQ Network or its licensors and is protected by copyright and trademark laws. You may not reproduce, distribute, modify, or sell any content without our written permission.',
  },
  {
    title: '3. Website Content & Accuracy',
    content: 'We strive to ensure the information on this Site is accurate and up to date. However, we do not guarantee the completeness, accuracy, or reliability of any content. The information on this Site is provided for general informational purposes only and should not be considered professional, legal, health, or environmental advice.',
  },
  {
    title: '4. Third-Party Links',
    content: 'Our Site may contain links to external websites. We are not responsible for the content, accuracy, or privacy practices of third-party websites.',
  },
  {
    title: '5. Limitation of Liability',
    intro: 'To the fullest extent allowed by law:',
    list: [
      'IAQ Network is not liable for any damages arising out of your use of the Site.',
      'This includes indirect, incidental, consequential, or punitive damages.',
    ],
    content: 'Your use of the Site is at your own risk.',
  },
  {
    title: '6. Disclaimer of Warranties',
    intro: 'The Site is provided "as is" and "as available," without any warranties of any kind, express or implied. We do not guarantee:',
    list: [
      'Uninterrupted access',
      'Error-free operation',
      'Virus-free files or transmissions',
    ],
  },
  {
    title: '7. Indemnification',
    intro: 'You agree to indemnify and hold IAQ Network harmless from any claims, damages, or losses arising from:',
    list: [
      'Your use of the Site',
      'Your violation of these Terms',
      'Your violation of the rights of a third party',
    ],
  },
  {
    title: '8. Changes to These Terms',
    content: 'We may update these Terms at any time. The updated version will be posted on this page with a new "Last Updated" date. Continued use of the Site after changes means you accept the new Terms.',
  },
  {
    title: '9. Governing Law',
    content: 'These Terms are governed by the laws of the Commonwealth of Pennsylvania, without regard to conflict-of-law principles. Any disputes will be resolved in the appropriate courts located in Pennsylvania.',
  },
  {
    title: '10. How We Use Your Information',
    intro: 'We DO NOT supply, sell, or otherwise make available your submitted IAQ Audit questionnaire information or contact information to third parties for any reason.',
    secondaryIntro: 'We may use your information to:',
    list: [
      'Respond to inquiries',
      'Provide requested Mold Remediation Estimates and other requested service information',
      'Improve site functionality',
      'Communicate with you directly from our company via email regarding our latest services, special offers, and to distribute our periodic industry newsletters, until you request to opt out',
    ],
  },
  {
    title: '11. Contact Information',
    contact: {
      label: 'For questions, comments, or requests regarding these Terms, contact us at:',
      name: 'IAQ Network',
      email: 'support@iaq.network',
      address: 'IAQ Network LLC, 205 Applegate Road, Suite 100, Stroudsburg, PA 18360',
    },
  },
]

export default function TermsOfUseClient() {
  return (
    <div className="w-full max-w-4xl mx-auto fade-in p-8 bg-white rounded-3xl shadow-lg border border-slate-100 my-8 text-slate-700">
      <div className="prose prose-slate max-w-none space-y-8 p-4">

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900">Terms of Service</h1>
          <p className="text-slate-500">Last Updated: 3/01/2026</p>
          <p className="text-slate-600 leading-relaxed">
            Welcome to IAQ Network and MoldCosts.com (&quot;we,&quot; &quot;us,&quot; &quot;our,&quot; or the &quot;Company&quot;).
            By accessing or using our website (the &quot;MoldCosts.com&quot; site and its applications therein),
            you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these
            Terms, please do not use the Site.
          </p>
        </div>

        {SECTIONS.map((section) => (
          <div key={section.title} className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>

            {'intro' in section && section.intro && (
              <p className="text-slate-600 leading-relaxed">{section.intro}</p>
            )}

            {'prohibitions' in section && section.prohibitions && (
              <div className="space-y-2">
                <p className="text-slate-600 font-medium">{section.prohibitions.label}</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {section.prohibitions.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {'secondaryIntro' in section && section.secondaryIntro && (
              <p className="text-slate-600 leading-relaxed">{section.secondaryIntro}</p>
            )}

            {'list' in section && section.list && (
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            {'content' in section && section.content && (
              <p className="text-slate-600 leading-relaxed">{section.content}</p>
            )}

            {'contact' in section && section.contact && (
              <div className="space-y-1 text-slate-600">
                <p>{section.contact.label}</p>
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