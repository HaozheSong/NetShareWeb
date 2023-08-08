import { useRef, useState } from 'react'
import Papa from 'papaparse'
import configTemplate from './configTemplate'
import { Task, getAllTasks } from './page'

const submitBtnTextDefault = <>Launch Task</>
const submitBtnTextUploading = (
  <>
    <svg
      className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
    >
      <circle
        className='opacity-25'
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        stroke-width='4'
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

const selectClassName =
  'px-2 py-1 text-sm border rounded-md focus:border-blue-500 focus:ring-blue-500'

export default function StartTaskForm ({
  setAllTasks
}: {
  setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>
}) {
  const datasetRef = useRef<HTMLInputElement>(null)
  const configRef = useRef<HTMLInputElement>(null)

  const [submitBtnText, setSubmitBtnText] = useState(submitBtnTextDefault)
  const [datasetHeaders, setDatasetHeaders] = useState([] as Array<string>)
  const [headerInfo, setHeaderInfo] = useState({} as any)
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

  return (
    <form
      method='POST'
      action='/api/task/create/'
      encType='multipart/form-data'
      className='my-4'
    >
      <div className='my-4'>
        <label htmlFor='dataset'>Select Dataset</label>
        <input
          ref={datasetRef}
          type='file'
          name='dataset'
          id='dataset'
          className='block w-full border rounded cursor-pointer file:cursor-pointer file:px-3 file:py-2 file:mr-4 file:rounded file:border-0 file:bg-sky-500 file:text-sky-50'
          onChange={event => {
            parseDataset(event, setDatasetHeaders)
          }}
        />
      </div>
      <div className='my-4'>
        <label htmlFor='config'>Select Config</label>
        <input
          ref={configRef}
          type='file'
          name='config'
          id='config'
          className='block w-full border rounded cursor-pointer file:cursor-pointer file:px-3 file:py-2 file:mr-4 file:rounded file:border-0 file:bg-sky-500 file:text-sky-50'
        />
      </div>
      {datasetHeaders.length == 0 ? (
        ''
      ) : (
        <div>
          <table className='table-auto w-full border-collapse border border-slate-400'>
            <thead>
              <tr>
                <th className='border border-slate-300'>Headers</th>
                <th className='border border-slate-300'>Define the Header</th>
              </tr>
            </thead>
            <tbody>
              {datasetHeaders.map(header => (
                <tr key={header}>
                  <td className='border border-slate-300'>{header}</td>
                  <td className='border border-slate-300 px-4 py-2'>
                    <div id={`${header}-type-div`} className='my-1'>
                      <label htmlFor={`${header}-type-select`} className='mr-2'>
                        Select the type of this header
                      </label>
                      <select
                        value={
                          headerInfo[header]
                            ? headerInfo[header].type
                            : 'default'
                        }
                        onChange={event => {
                          selectHeaderTypeHandler(
                            header,
                            event.target.value,
                            headerInfo,
                            setHeaderInfo
                          )
                        }}
                        id={`${header}-type-select`}
                        className={selectClassName}
                      >
                        <option value='default' disabled>
                          type
                        </option>
                        <option value='timestamp'>timestamp</option>
                        <option value='metadata'>metadata</option>
                        <option value='timeseries'>timeseries</option>
                      </select>
                    </div>
                    {renderHeaderSubSelections(header, headerInfo, setHeaderInfo)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button
        type='button'
        onClick={() =>
          sendForm(datasetRef, configRef, setSubmitBtnText, setAllTasks)
        }
        id='submitBtn'
        className='inline-flex items-center my-4 px-3 py-2 rounded bg-sky-500 hover:bg-sky-600 text-sky-50 disabled:opacity-75 disabled:hover:bg-sky-500 disabled:cursor-not-allowed'
        disabled={submitBtnText === submitBtnTextUploading ? true : false}
      >
        {submitBtnText}
      </button>
    </form>
  )
}

function parseDataset (
  event: React.ChangeEvent<HTMLInputElement>,
  setDatasetHeaders: React.Dispatch<React.SetStateAction<string[]>>
) {
  if (event.target.files) {
    const file = event.target.files[0]
    configTemplate.global_config.original_data_file = file.name
    configTemplate.pre_post_processor.config.timestamp.column = ''
    Papa.parse(file, {
      header: true,
      complete: results => {
        const headers = results.meta.fields
        if (headers) setDatasetHeaders(headers)
      }
    })
  }
}

function selectHeaderTypeHandler (
  header: string,
  headerType: string,
  headerInfo: any,
  setHeaderInfo: React.Dispatch<React.SetStateAction<any>>
) {
  if (headerType == 'timestamp') {
    for (let key in headerInfo) {
      if (headerInfo[key].type == 'timestamp') {
        alert('Error: already set a header as the timestamp')
        return
      }
    }
  }
  const newHeaderInfo = { ...headerInfo }
  newHeaderInfo[header] = {
    type: headerType
  }
  setHeaderInfo(newHeaderInfo)
}

const DatatypeSelect = ({
  header,
  headerInfo,
  setHeaderInfo
}: {
  header: string
  headerInfo: any
  setHeaderInfo: React.Dispatch<React.SetStateAction<any>>
}) => (
  <div id={`${header}-datatype-div`}>
    <label htmlFor={`${header}-datatype-select`} className='mr-2'>
      Select the datatype of this header
    </label>
    <select
      value={
        headerInfo[header].datatype ? headerInfo[header].datatype : 'default'
      }
      onChange={event => {
        const newHeaderInfo = { ...headerInfo }
        newHeaderInfo[header].datatype = event.target.value
        setHeaderInfo(newHeaderInfo)
      }}
      id={`${header}-datatype-select`}
      className={selectClassName + ' mr-4'}
    >
      <option value='default' disabled>
        datatype
      </option>
      <option value='string'>string</option>
      <option value='float'>float</option>
    </select>
  </div>
)

const StringDatatypeSelect = ({
  header,
  headerInfo,
  setHeaderInfo
}: {
  header: string
  headerInfo: any
  setHeaderInfo: React.Dispatch<React.SetStateAction<any>>
}) => {
  if (headerInfo[header].datatype && headerInfo[header].datatype == 'string') {
    return (
      <div id={`${header}-string-encoding-div`} className='my-1'>
        <label htmlFor={`${header}-string-encoding-select`} className='mr-2'>
          Select the encoding for this string header
        </label>
        <select
          value={
            headerInfo[header].encoding
              ? headerInfo[header].encoding
              : 'default'
          }
          onChange={event => {
            const newHeaderInfo = { ...headerInfo }
            newHeaderInfo[header].encoding = event.target.value
            setHeaderInfo(newHeaderInfo)
          }}
          id={`${header}-string-encoding-select`}
          className={selectClassName}
        >
          <option value='default' disabled>
            encoding
          </option>
          <option value='word2vec_port'>word2vec_port</option>
          <option value='word2vec_ip'>word2vec_ip</option>
          <option value='categorical'>categorical</option>
        </select>
      </div>
    )
  } else {
    return ''
  }
}

const FloatDatatypeSelect = ({
  header,
  headerInfo,
  setHeaderInfo
}: {
  header: string
  headerInfo: any
  setHeaderInfo: React.Dispatch<React.SetStateAction<any>>
}) => {
  if (headerInfo[header].datatype && headerInfo[header].datatype == 'float') {
    return (
      <>
        <div id={`${header}-float-normalization-div`} className='my-1'>
          <label
            htmlFor={`${header}-float-normalization-select`}
            className='mr-2'
          >
            Select the normalization for this float header
          </label>
          <select
            value={
              headerInfo[header].normalization
                ? headerInfo[header].normalization
                : 'default'
            }
            onChange={event => {
              const newHeaderInfo = { ...headerInfo }
              newHeaderInfo[header].normalization = event.target.value
              setHeaderInfo(newHeaderInfo)
            }}
            id={`${header}-float-normalization-select`}
            className={selectClassName}
          >
            <option value='default' disabled>
              normalization
            </option>
            <option value='MINUSONE_ONE'>MINUSONE_ONE</option>
            <option value='ZERO_ONE'>ZERO_ONE</option>
          </select>
        </div>

        <div id={`${header}-float-log1p_norm-div`} className='my-1'>
          <label htmlFor={`${header}-float-log1p_norm-select`} className='mr-2'>
            Select the log1p_norm for this float header
          </label>
          <select
            value={
              headerInfo[header].log1p_norm
                ? headerInfo[header].log1p_norm
                : 'default'
            }
            onChange={event => {
              const newHeaderInfo = { ...headerInfo }
              newHeaderInfo[header].log1p_norm = event.target.value
              setHeaderInfo(newHeaderInfo)
            }}
            id={`${header}-float-log1p_norm-select`}
            className={selectClassName}
          >
            <option value='default' disabled>
              log1p_norm
            </option>
            <option value='true'>true</option>
            <option value='false'>false</option>
          </select>
        </div>
      </>
    )
  } else {
    return ''
  }
}

function renderHeaderSubSelections (
  header: string,
  headerInfo: any,
  setHeaderInfo: React.Dispatch<React.SetStateAction<any>>
) {
  if (headerInfo[header] == undefined) return ''

  const element = (
    <>
      <DatatypeSelect
        header={header}
        headerInfo={headerInfo}
        setHeaderInfo={setHeaderInfo}
      />
      <StringDatatypeSelect
        header={header}
        headerInfo={headerInfo}
        setHeaderInfo={setHeaderInfo}
      />
      <FloatDatatypeSelect
        header={header}
        headerInfo={headerInfo}
        setHeaderInfo={setHeaderInfo}
      />
    </>
  )

  if (headerInfo[header].type == 'metadata') {
    return element
  }
  if (headerInfo[header].type == 'timeseries') {
    return element
  }
}

async function sendForm (
  datasetRef: React.RefObject<HTMLInputElement>,
  configRef: React.RefObject<HTMLInputElement>,
  setSubmitBtnText: React.Dispatch<React.SetStateAction<JSX.Element>>,
  setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>
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
    return
  }
  if (
    configRef.current &&
    configRef.current.files &&
    configRef.current.files[0]
  ) {
    formData.append('config', configRef.current.files[0])
  } else {
    alert('Invalid config file')
    return
  }
  setSubmitBtnText(submitBtnTextUploading)
  const response = await fetch('/api/task/create/', {
    method: 'POST',
    body: formData
  })
  const resp_json = await response.json()
  if (resp_json.is_successful) {
    getAllTasks(setAllTasks)
    setSubmitBtnText(submitBtnTextDefault)
  }
}
