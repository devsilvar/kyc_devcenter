import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VerificationSchema, type VerificationInput } from '../lib/schema';
import { postJSON } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import StepPersonalInfo from './steps/StepPersonalInfo';
import StepIdentityNumbers from './steps/StepIdentityNumbers';
import StepContactBanking from './steps/StepContactBanking';
import StepDocumentUpload from './steps/StepDocumentUpload';
import StepAddressVerification from './steps/StepAdress';
import VerificationStatus from './steps/StepReviewSubmit';

const steps = [
  'Personal Info',
  'Address',
  'Identification Verification Numbers',
  'Banking Account Verification',
  'Document Upload Verification',
  'Liveness Check',
  'Review',
];

export default function VerifyWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const methods = useForm<VerificationInput>({
    resolver: zodResolver(VerificationSchema),
    defaultValues: { consents: { terms: true, dataProcessing: true } },
  });

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  async function onSubmit(payload: VerificationInput) {
    navigate('/success');

    // Your existing submission logic
    const results = [];
    if (payload.nin) results.push(await postJSON('/api/verify-nin', payload));
    if (payload.bvn) results.push(await postJSON('/api/verify-bvn', payload));
    if (payload.address)
      results.push(await postJSON('/api/verify-address', payload));
    if (payload.bankAccount && payload.bankCode)
      results.push(await postJSON('/api/verify-bank', payload));
    if (payload.phone)
      results.push(await postJSON('/api/verify-phone', payload));
    if (payload.dlNumber)
      results.push(await postJSON('/api/verify-dl', payload));
    if (payload.passportNumber)
      results.push(await postJSON('/api/verify-passport', payload));
    if (payload.plateNumber)
      results.push(await postJSON('/api/verify-plate', payload));
    if (payload.votersNumber)
      results.push(await postJSON('/api/verify-voters', payload));
    if (payload.selfieBase64)
      results.push(await postJSON('/api/verify-liveness', payload));

    const decision = await postJSON('/api/decision', { results });
    const typedDecision = decision as { status: string };
    if (typedDecision.status === 'verified') {
      navigate('/success', { state: { decision: typedDecision } });
    } else if (typedDecision.status === 'manual_review') {
      alert("We need a quick manual review. We'll notify you.");
    } else {
      alert('Verification failed. Please contact support.');
    }
  }

  function nextStep() {
    if (step < steps.length - 1) setStep(step + 1);
  }

  function prevStep() {
    if (step > 0) setStep(step - 1);
  }

  return (
    <FormProvider {...methods}>
      {/* REMOVED the outer form element */}
      <div className='max-w-2xl mx-auto p-6 pb-16 bg-white rounded-2xl shadow-lg relative'>
        {/* Progress Bar */}
        {step < 6 && (
          <>
            <div className='flex items-center mb-6'>
              <div className='flex-1 bg-gray-200 h-2 rounded-full'>
                <div
                  className='h-2 bg-blue-600 rounded-full transition-all'
                  style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                />
              </div>
              <span className='ml-3 text-sm text-gray-600'>
                Step {step + 1} of {steps.length}: {steps[step]}
              </span>
            </div>
          </>
        )}

        {/* Step Content */}
        {step === 0 && <StepPersonalInfo onNext={nextStep} />}
        {step === 1 && <StepAddressVerification onNext={nextStep} />}
        {step === 2 && <StepIdentityNumbers onNext={nextStep} />}
        {step === 3 && (
          <StepContactBanking
            onNext={nextStep}
            data={watch()}
            onChange={(field, value) => setValue(field as any, value)}
          />
        )}
        {step === 4 && <StepDocumentUpload onNext={nextStep} />}
        {step === 5 && (
          <div className='space-y-3'>
            <h3 className='text-lg font-medium'>Selfie (Optional)</h3>
            {/* <LivenessCamera
              onCapture={(['capture'])=>setValue('capture')}
            /> */}
            {/* <button
              type='button'
              onClick={nextStep}
              className='ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
            >
              Next
            </button> */}
          </div>
        )}
        {step === 6 && (
          <VerificationStatus
            status={
              methods.formState.isSubmitting
                ? 'loading'
                : methods.formState.isSubmitSuccessful
                ? 'success'
                : 'failed'
            }
          />
        )}
        {/* Navigation Buttons - Updated to not be inside a form */}
        <div className='flex justify-between mt-6'>
          {step > 0 && step < 6 && (
            <button
              type='button'
              onClick={prevStep}
              className='px-4 py-2 bg-gray-200 rounded-lg absolute bottom-5 left-5 hover:bg-gray-300'
            >
              Back
            </button>
          )}

          {step === 5 ? (
            <button
              type='button'
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className='ml-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50'
            >
              {isSubmitting ? 'Verifying...' : 'Submit'}
            </button>
          ) : step !== 5 ? (
            // Next button is now handled inside each step component
            <div></div>
          ) : null}
        </div>
      </div>
    </FormProvider>
  );
}
