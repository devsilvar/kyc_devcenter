import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { postJSON } from '../../lib/api';

const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First Name is required'),
  lastName: z.string().min(2, 'Last Name is required'),
  phone: z
    .string()
    .regex(/^[0-9]{11}$/, 'Please enter a valid 11-digit phone number'),
});

type PersonalInfo = z.infer<typeof personalInfoSchema>;

const STORAGE_KEY = 'kyc_wizard_data';

export default function StepPersonalInfo({
  onNext,
}: {
  onNext: (data: PersonalInfo) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    mode: 'onBlur',
  });

  // Save form data locally
  useEffect(() => {
    const subscription = watch((value) => {
      const existingData = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '{}'
      );
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...existingData,
          personalInfo: value,
        })
      );
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.personalInfo) {
        Object.entries(parsedData.personalInfo).forEach(([key, value]) => {
          if (value) setValue(key as keyof PersonalInfo, value as string);
        });
      }
    }
  }, [setValue]);

  const onSubmit = async (data: PersonalInfo) => {
    try {
      // Call your backend proxy API (not Smile ID directly)
      const response: any = await postJSON(
        'https://your-project-name.vercel.app/api/verify-phone',
        {
          phoneNumber: data.phone,
          firstName: data.firstName,
          lastName: data.lastName,
        }
      );
      console.log(response);
      if (response?.data) {
        alert('✅ Verification Successful');
        onNext(data); // move to next step regardless, or only if verified
      } else {
        alert('❌ Verification Failed');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-4 mx-auto p-6 bg-white rounded-lg shadow-md w-full'
    >
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>
        Personal Information
      </h2>

      {/* First Name */}
      <div>
        <label className='block text-sm font-medium text-gray-700'>
          First Name
        </label>
        <input
          {...register('firstName')}
          placeholder='John'
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'
        />
        {errors.firstName && (
          <p className='text-red-500 text-sm'>{errors.firstName.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label className='block text-sm font-medium text-gray-700'>
          Last Name
        </label>
        <input
          {...register('lastName')}
          placeholder='Doe'
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'
        />
        {errors.lastName && (
          <p className='text-red-500 text-sm'>{errors.lastName.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label className='block text-sm font-medium text-gray-700'>
          Phone Number
        </label>
        <input
          type='tel'
          {...register('phone')}
          placeholder='08012345678'
          className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'
        />
        {errors.phone && (
          <p className='text-red-500 text-sm'>{errors.phone.message}</p>
        )}
      </div>

      <button
        type='submit'
        disabled={isSubmitting}
        className='bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors w-full'
      >
        {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
      </button>
    </form>
  );
}
