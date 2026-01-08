import Link from 'next/link'

// EULA page for DirectorForGood
export const metadata = {
  title: 'End User License Agreement',
  description: 'End User License Agreement for the Financial Operating System (FOS) at DirectorForGood.org',
}

export const dynamic = 'force-dynamic'

export default function EULAPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container px-4 py-16 max-w-4xl mx-auto">
        <Link href="/" className="inline-block mb-8">
          <span className="text-2xl font-bold text-white">Director</span>
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-8">End User License Agreement</h1>
        
        <p className="text-gray-400 mb-8">
          <strong>Last Updated:</strong> January 6, 2026
        </p>

        <div className="prose prose-invert prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. License Grant</h2>
            <p className="text-gray-300 leading-relaxed">
              DirectorForGood.org grants authorized personnel a limited, non-exclusive license to use the 
              Financial Operating System (&quot;FOS&quot;) for internal business operations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Usage Restrictions</h2>
            <p className="text-gray-300 leading-relaxed">
              Users may not redistribute, sell, or reverse-engineer the FOS software. 
              Access is restricted to authorized company administrators.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Disclaimer</h2>
            <p className="text-gray-300 leading-relaxed">
              FOS is provided &quot;AS IS.&quot; DirectorForGood.org makes no warranties regarding the accuracy 
              of third-party data pulled from external APIs. Use of the software is at the user&apos;s own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Governing Law</h2>
            <p className="text-gray-300 leading-relaxed">
              This agreement is governed by the laws of the State of California.
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
