import { useRef, useState } from 'react'
import UploadDatasetInput from './UploadDatasetInput'
import UploadConfigInput from './UploadConfigInput'
import SubmitBtn from './SubmitBtn'

// TODO: make HeaderInfo more accurate
export type HeaderInfo = any
const headerInfoExample = {
  traceid: {
    type: 'metadata',
    datatype: 'string',
    encoding: 'word2vec_port'
  },
  timestamp: {
    type: 'timestamp'
  },
  rpcid: {
    type: 'timeseries',
    datatype: 'string',
    encoding: 'categorical'
  },
  rt: {
    type: 'timeseries',
    datatype: 'float',
    normalization: 'MINUSONE_ONE',
    log1p_norm: false
  }
}

export type ConfigSource = '' | 'configFromFile' | 'configFromDataset'

export default function StartTaskForm () {
  const datasetRef = useRef<HTMLInputElement>(null)
  const configRef = useRef<HTMLInputElement>(null)

  const [csvHeaders, setCsvHeaders] = useState([] as Array<string>)
  const [headerInfo, setHeaderInfo] = useState({} as HeaderInfo)
  // configSource = '' | 'configFromFile' | 'configFromDataset'
  const [configSource, setConfigSource] = useState('' as ConfigSource)

  return (
    <form
      method='POST'
      action='/api/task/create/'
      encType='multipart/form-data'
      className='my-4'
    >
      <UploadDatasetInput
        datasetRef={datasetRef}
        setCsvHeaders={setCsvHeaders}
      />

      <UploadConfigInput
        configSource={configSource}
        setConfigSource={setConfigSource}
        configRef={configRef}
        csvHeaders={csvHeaders}
        headerInfo={headerInfo}
        setHeaderInfo={setHeaderInfo}
      />

      <SubmitBtn
        datasetRef={datasetRef}
        configRef={configRef}
        configSource={configSource}
        headerInfo={headerInfo}
      />
    </form>
  )
}
