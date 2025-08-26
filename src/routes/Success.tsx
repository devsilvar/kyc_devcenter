import { useLocation } from 'react-router-dom';
export default function Success() {
  const { state } = useLocation() as any;
  return (
    <div className='max-w-md mx-auto p-6 text-center'>
      <h2 className='text-2xl font-semibold'>✅ Verification Successful</h2>
      <pre className='text-left bg-gray-50 p-3 rounded mt-4 overflow-auto'>
        {JSON.stringify(state?.decision, null, 2)}
      </pre>
      <a href='/' className='btn mt-4 inline-block'>
        Back Home
      </a>
    </div>
  );
}
