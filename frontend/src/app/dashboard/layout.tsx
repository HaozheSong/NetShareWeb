import Sidebar, { CONFIG } from './Sidebar'

export default function DashboardLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Sidebar />
      <main
        className={`ml-[${CONFIG.width}px] h-screen bg-slate-100 text-slate-950`}
      >
        {children}
      </main>
    </>
  )
}
