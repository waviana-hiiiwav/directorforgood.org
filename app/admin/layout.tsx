import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/40">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-6">Admin</h2>
          <nav className="space-y-2">
            <Link href="/admin/proposals">
              <Button variant="ghost" className="w-full justify-start">
                Proposals
              </Button>
            </Link>
            <Link href="/admin/directors">
              <Button variant="ghost" className="w-full justify-start">
                AI Directors
              </Button>
            </Link>
            <Link href="/admin/deck">
              <Button variant="ghost" className="w-full justify-start">
                Pitch Deck
              </Button>
            </Link>
            <Link href="/admin/media">
              <Button variant="ghost" className="w-full justify-start">
                Media Gallery
              </Button>
            </Link>
            <Link href="/admin/development">
              <Button variant="ghost" className="w-full justify-start">
                Development
              </Button>
            </Link>
            <Link href="/admin/debrief-calls">
              <Button variant="ghost" className="w-full justify-start">
                Debrief Calls
              </Button>
            </Link>
            <Link href="/admin/tools">
              <Button variant="ghost" className="w-full justify-start">
                Tools Database
              </Button>
            </Link>
            <div className="my-4 border-t" />
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start">
                ← Back to Site
              </Button>
            </Link>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}




