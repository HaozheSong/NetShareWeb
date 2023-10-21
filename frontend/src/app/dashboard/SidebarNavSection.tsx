'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SidebarSection } from './Sidebar'

interface NavSectionProps {
  section: SidebarSection
}

export default function NavSection (props: NavSectionProps) {
  const section = props.section
  const baseLinkClassName =
    'block my-2 px-8 leading-10 rounded-lg hover:bg-slate-100/50 '
  const activeLinkClassName = baseLinkClassName + 'bg-slate-100/20'
  const pathname = usePathname()
  return (
    <section className='my-2'>
      <h2 className='my-2'>{section.title}</h2>
      <div id='sidebar-section-links'>
        {section.links.map(link => {
          const isActive = pathname === link.href
          return (
            <Link
              href={link.href}
              className={isActive ? activeLinkClassName : baseLinkClassName}
              key={link.text}
            >
              {link.icon ? link.icon : ''}
              {link.text}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
