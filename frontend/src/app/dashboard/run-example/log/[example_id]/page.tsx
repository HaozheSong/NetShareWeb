'use client'
import { useEffect, useState } from 'react'

interface Status {
  example_id: number
  is_completed: boolean
  log_file_content: string
}

export default function example ({
  params
}: {
  params: { example_id: number }
}) {
  const example_id = params.example_id
  const [log, setLog] = useState('Log will be displayed here.')
  useEffect(() => {
    
    const interval = setInterval(getLog, 1500, example_id, setLog)
    return () => clearInterval(interval)
  })
  return (
    <pre className='h-full overflow-auto rounded p-4 bg-sky-100 flex flex-col-reverse'>
      {log}
    </pre>
  )
}

async function getLog (
  example_id: number,
  setLog: React.Dispatch<React.SetStateAction<string>>
) {
  const response = await fetch(`/api/run-example/read/log/?example_id=${example_id}`)
  const status: Status = await response.json()
  setLog(status.log_file_content)
}
