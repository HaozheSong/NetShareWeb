'use client'
import { use, useState } from 'react'

interface ExampleStatus {
  exampleId: number
  isCompleted: boolean
  message: string
}

export default function runExample () {
  const [btnText, setBtnText] = useState(<>Run netflow Example</>)
  const [log, setLog] = useState('Logs will be shown here.')
  return (
    <div className='flex flex-col h-full'>
      <div className='grow-0'>
        <button
          className='block w-full py-2 bg-sky-500 hover:bg-sky-600 rounded text-sky-50 text-center'
          onClick={() => startExample(setBtnText, setLog)}
        >
          {btnText}
        </button>
      </div>
      <div className='grow mt-4 overflow-auto'>
        <pre className='h-full overflow-auto rounded p-4 bg-sky-100'>
          {log}
        </pre>
      </div>
    </div>
  )
}

const spinner = (
  <svg
    className='animate-spin inline relative bottom-0.5 mr-3 h-5 w-5 text-white'
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
  >
    <circle
      className='opacity-25'
      cx='12'
      cy='12'
      r='10'
      stroke='currentColor'
      stroke-width='4'
    ></circle>
    <path
      className='opacity-75'
      fill='currentColor'
      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
    ></path>
  </svg>
)

async function startExample (
  setBtnText: React.Dispatch<React.SetStateAction<JSX.Element>>,
  setLog: React.Dispatch<React.SetStateAction<string>>
) {
  setBtnText(<>{spinner}Starting the Example</>)
  const response = await fetch('/api/run-example', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  })
  const data: ExampleStatus = await response.json()
  const exampleId = data.exampleId
  const exampleName = 'netflow'
  const message = data.message
  setLog(message)

  setBtnText(<>{spinner}Query example status</>)
  let { isCompleted, accumulativeMsg } = await queryStatus(message, setLog)
  while (!isCompleted) {
    const status = await queryStatus(accumulativeMsg, setLog)
    isCompleted = status.isCompleted
    accumulativeMsg = status.accumulativeMsg
  }

  setBtnText(<>Completed</>)
}

async function queryStatus (
  message: string,
  setLog: React.Dispatch<React.SetStateAction<string>>
) {
  const response = await fetch('/api/run-example')
  const data: ExampleStatus = await response.json()
  const accumulativeMsg = message + data.message
  setLog(accumulativeMsg)
  return { isCompleted: data.isCompleted, accumulativeMsg: accumulativeMsg }
}
