import * as sidebarIcon from './SidebarIcon'
import NavSection from './SidebarNavSection'

interface Sidebar {
  width: number
  title: string
  sections: SidebarSection
}

export interface SidebarSection {
  title: string
  links: Array<{ text: string; href: string; icon?: JSX.Element }>
}

// to make active link work, ensure the href end with a trailing slash
export const SIDEBAR = {
  width: 300,
  title: 'NetShare',
  sections: [
    {
      title: 'GENERAL',
      links: [
        { text: 'Dashboard', href: '/dashboard/', icon: sidebarIcon.dashboard }
      ]
    },
    {
      title: 'ACTIONS',
      links: [
        {
          text: 'Launch a Task',
          href: '/dashboard/launch-task/',
          icon: sidebarIcon.launchTask
        },
        {
          text: 'Task Status',
          href: '/dashboard/task-status/',
          icon: sidebarIcon.taskStatus
        }
      ]
    }
  ]
}

export default function Sidebar () {
  return (
    <nav
      className='h-screen fixed bg-slate-800 text-slate-50 p-4 overflow-auto'
      style={{ width: `${SIDEBAR.width}px` }}
      id='sidebar'
    >
      <h1 className='text-center text-2xl mb-6' id='sidebar-title'>
        NetShare
      </h1>
      <div id='sidebar-sections'>
        {SIDEBAR.sections.map(section => (
          <NavSection section={section} key={section.title} />
        ))}
      </div>
    </nav>
  )
}
