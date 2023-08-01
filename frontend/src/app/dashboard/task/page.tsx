'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface Task {
  task_id: number
  task_kind: string
  task_name: string
  created_at: string
  is_completed: boolean
  completed_at: string
  updated_at: string
}

export default function Task () {
  const [allTasks, setAllTasks] = useState([] as Array<Task>)
  useEffect(() => {
    getAllTasks(setAllTasks)
    const interval = setInterval(getAllTasks, 3000, setAllTasks)
    return () => clearInterval(interval)
  }, [])
  return (
    <>
      <AllTasksTable allTasks={allTasks} />
      <StartTaskForm setAllTasks={setAllTasks} />
    </>
  )
}

async function getAllTasks (
  setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>
) {
  const response = await fetch('/api/task/read/all/')
  const allTasks: Array<Task> = await response.json()
  setAllTasks(allTasks)
}

function AllTasksTable ({ allTasks }: { allTasks: Array<Task> }) {
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
        {allTasks.map(task => (
          <tr key={task.task_id}>
            <td className='border border-slate-300 text-center'>
              {task.task_id}
            </td>
            <td className='border border-slate-300'>{task.task_kind}</td>
            <td className='border border-slate-300'>{task.task_name}</td>
            <td className='border border-slate-300'>{task.created_at}</td>
            <td className='border border-slate-300'>
              {task.is_completed ? 'Completed' : 'Running'}
            </td>
            <td className='border border-slate-300'>{task.updated_at}</td>
            <td className='border border-slate-300'>
              <Link
                href={`/dashboard/task/log/${task.task_id}`}
                className='text-blue-500 hover:text-blue-700 hover:underline underline-offset-4'
              >
                view log
              </Link>
            </td>
            <td className='border border-slate-300'>
              {task.is_completed ? (
                <Link
                  href={`/dashboard/task/result/${task.task_id}`}
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

function StartTaskForm ({
  setAllTasks
}: {
  setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>
}) {
  const datasetRef = useRef<HTMLInputElement>(null)
  const configRef = useRef<HTMLInputElement>(null)

  const submitBtnTextDefault = <>Submit</>
  const submitBtnTextUploading = (
    <>
      <svg
        className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
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
      Uploading
    </>
  )
  const [submitBtnText, setSubmitBtnText] = useState(submitBtnTextDefault)

  const sendForm = async () => {
    const formData = new FormData()
    if (
      datasetRef.current &&
      datasetRef.current.files &&
      datasetRef.current.files[0]
    ) {
      formData.append('dataset', datasetRef.current.files[0])
    } else {
      alert('Invalid dataset file')
      return
    }
    if (
      configRef.current &&
      configRef.current.files &&
      configRef.current.files[0]
    ) {
      formData.append('config', configRef.current.files[0])
    } else {
      alert('Invalid config file')
      return
    }
    setSubmitBtnText(submitBtnTextUploading)
    const response = await fetch('/api/task/create/', {
      method: 'POST',
      body: formData
    })
    const resp_json = await response.json()
    if (resp_json.is_successful) {
      getAllTasks(setAllTasks)
      setSubmitBtnText(submitBtnTextDefault)
    }
  }
  return (
    <form
      method='POST'
      action='/api/task/create/'
      encType='multipart/form-data'
      className='my-4'
    >
      <div className='my-4'>
        <label htmlFor='dataset'>Select Dataset</label>
        <input
          ref={datasetRef}
          type='file'
          name='dataset'
          id='dataset'
          className='block w-full border rounded cursor-pointer file:cursor-pointer file:px-3 file:py-2 file:mr-4 file:rounded file:border-0 file:bg-sky-500 file:text-sky-50'
        />
      </div>
      <div className='my-4'>
        <label htmlFor='config'>Select Config</label>
        <input
          ref={configRef}
          type='file'
          name='config'
          id='config'
          className='block w-full border rounded cursor-pointer file:cursor-pointer file:px-3 file:py-2 file:mr-4 file:rounded file:border-0 file:bg-sky-500 file:text-sky-50'
        />
      </div>
      <button
        type='button'
        onClick={sendForm}
        id='submitBtn'
        className=' inline-flex items-center my-4 px-3 py-2 rounded bg-sky-500 hover:bg-sky-600 text-sky-50 disabled:opacity-75 disabled:hover:bg-sky-500 disabled:cursor-not-allowed'
        disabled={submitBtnText === submitBtnTextUploading ? true : false}
      >
        {submitBtnText}
      </button>
    </form>
  )
}
