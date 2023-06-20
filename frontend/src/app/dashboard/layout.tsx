import Sidebar, { SIDEBAR } from './Sidebar'

export default function DashboardLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Sidebar />
      <main
        className='h-screen bg-slate-50 text-slate-950'
        style={{ marginLeft: `${SIDEBAR.width}px` }}
      >
        {children}
      </main>
    </>
  )
}
