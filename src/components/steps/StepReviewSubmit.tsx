import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

interface VerificationStatusProps {
  status: 'success' | 'failed' | 'loading';
}

export default function VerificationStatus({
  status,
}: VerificationStatusProps) {
  return (
    <div className='flex flex-col items-center justify-center h-[300px] space-y-4'>
      {status === 'loading' && (
        <motion.div
          className='w-24 h-24 border-4 border-t-transparent border-blue-500 rounded-full'
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
      )}

      {status === 'success' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 120 }}
          className='flex flex-col items-center space-y-2'
        >
          <CheckCircle className='w-24 h-24 text-green-500' />
          <p className='text-green-600 font-semibold text-xl'>
            Verification Successful
          </p>
        </motion.div>
      )}

      {status === 'failed' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 120 }}
          className='flex flex-col items-center space-y-2'
        >
          <XCircle className='w-24 h-24 text-red-500' />
          <p className='text-red-600 font-semibold text-xl'>
            Verification Failed
          </p>
        </motion.div>
      )}
    </div>
  );
}
