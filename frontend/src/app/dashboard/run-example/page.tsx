'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Example {
  example_id: number
  example_kind: string
  example_name: string
  created_at: string
  is_completed: boolean
  completed_at: string
  updated_at: string
}

export default function runExample () {
  const [allExamples, setAllExamples] = useState([] as Array<Example>)
  useEffect(() => {
    getAllExamples(setAllExamples)
    const interval = setInterval(getAllExamples, 3000, setAllExamples)
    return () => clearInterval(interval)
  }, [])
  return (
    <>
      <AllExamplesTable allExamples={allExamples} />
      <StartExampleBtn setAllExamples={setAllExamples} />
    </>
  )
}

async function getAllExamples (
  setAllExamples: React.Dispatch<React.SetStateAction<Example[]>>
) {
  const response = await fetch('/api/run-example/read/all/')
  const allExamples: Array<Example> = await response.json()
  setAllExamples(allExamples)
}

function AllExamplesTable ({ allExamples }: { allExamples: Array<Example> }) {
  return (
    <table className='table-auto w-full border-collapse border border-slate-400'>
      <thead>
        <tr>
          <th className='border border-slate-300'>ID</th>
          <th className='border border-slate-300'>Kind</th>
          <th className='border border-slate-300'>Name</th>
          <th className='border border-slate-300'>Created at</th>
          <th className='border border-slate-300'>Status</th>
          <th className='border border-slate-300'>Last Updated</th>
          <th className='border border-slate-300'>Log</th>
          <th className='border border-slate-300'>Result</th>
        </tr>
      </thead>
      <tbody>
        {allExamples.map(example => (
          <tr key={example.example_id}>
            <td className='border border-slate-300 text-center'>
              {example.example_id}
            </td>
            <td className='border border-slate-300'>{example.example_kind}</td>
            <td className='border border-slate-300'>{example.example_name}</td>
            <td className='border border-slate-300'>{example.created_at}</td>
            <td className='border border-slate-300'>
              {example.is_completed ? 'Completed' : 'Running'}
            </td>
            <td className='border border-slate-300'>{example.updated_at}</td>
            <td className='border border-slate-300'>
              <Link
                href={`/dashboard/run-example/log/${example.example_id}`}
                className='text-blue-500 hover:text-blue-700 hover:underline underline-offset-4'
              >
                view log
              </Link>
            </td>
            <td className='border border-slate-300'>
              {example.is_completed ? (
                <Link
                  href={`/dashboard/run-example/result/${example.example_id}`}
                  className='text-blue-500 hover:text-blue-700 hover:underline underline-offset-4'
                >
                  view result
                </Link>
              ) : (
                'Running'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function StartExampleBtn ({
  setAllExamples
}: {
  setAllExamples: React.Dispatch<React.SetStateAction<Example[]>>
}) {
  const [exampleKind, setExampleKind] = useState('netflow')
  const handleSelectExampleKind = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExampleKind(e.target.value)
  }
  return (
    <div className='mt-4 flex space-x-4'>
      <select
        value={exampleKind}
        onChange={handleSelectExampleKind}
        className='px-3 py-2 rounded bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
      >
        <option value='netflow'>netflow</option>
        <option value='integration'>integration</option>
      </select>
      <button
        className='px-4 py-2 rounded bg-sky-500 hover:bg-sky-600 text-sky-50 text-center'
        onClick={() => startExample(exampleKind, setAllExamples)}
      >
        Start Example
      </button>
    </div>
  )
}

async function startExample (
  exampleKind: string,
  setAllExamples: React.Dispatch<React.SetStateAction<Example[]>>
) {
  const response = await fetch('/api/run-example/create/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ example_kind: exampleKind })
  })
  const status = await response.json()
  if (status.is_successful) {
    getAllExamples(setAllExamples)
  }
}
