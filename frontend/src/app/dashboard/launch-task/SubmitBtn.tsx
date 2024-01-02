import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

import configTemplate from './configTemplate'
import { HeaderInfo } from './StartTaskForm'

const submitBtnTextDefault = <>Launch Task</>
const submitBtnTextUploading = (
  <>
    <svg
      className='!fill-none inline-svg animate-spin mr-3 text-white'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
    >
      <circle
        className='opacity-25'
        cx='12'
        cy='12'
        CSR='10'
        stroke='currentColor'
        strokeWidth='4'
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

interface SubmitBtnProps {
  datasetRef: React.RefObject<HTMLInputElement>
  configRef: React.RefObject<HTMLInputElement>
  configSource: string
  headerInfo: HeaderInfo
}

export default function SubmitBtn (props: SubmitBtnProps) {
  const router = useRouter()
  const [submitBtnText, setSubmitBtnText] = useState(submitBtnTextDefault)
  return (
    <button
      type='button'
      onClick={() =>
        sendForm(
          props.datasetRef,
          props.configRef,
          props.configSource,
          props.headerInfo,
          setSubmitBtnText
        ).then(isSuccessful => {
          if (isSuccessful) {
            router.push('/dashboard/task-status/')
          }
          setSubmitBtnText(submitBtnTextDefault)
        })
      }
      id='submitBtn'
      className='btn-block'
      disabled={submitBtnText === submitBtnTextUploading ? true : false}
    >
      {submitBtnText}
    </button>
  )
}

function generateConfig (headerInfo: HeaderInfo) {
  const config = { ...configTemplate }
  const metadata: Object[] = config.pre_post_processor.config.metadata
  const timeseries: Object[] = config.pre_post_processor.config.timeseries
  for (let key in headerInfo) {
    if (headerInfo[key].type == 'timestamp') {
      config.pre_post_processor.config.timestamp.column = key
    } else {
      const columnObj = { ...headerInfo[key] }
      delete columnObj.type
      delete columnObj.datatype
      columnObj.column = key
      columnObj.type = headerInfo[key].datatype
      if (headerInfo[key].type == 'metadata') {
        metadata.push(columnObj)
      } else if (headerInfo[key].type == 'timeseries') {
        timeseries.push(columnObj)
      }
    }
  }
  return config
}

async function sendForm (
  datasetRef: React.RefObject<HTMLInputElement>,
  configRef: React.RefObject<HTMLInputElement>,
  configSource: string,
  headerInfo: HeaderInfo,
  setSubmitBtnText: React.Dispatch<React.SetStateAction<JSX.Element>>
) {
  const formData = new FormData()
  if (
    datasetRef.current &&
    datasetRef.current.files &&
    datasetRef.current.files[0]
  ) {
    formData.append('dataset', datasetRef.current.files[0])
  } else {
    alert('Invalid dataset file')
    return false
  }

  if (configSource == 'configFromDataset') {
    const config = generateConfig(headerInfo)
    const configFile = new File([JSON.stringify(config)], 'config.json', {
      type: 'application/json'
    })
    formData.append('config', configFile)
  } else if (
    configSource == 'configFromFile' &&
    configRef.current &&
    configRef.current.files &&
    configRef.current.files[0]
  ) {
    formData.append('config', configRef.current.files[0])
  } else {
    alert('Invalid config file')
    return false
  }
  setSubmitBtnText(submitBtnTextUploading)
  const response = await fetch('/api/task/create/', {
    method: 'POST',
    body: formData
  })
  const resp_json = await response.json()
  if (resp_json.is_successful) {
    return true
  }
  return false
}
