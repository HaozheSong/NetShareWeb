'use client'

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const data = [
  { name: 'June 14', load: 0.8 },
  { name: 'June 15', load: 0.6 },
  { name: 'June 16', load: 0.2 },
  { name: 'June 17', load: 0.9 },
  { name: 'June 18', load: 0.5 },
  { name: 'June 19', load: 0.4 },
  { name: 'June 20', load: 0.7 }
]

export default function LineChartDemo () {
  return (
    <ResponsiveContainer>
      <LineChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <Line type='monotone' dataKey='load' stroke='#8884d8' strokeWidth={2} />
        <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  )
}
