import { ConfigSource, HeaderInfo } from './StartTaskForm'

interface UploadConfigInputProps {
  configSource: ConfigSource
  setConfigSource: React.Dispatch<React.SetStateAction<ConfigSource>>
  configRef: React.RefObject<HTMLInputElement>
  csvHeaders: string[]
  headerInfo: HeaderInfo
  setHeaderInfo: React.Dispatch<HeaderInfo>
}

interface ConfigFromFileProps {
  configSource: ConfigSource
  setConfigSource: React.Dispatch<React.SetStateAction<ConfigSource>>
  configRef: React.RefObject<HTMLInputElement>
}

interface ConfigFromDatasetProps {
  configSource: ConfigSource
  setConfigSource: React.Dispatch<React.SetStateAction<ConfigSource>>
  csvHeaders: string[]
  headerInfo: HeaderInfo
  setHeaderInfo: React.Dispatch<HeaderInfo>
}

export default function UploadConfigInput (props: UploadConfigInputProps) {
  return (
    <div className='my-4'>
      <h1 className='text-2xl font-medium'>Upload Config</h1>
      <ConfigFromFile
        configSource={props.configSource}
        setConfigSource={props.setConfigSource}
        configRef={props.configRef}
      />
      {props.csvHeaders.length ? (
        <ConfigFromDataset
          configSource={props.configSource}
          setConfigSource={props.setConfigSource}
          csvHeaders={props.csvHeaders}
          headerInfo={props.headerInfo}
          setHeaderInfo={props.setHeaderInfo}
        />
      ) : (
        ''
      )}
    </div>
  )
}

function ConfigFromFile (props: ConfigFromFileProps) {
  return (
    <div id='configFromFileContainer' className='mb-4'>
      <div id='configFromFileCheckbox' className='flex items-center'>
        <input
          type='checkbox'
          id='configFromFile'
          className='checkbox'
          checked={props.configSource === 'configFromFile'}
          onChange={() => {
            props.configSource === 'configFromFile'
              ? props.setConfigSource('')
              : props.setConfigSource('configFromFile')
          }}
        />
        <label htmlFor='configFromFile'>From a file</label>
      </div>
      <input
        ref={props.configRef}
        type='file'
        name='config'
        id='config'
        className='block w-full border rounded cursor-pointer file:cursor-pointer file:px-3 file:py-2 file:mr-4 file:rounded file:border-0 file:bg-sky-500 file:text-sky-50'
        onChange={() => props.setConfigSource('configFromFile')}
      />
    </div>
  )
}

function ConfigFromDataset (props: ConfigFromDatasetProps) {
  const ConfigFromDatasetCheckbox = (
    <div id='configFromDatasetCheckbox' className='flex items-center'>
      <input
        type='checkbox'
        id='configFromDataset'
        className='checkbox'
        checked={props.configSource == 'configFromDataset'}
        onChange={() => {
          props.configSource == 'configFromDataset'
            ? props.setConfigSource('')
            : props.setConfigSource('configFromDataset')
        }}
      />
      <label htmlFor='configFromDataset'>
        Generate config from the dataset
      </label>
    </div>
  )

  const ConfigFromDatasetTable = (
    <table
      id='configFromDatasetTable'
      className='table-auto w-full border-collapse border border-slate-400'
    >
      <thead>
        <tr>
          <th className='border border-slate-300'>Headers</th>
          <th className='border border-slate-300'>Define the Header</th>
        </tr>
      </thead>
      <tbody>
        {props.csvHeaders.map(header => (
          <tr key={header}>
            <td className='border border-slate-300'>{header}</td>
            <td className='border border-slate-300 px-4 py-2'>
              <div id={`${header}-type-div`} className='my-1'>
                <label htmlFor={`${header}-type-select`} className='mr-2'>
                  Select the type of this header
                </label>
                <select
                  value={
                    props.headerInfo[header]
                      ? props.headerInfo[header].type
                      : 'default'
                  }
                  onChange={event => {
                    props.setConfigSource('configFromDataset')
                    selectHeaderTypeHandler(
                      header,
                      event.target.value,
                      props.headerInfo,
                      props.setHeaderInfo
                    )
                  }}
                  id={`${header}-type-select`}
                  className='datatype-select'
                >
                  <option value='default' disabled>
                    type
                  </option>
                  <option value='timestamp'>timestamp</option>
                  <option value='metadata'>metadata</option>
                  <option value='timeseries'>timeseries</option>
                </select>
              </div>
              {renderHeaderSubSelections(
                header,
                props.headerInfo,
                props.setHeaderInfo
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  if (props.configSource === 'configFromDataset') {
    return (
      <div id='configFromDatasetContainer' className='mb-4'>
        {ConfigFromDatasetCheckbox}
        {ConfigFromDatasetTable}
      </div>
    )
  }

  return (
    <div id='configFromDatasetContainer' className='mb-4'>
      {ConfigFromDatasetCheckbox}
    </div>
  )
}

function selectHeaderTypeHandler (
  header: string,
  headerType: string,
  headerInfo: HeaderInfo,
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
      className='datatype-select mr-4'
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
          className='datatype-select'
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
            className='datatype-select'
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
            value={(function () {
              if (headerInfo[header].log1p_norm == undefined) {
                return 'default'
              } else {
                return headerInfo[header].log1p_norm.toString()
              }
            })()}
            onChange={event => {
              const newHeaderInfo = { ...headerInfo }
              newHeaderInfo[header].log1p_norm = event.target.value == 'true'
              setHeaderInfo(newHeaderInfo)
            }}
            id={`${header}-float-log1p_norm-select`}
            className='datatype-select'
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
  headerInfo: HeaderInfo,
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
