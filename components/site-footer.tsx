import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="bg-black border-t border-gray-800 py-12">
      <div className="container px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-white">Director</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-md">
              Director is the AI-native operating system and forward-deployed backbone for nonprofits. 
              Turning under-resourced founders into fundable, operationally tight organizations.
            </p>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="pt-2">
                <a href="mailto:hello@directorforgood.org" className="hover:text-white">hello@directorforgood.org</a>
              </li>
              <li>
                <a href="https://directorforgood.org" className="hover:text-white">directorforgood.org</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Director. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/eula" className="hover:text-white">EULA</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
