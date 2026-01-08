import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy - Financial Operating System (FOS)',
  description: 'Privacy Policy for the Financial Operating System (FOS) at DirectorForGood.org',
}

export const dynamic = 'force-dynamic'

export default function FOSPrivacyPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container px-4 py-16 max-w-4xl mx-auto">
        <Link href="/" className="inline-block mb-8">
          <span className="text-2xl font-bold text-white">Director</span>
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy for Financial Operating System (FOS)</h1>
        
        <p className="text-gray-400 mb-8">
          <strong>Last Updated:</strong> January 6, 2026
        </p>

        <div className="prose prose-invert prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              The Financial Operating System (&quot;FOS&quot;) is an internal financial management tool used by DirectorForGood.org. 
              We are committed to the security and privacy of your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Data Collection</h2>
            <p className="text-gray-300 leading-relaxed">
              FOS connects to QuickBooks Online via official APIs to retrieve financial transaction data, 
              including dates, amounts, payees, and account names.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Usage</h2>
            <p className="text-gray-300 leading-relaxed">
              This data is used strictly for internal bookkeeping, tax preparation, and financial reporting 
              for DirectorForGood.org and its related entities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Protection</h2>
            <p className="text-gray-300 leading-relaxed">
              We do not sell, trade, or share your financial information with third parties. 
              All data is stored in secure, private infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Contact</h2>
            <p className="text-gray-300 leading-relaxed">
              For questions regarding this policy, please contact us via <Link href="https://directorforgood.org" className="text-white hover:underline">directorforgood.org</Link>.
            </p>
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
