'use client'
import { useEffect, useState } from 'react'

interface Status {
  task_id: number
  is_completed: boolean
  log_file_content: string
}

export default function TaskLog ({ params }: { params: { task_id: number } }) {
  const task_id = params.task_id
  const [log, setLog] = useState('Log will be displayed here.')
  useEffect(() => {
    const interval = setInterval(getLog, 1500, task_id, setLog)
    return () => clearInterval(interval)
  })
  return (
    <pre className='h-full overflow-auto rounded p-4 bg-sky-100 flex flex-col-reverse'>
      {log}
    </pre>
  )
}

async function getLog (
  task_id: number,
  setLog: React.Dispatch<React.SetStateAction<string>>
) {
  const response = await fetch(`/api/task/read/log/?task_id=${task_id}`)
  const status: Status = await response.json()
  setLog(status.log_file_content)
}
