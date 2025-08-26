import { useState } from 'react';

export default function StepAddressVerification({
  onNext,
}: {
  onNext: (address: {
    street: string;
    city: string;
    state: string;
    country: string;
  }) => void;
}) {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: 'Nigeria', // default
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!address.street || !address.city || !address.state) {
      alert('Please complete all fields');
      return;
    }
    onNext(address); // pass to parent for API call
  };

  return (
    <div className='space-y-4 max-w-md mx-auto'>
      <h2 className='text-xl font-semibold'>Address Verification</h2>

      <input
        type='text'
        name='street'
        placeholder='Street Address (e.g., 240 Old Ipaja Road)'
        value={address.street}
        onChange={handleChange}
        className='w-full border p-2 rounded'
      />

      <input
        type='text'
        name='city'
        placeholder='City / LGA (e.g., Abule Egba)'
        value={address.city}
        onChange={handleChange}
        className='w-full border p-2 rounded'
      />

      <select
        name='state'
        value={address.state}
        onChange={handleChange}
        className='w-full border p-2 rounded'
      >
        <option value=''>Select State</option>
        <option value='Lagos'>Lagos</option>
        <option value='Abuja'>Abuja (FCT)</option>
        <option value='Ogun'>Ogun</option>
        <option value='Oyo'>Oyo</option>
        <option value='Kano'>Kano</option>
        <option value='Rivers'>Rivers</option>
        {/* add all 36 states for production */}
      </select>

      <select
        name='country'
        value={address.country}
        onChange={handleChange}
        className='w-full border p-2 rounded'
      >
        <option value='Nigeria'>Nigeria</option>
        {/* you can allow other countries if QoreID supports it */}
      </select>

      <button
        onClick={handleSubmit}
        className=' absolute bottom-5 right-5  bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50'
      >
        Verify and Continue
      </button>
    </div>
  );
}
