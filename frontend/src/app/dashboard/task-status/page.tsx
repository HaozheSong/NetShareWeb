'use client'
import { useEffect, useState } from 'react'
import AllTasksTable from './AllTasksTable'

export interface Task {
  task_id: number
  task_kind: string
  task_name: string
  created_at: string
  is_completed: boolean
  completed_at: string
  updated_at: string
}

export default function TaskStatusTableView () {
  const [allTasks, setAllTasks] = useState([] as Array<Task>)
  useEffect(() => {
    getAllTasks(setAllTasks)
    const interval = setInterval(getAllTasks, 3000, setAllTasks)
    return () => clearInterval(interval)
  }, [])
  return <AllTasksTable allTasks={allTasks} />
}

async function getAllTasks (
  setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>
) {
  const response = await fetch('/api/task/read/all/')
  const allTasks: Array<Task> = await response.json()
  setAllTasks(allTasks)
}
