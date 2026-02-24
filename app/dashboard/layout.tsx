import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-black text-white min-h-screen">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  )
}





