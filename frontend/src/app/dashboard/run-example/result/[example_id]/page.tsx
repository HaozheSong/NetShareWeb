'use client'
import React from 'react'
import { useEffect, useState } from 'react'

import Plot from 'react-plotly.js'
import './result.css'

let example_id: number

export default function Result ({ params }: { params: { example_id: number } }) {
  example_id = params.example_id
  const [resultJSXElements, setResultJSXElements] = useState(
    [] as Array<JSX.Element>
  )
  useEffect(() => {
    getResult(example_id, setResultJSXElements)
  }, [])
  return <>{resultJSXElements.map(element => element)}</>
}

async function getResult (
  example_id: number,
  setResultJSXElements: React.Dispatch<React.SetStateAction<JSX.Element[]>>
) {
  const response = await fetch(
    `/api/run-example/read/result/?example_id=${example_id}`
  )
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
  for (const property in resultJson) {
    if (Array.isArray(resultJson[property])) {
      const metricsArray = resultJson[property]
      const imageJson = await getImageJson(example_id, property)
      const metricsElement = (
        <div id={property} key={property}>
          <p>
            <span className='font-medium mr-4'>{property}</span>
            score:{metricsArray[0]}, best:{metricsArray[1]}, worst:
            {metricsArray[2]}
          </p>
          <Plot data={imageJson['data']} layout={imageJson['layout']} className='plotly-img mb-4'/>
        </div>
      )
      resultJSXElements.push(metricsElement)
    } else {
      const headingElement = renderHeadingElement(property, depth)
      resultJSXElements.push(headingElement)
      await renderResultJson(resultJson[property], depth + 1, resultJSXElements)
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

async function getImageJson (example_id: number, imageHtmlName: string) {
  const response = await fetch(
    `/api/run-example/read/result/?example_id=${example_id}&file_name=${imageHtmlName}.json`
  )
  const json = await response.json()
  return json
}
