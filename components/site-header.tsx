import Link from 'next/link'
import { auth } from '@/lib/auth'

export async function SiteHeader() {
  const session = await auth()
  const isAdmin = (session?.user as any)?.role === 'admin'

  return (
    <header className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur border-b border-gray-800">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">Director</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#solution" className="text-gray-300 hover:text-white transition-colors">
              About
            </a>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard Demo
            </Link>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </a>
          </nav>
        </div>
        {isAdmin ? (
          <div className="flex items-center gap-4">
            <Link 
              href="/deck" 
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Pitch Deck
            </Link>
            <Link 
              href="/admin/deck" 
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Edit Deck
            </Link>
            <Link 
              href="/admin" 
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Admin
            </Link>
          </div>
        ) : (
          <Link 
            href="/login" 
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  )
}
