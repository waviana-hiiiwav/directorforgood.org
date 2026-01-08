import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service - Director',
  description: 'Director Terms of Service - Read our terms and conditions for using our website and services.',
}

export default function TermsPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container px-4 py-16 max-w-4xl mx-auto">
        <Link href="/" className="inline-block mb-8">
          <span className="text-2xl font-bold text-white">Director</span>
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
        
        <p className="text-gray-400 mb-8">
          <strong>Last Updated:</strong> January 6, 2026
        </p>

        <div className="prose prose-invert prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing or using the Director website (&quot;Site&quot;) located at directorforgood.org, you agree 
              to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of 
              these terms, then you may not access the Site. These Terms apply to all visitors, users, 
              and others who access or use the Site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Permission is granted to temporarily access the materials on Director&apos;s website for 
              personal, non-commercial transitory viewing only. This is the grant of a license, not a 
              transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the Site</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              This license shall automatically terminate if you violate any of these restrictions and may 
              be terminated by Director at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Service Agreements</h2>
            <p className="text-gray-300 leading-relaxed">
              When you engage with Director&apos;s services, you agree to provide accurate and complete 
              information. Director reserves the right to accept or reject any engagement at its sole 
              discretion. Service agreements are subject to separate terms that will be provided upon engagement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Payments</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              All payments made through the Site are subject to the terms of your service agreement with Director. 
              Payments are final and non-refundable unless otherwise specified in your agreement or required by law.
            </p>
            <p className="text-gray-300 leading-relaxed">
              By making a payment, you represent that you are authorized to use the payment method 
              provided and that the information you provide is accurate and complete.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed">
              The Site and its original content, features, and functionality are owned by Director and 
              are protected by international copyright, trademark, patent, trade secret, and other 
              intellectual property laws. The Director name, logo, and all related names, logos, product 
              and service names, designs, and slogans are trademarks of Director or its affiliates or 
              licensors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. User Content</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              If you submit, post, or display content on or through the Site, you grant Director a 
              worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, 
              translate, and distribute such content in any media. You represent and warrant that:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>You own or have the necessary rights to the content you submit</li>
              <li>The content does not violate any third-party rights</li>
              <li>The content is not defamatory, obscene, or otherwise unlawful</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Prohibited Uses</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You agree not to use the Site:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
              <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
              <li>To impersonate or attempt to impersonate Director, a Director employee, another user, or any other person or entity</li>
              <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
              <li>To engage in any other conduct that restricts or inhibits anyone&apos;s use or enjoyment of the Site</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Disclaimer</h2>
            <p className="text-gray-300 leading-relaxed">
              The materials on Director&apos;s website are provided on an &apos;as is&apos; basis. Director 
              makes no warranties, expressed or implied, and hereby disclaims and negates all other 
              warranties including, without limitation, implied warranties or conditions of merchantability, 
              fitness for a particular purpose, or non-infringement of intellectual property or other 
              violation of rights. Further, Director does not warrant or make any representations concerning 
              the accuracy, likely results, or reliability of the use of the materials on its website or 
              otherwise relating to such materials or on any sites linked to this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Limitations of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              In no event shall Director or its suppliers be liable for any damages (including, without 
              limitation, damages for loss of data or profit, or due to business interruption) arising 
              out of the use or inability to use the materials on Director&apos;s website, even if Director 
              or a Director authorized representative has been notified orally or in writing of the 
              possibility of such damage. Because some jurisdictions do not allow limitations on implied 
              warranties, or limitations of liability for consequential or incidental damages, these 
              limitations may not apply to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Indemnification</h2>
            <p className="text-gray-300 leading-relaxed">
              You agree to defend, indemnify, and hold harmless Director and its officers, directors, 
              employees, and agents from and against any claims, liabilities, damages, losses, and 
              expenses, including without limitation reasonable attorney&apos;s fees, arising out of or 
              in any way connected with your access to or use of the Site, your violation of these 
              Terms, or your violation of any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Links to Other Websites</h2>
            <p className="text-gray-300 leading-relaxed">
              Our Site may contain links to third-party websites or services that are not owned or 
              controlled by Director. Director has no control over, and assumes no responsibility for, 
              the content, privacy policies, or practices of any third-party websites or services. 
              You further acknowledge and agree that Director shall not be responsible or liable, 
              directly or indirectly, for any damage or loss caused or alleged to be caused by or in 
              connection with the use of or reliance on any such content, goods, or services available 
              on or through any such websites or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              We may terminate or suspend your access immediately, without prior notice or liability, 
              for any reason whatsoever, including without limitation if you breach the Terms. Upon 
              termination, your right to use the Site will cease immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Governing Law</h2>
            <p className="text-gray-300 leading-relaxed">
              These Terms shall be interpreted and governed by the laws of the State of California, 
              United States, without regard to its conflict of law provisions. Our failure to enforce 
              any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">14. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any 
              time. If a revision is material, we will try to provide at least 30 days notice prior to 
              any new terms taking effect. What constitutes a material change will be determined at 
              our sole discretion. By continuing to access or use our Site after those revisions become 
              effective, you agree to be bound by the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">15. Contact Information</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="mt-4 text-gray-300">
              <p><strong>Director</strong></p>
              <p className="mt-2">
                Email: <a href="mailto:hello@directorforgood.org" className="text-white hover:underline">hello@directorforgood.org</a>
              </p>
              <p className="mt-2">
                Website: <a href="https://directorforgood.org" className="text-white hover:underline">directorforgood.org</a>
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <Link href="/" className="text-white hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}




