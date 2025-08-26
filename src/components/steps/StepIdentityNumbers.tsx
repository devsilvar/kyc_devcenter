import { useForm } from 'react-hook-form';
import { useState } from 'react';

interface IdentityNumbers {
  nin?: string;
  bvn?: string;
}

export default function StepIdentityNumbers({
  onNext,
}: {
  onNext: (data: IdentityNumbers) => void;
}) {
  const [method, setMethod] = useState<'nin' | 'bvn' | ''>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IdentityNumbers>();

  const onSubmit = (data: IdentityNumbers) => {
    //implemnetation to verify the Nin and BVN

    // get stored first name and last name from local storage and use it for verifying nin or bvn

    //if create a loading state so whenn it passes...undisable and go to the next box also show a toast

    onNext(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-6 max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md'
    >
      <h2 className='text-xl font-semibold text-gray-800 text-center'>
        Identity Verification
      </h2>
      <p className='text-sm text-gray-500 text-center'>
        Select a method and provide your details
      </p>

      {/* Selection */}
      <div className='flex justify-center gap-4'>
        <button
          type='button'
          onClick={() => setMethod('nin')}
          className={`px-4 py-2 rounded-lg border transition ${
            method === 'nin'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
          }`}
        >
          Use NIN
        </button>
        <button
          type='button'
          onClick={() => setMethod('bvn')}
          className={`px-4 py-2 rounded-lg border transition ${
            method === 'bvn'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
          }`}
        >
          Use BVN
        </button>
      </div>

      {/* Conditional input */}
      {method === 'nin' && (
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Enter NIN
          </label>
          <input
            {...register('nin', {
              required: 'NIN is required',
              pattern: {
                value: /^[0-9]{11}$/,
                message: 'NIN must be 11 digits',
              },
            })}
            placeholder='11-digit NIN'
            className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
          />
          {errors.nin && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.nin.message as string}
            </p>
          )}
        </div>
      )}

      {method === 'bvn' && (
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Enter BVN
          </label>
          <input
            {...register('bvn', {
              required: 'BVN is required',
              pattern: {
                value: /^[0-9]{11}$/,
                message: 'BVN must be 11 digits',
              },
            })}
            placeholder='11-digit BVN'
            className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
          />
          {errors.bvn && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.bvn.message as string}
            </p>
          )}
        </div>
      )}

      {/* Submit */}
      {method && (
        <button
          type='submit'
          className=' absolute bottom-5 right-5 px-4 py-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'
        >
          Verify & Continue
        </button>
      )}
    </form>
  );
}
