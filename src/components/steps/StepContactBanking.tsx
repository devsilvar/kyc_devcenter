import { useState, useEffect } from 'react';

export default function StepContactBanking({
  data,
  onChange,
  onNext,
}: {
  data: any;
  onChange: (field: string, value: string) => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [banks, setBanks] = useState<{ code: string; name: string }[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [verifiedName, setVerifiedName] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching banks (replace with API later)
    setBanks([
      { code: '044', name: 'Access Bank' },
      { code: '011', name: 'First Bank of Nigeria' },
      { code: '058', name: 'GTBank' },
      { code: '032', name: 'Union Bank' },
      { code: '033', name: 'UBA' },
    ]);
  }, []);

  const validate = () => {
    const newErrors: any = {};
    if (!data.accountNumber?.match(/^\d{10}$/)) {
      newErrors.accountNumber = 'Account number must be 10 digits';
    }
    if (!data.bankCode) {
      newErrors.bankCode = 'Please select a bank';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyBank = async () => {
    if (!validate()) return;
    setVerifying(true);
    setVerifiedName(null);

    try {
      // 🔹 Replace this with real API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock response: return account name if account number ends with even digit
      if (
        parseInt(data.accountNumber[data.accountNumber.length - 1]) % 2 ===
        0
      ) {
        const mockName = 'John Doe';
        setVerifiedName(mockName);
        onChange('accountName', mockName);
      } else {
        throw new Error('Account not found');
      }
    } catch (err: any) {
      setErrors({ accountNumber: err.message || 'Verification failed' });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className='space-y-6 p-4 rounded-xl bg-white shadow-md'>
      <h2 className='text-xl font-semibold text-gray-800'>
        Contact & Banking Information
      </h2>

      {/* Bank Dropdown */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Bank Name
        </label>
        <select
          value={data.bankCode || ''}
          onChange={(e) => {
            onChange('bankCode', e.target.value);
            const selectedBank = banks.find((b) => b.code === e.target.value);
            onChange('bankName', selectedBank?.name || '');
            setVerifiedName(null); // reset verification if bank changes
          }}
          className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500'
        >
          <option value=''>Select a bank</option>
          {banks.map((bank) => (
            <option key={bank.code} value={bank.code}>
              {bank.name}
            </option>
          ))}
        </select>
        {errors.bankCode && (
          <p className='text-red-500 text-xs mt-1'>{errors.bankCode}</p>
        )}
      </div>

      {/* Account Number */}
      {data.bankCode && (
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Account Number
          </label>
          <input
            type='text'
            maxLength={10}
            value={data.accountNumber || ''}
            onChange={(e) => {
              onChange('accountNumber', e.target.value);
              setVerifiedName(null); // reset verification if account changes
            }}
            className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500'
          />
          {errors.accountNumber && (
            <p className='text-red-500 text-xs mt-1'>{errors.accountNumber}</p>
          )}
        </div>
      )}

      {/* Verify Button */}
      {data.bankCode && data.accountNumber?.length === 10 && (
        <button
          type='button'
          onClick={handleVerifyBank}
          disabled={verifying}
          className='w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50'
        >
          {verifying ? 'Verifying...' : 'Verify Bank Details'}
        </button>
      )}

      {/* Show verified account name */}
      {verifiedName && (
        <div className='p-3 bg-green-100 border border-green-300 rounded-lg text-green-800 text-sm'>
          ✅ Verified Account:{' '}
          <span className='font-semibold'>{verifiedName}</span>
        </div>
      )}

      {/* Next button only enabled if verified */}
      <button
        onClick={onNext}
        disabled={!verifiedName}
        className=' bg-blue-600 absolute bottom-5 right-5 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50'
      >
        Next
      </button>
    </div>
  );
}
