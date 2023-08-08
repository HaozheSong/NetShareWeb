import Link from 'next/link'
import { Task } from './page'

export default function AllTasksTable ({ allTasks }: { allTasks: Array<Task> }) {
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
