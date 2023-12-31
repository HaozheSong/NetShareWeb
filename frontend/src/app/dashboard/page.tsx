import LineChartDemo from './LineChartDemo'

export default function Dashboard () {
  return (
    <div>
      <div className='mb-4 p-4 bg-sky-200 text-sky-900 rounded-lg'>
        Welcome to NetShare Dashboard!
      </div>
      <div className='grid gap-4 grid-cols-4'>
        <div className='p-8 bg-slate-200 rounded-lg border border-slate-300'>
          <div className='text-4xl text-center mb-4'>3</div>
          <div className='text-xl text-center'>Running Datasets</div>
        </div>
        <div className='p-8 bg-slate-200 rounded-lg border border-slate-300'>
          <div className='text-4xl text-center mb-4'>10</div>
          <div className='text-xl text-center'>Raw Datasets</div>
        </div>
        <div className='p-8 bg-slate-200 rounded-lg border border-slate-300'>
          <div className='text-4xl text-center mb-4'>2</div>
          <div className='text-xl text-center'>Custom Models</div>
        </div>
        <div className='p-8 bg-slate-200 rounded-lg border border-slate-300'>
          <div className='text-4xl text-center mb-4'>5</div>
          <div className='text-xl text-center'>GPUs</div>
        </div>
      </div>
      <div className='w-100 h-[300px] mt-4'>
        <h1 className='my-2 text-center text-2xl'>System Load</h1>
        <LineChartDemo />
      </div>
    </div>
  )
}
