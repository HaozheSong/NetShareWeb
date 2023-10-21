import Papa from 'papaparse'

interface UploadDatasetInputProps {
  datasetRef: React.RefObject<HTMLInputElement>
  setCsvHeaders: React.Dispatch<React.SetStateAction<string[]>>
}

export default function UploadDatasetInput (props: UploadDatasetInputProps) {
  return (
    <div className='my-4'>
      <label htmlFor='dataset' className='text-lg font-medium'>
        Upload Dataset
      </label>
      <input
        ref={props.datasetRef}
        type='file'
        name='dataset'
        id='dataset'
        className='block w-full border rounded cursor-pointer file:cursor-pointer file:px-3 file:py-2 file:mr-4 file:rounded file:border-0 file:bg-sky-500 file:text-sky-50'
        onChange={event => {
          if (event.target.files && event.target.files[0].type == 'text/csv') {
            parseCsvDataset(event, props.setCsvHeaders)
          }
        }}
      />
    </div>
  )
}

function parseCsvDataset (
  event: React.ChangeEvent<HTMLInputElement>,
  setCsvHeaders: React.Dispatch<React.SetStateAction<string[]>>
) {
  if (event.target.files) {
    const file = event.target.files[0]
    Papa.parse(file, {
      header: true,
      complete: results => {
        const headers = results.meta.fields
        if (headers) setCsvHeaders(headers)
      }
    })
  }
}
