import { Task } from './page'

export async function getAllTasks (
  setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>
) {
  const response = await fetch('/api/task/read/all/')
  const allTasks: Array<Task> = await response.json()
  setAllTasks(allTasks)
}
