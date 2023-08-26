'use client'
import { useRouter } from 'next/navigation'

export default function Home () {
  const router = useRouter()

  return (
    <button
      type='button'
      onClick={() => router.push('/dashboard')}
      className='inline-flex items-center px-3 py-2 rounded bg-sky-500 hover:bg-sky-600 text-sky-50'
    >
      To Dashboard
    </button>
  )
}
