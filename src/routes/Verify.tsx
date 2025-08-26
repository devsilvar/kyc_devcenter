import VerifyForm from '../components/Verifywizard';
export default function Verify() {
  return (
    <div className='max-w-xl mx-auto p-6'>
      <h1 className='text-2xl text-center font-semibold mb-4'>
        Devrecruit Identity Verification
      </h1>
      <VerifyForm />
    </div>
  );
}
