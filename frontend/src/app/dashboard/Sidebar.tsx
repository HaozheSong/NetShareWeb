import Link from 'next/link'

interface Sidebar {
  width: number
  title: string
  sections: SidebarSection
}

interface SidebarSection {
  title: string
  links: Array<{ text: string; href: string }>
}

export const CONFIG = {
  width: 300,
  title: 'NetShare',
  sections: [
    {
      title: 'GENERAL',
      links: [
        { text: 'Dashboard', href: '#dashboard' },
        { text: 'Account', href: '#account' }
      ]
    },
    {
      title: 'DATASETS',
      links: [
        { text: 'Running Datasets', href: '#running-datasets' },
        { text: 'All Datasets', href: '#all-datasets' }
      ]
    },
    {
      title: 'MODELS',
      links: [{ text: 'Custom Models', href: '#custom-models' }]
    },
    {
      title: 'ACTIONS',
      links: [
        { text: 'Raw Dataset Upload', href: '#raw-dataset-upload' },
        { text: 'Data Generation', href: '#data-generation' },
        { text: 'Customize Model Upload', href: '#customize-model-upload' }
      ]
    }
  ]
}

export default function Sidebar () {
  return (
    <div
      className={`w-[${CONFIG.width}px] h-screen fixed bg-slate-800 text-slate-50 p-4`}
      id='sidebar'
    >
      <h1 className='text-center text-2xl mb-8' id='sidebar-title'>
        NetShare
      </h1>
      <div id='sidebar-sections'>
        {CONFIG.sections.map(section => (
          <NavSection section={section} />
        ))}
      </div>
    </div>
  )
}

interface NavSectionProps {
  section: SidebarSection
}

function NavSection (props: NavSectionProps) {
  const section = props.section
  return (
    <section className='my-4'>
      <h2 className='my-4'>{section.title}</h2>
      <div id='sidebar-section-links'>
        {section.links.map(link => (
          <Link
            href={link.href}
            className='block my-4 px-8 leading-10 rounded-lg  hover:bg-slate-100/30'
          >
            {link.text}
          </Link>
        ))}
      </div>
    </section>
  )
}
