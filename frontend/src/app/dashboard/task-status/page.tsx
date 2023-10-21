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
  for (let task of allTasks) {
    task.created_at = toLocalTime(task.created_at)
    task.updated_at = toLocalTime(task.updated_at)
  }
  setAllTasks(allTasks)
}

function toLocalTime (utcString: string) {
  const time = new Date(utcString)
  const padZero = (num: number) => (num < 10 ? `0${num}` : num)

  const month = padZero(time.getMonth() + 1)
  const date = padZero(time.getDate())
  const hour = padZero(time.getHours())
  const minute = padZero(time.getMinutes())
  const second = padZero(time.getSeconds())

  const localTimeStr = `${time.getFullYear()}${month}${date}-${hour}${minute}${second}`
  return localTimeStr
}
