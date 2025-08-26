import { useState } from 'react';

export default function StepDocumentUpload({
  onNext,
}: {
  onNext: (docType: string, file: File | null) => void;
}) {
  const [docType, setDocType] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleNext = () => {
    if (!docType || !file) {
      alert('Please select a document type and upload a file.');
      return;
    }
    onNext(docType, file);
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-lg font-bold'>Upload Your Identification Document</h2>

      {/* Document Type Selector */}
      <div>
        <label className='block font-medium mb-2'>Choose Document Type:</label>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className='border p-2 rounded w-full'
        >
          <option value=''>-- Select --</option>
          <option value='drivers_license'>Driver’s License</option>
          <option value='voters_card'>Voter’s Card</option>
          <option value='passport'>International Passport</option>
        </select>
      </div>

      {/* File Upload */}
      <div>
        <label className='block font-medium mb-2'>Upload File:</label>
        <input
          type='file'
          accept='.jpg,.jpeg,.png,.pdf'
          onChange={handleChange}
          className='block w-full'
        />
      </div>

      {/* Preview */}
      {file && (
        <div className='border rounded p-3 bg-gray-50'>
          <p className='font-medium'>Selected File:</p>
          <p className='text-sm text-gray-700'>{file.name}</p>
          {file.type.startsWith('image/') && (
            <img
              src={URL.createObjectURL(file)}
              alt='Preview'
              className='mt-2 max-h-40 rounded shadow'
            />
          )}
        </div>
      )}

      <button
        onClick={handleNext}
        className='btn bg-blue-600 absolute bottom-5 right-5 text-white px-4 py-2 rounded'
      >
        Next
      </button>
    </div>
  );
}
