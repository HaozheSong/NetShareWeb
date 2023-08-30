'use client'
import React from 'react'
import { useEffect, useState } from 'react'

import Plot from 'react-plotly.js'
import './result.css'

let task_id: number

export default function TaskResult ({
  params
}: {
  params: { task_id: number }
}) {
  task_id = params.task_id
  const [resultJSXElements, setResultJSXElements] = useState(
    [] as Array<JSX.Element>
  )
  useEffect(() => {
    getResult(task_id, setResultJSXElements)
  }, [])
  return (
    <>
      <a
        href={`/api/task/read/result/?task_id=${task_id}&file_name=synthetic_data.csv`}
        className='inline-flex items-center my-4 px-3 py-2 rounded bg-sky-500 hover:bg-sky-600 text-sky-50'
      >
        Download synthetic data
      </a>
      {resultJSXElements.map(element => element)}
    </>
  )
}

async function getResult (
  task_id: number,
  setResultJSXElements: React.Dispatch<React.SetStateAction<JSX.Element[]>>
) {
  const response = await fetch(`/api/task/read/result/?task_id=${task_id}`)
  const resultJson = await response.json()

  let resultJSXElements = [] as Array<JSX.Element>
  const initialDepth = 1
  await renderResultJson(resultJson, initialDepth, resultJSXElements)
  setResultJSXElements(resultJSXElements)
}

async function renderResultJson (
  resultJson: any,
  depth: number,
  resultJSXElements: Array<JSX.Element>
) {
  for (const key in resultJson) {
    const value = resultJson[key]
    if ('scores' in value && 'figure_plotly_json' in value) {
      const metricsArray = value['scores']
      let imageJson
      if (value['figure_plotly_json'] == null) {
        imageJson = null
      } else {
        imageJson = await getImageJson(task_id, value['figure_plotly_json'])
      }
      const metricsElement = (
        <div id={key} key={key}>
          <p>
            <span className='font-medium mr-4'>{key}</span>
            score:{metricsArray[0]}, best:{metricsArray[1]}, worst:
            {metricsArray[2]}
          </p>
          {imageJson ? (
            <Plot
              data={imageJson['data']}
              layout={imageJson['layout']}
              className='plotly-img mb-4'
            />
          ) : (
            <p className='mb-4'>No image</p>
          )}
        </div>
      )
      resultJSXElements.push(metricsElement)
    } else {
      const headingElement = renderHeadingElement(key, depth)
      resultJSXElements.push(headingElement)
      await renderResultJson(resultJson[key], depth + 1, resultJSXElements)
    }
  }
}

function renderHeadingElement (text: string, depth: number) {
  const headingLevel = Math.min(depth, 6)
  const fontSizeClass: { [key: number]: string } = {
    1: 'text-3xl',
    2: 'text-2xl',
    3: 'text-xl',
    4: 'text-lg',
    5: 'text-lg',
    6: 'text-lg'
  }
  return React.createElement(
    `h${headingLevel}`,
    { className: fontSizeClass[headingLevel], key: text },
    text
  )
}

async function getImageJson (task_id: number, imageJson: string) {
  const response = await fetch(
    `/api/task/read/result/?task_id=${task_id}&file_name=${imageJson}`
  )
  if (response.status != 200) {
    return null
  } else {
    const json = await response.json()
    return json
  }
}
