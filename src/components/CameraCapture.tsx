import { useEffect, useRef, useState } from 'react';

type Props = {
  onCapture: (frames: string[]) => void;
  facingMode?: 'user' | 'environment';
};

export default function LivenessCamera({
  onCapture,
  facingMode = 'user',
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewFrames, setPreviewFrames] = useState<string[]>([]);
  const [step, setStep] = useState<'blink' | 'turn' | 'smile' | 'done'>(
    'blink'
  );

  useEffect(() => {
    let stream: MediaStream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
        }
      } catch (err) {
        console.error(err);
        setError('Unable to access camera. Please allow permissions.');
      }
    })();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [facingMode]);

  const captureFrame = () => {
    const v = videoRef.current!;
    if (!v.videoWidth || !v.videoHeight) return null;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(v, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  const handleNext = () => {
    const frame = captureFrame();
    if (frame) {
      setPreviewFrames((prev) => [...prev, frame]);
    }

    if (step === 'blink') setStep('turn');
    else if (step === 'turn') setStep('smile');
    else if (step === 'smile') {
      setStep('done');
      onCapture([...previewFrames, frame!]);
    }
  };

  return (
    <div className='space-y-3 text-center'>
      {error && <p className='text-red-500 text-sm'>{error}</p>}

      <video
        ref={videoRef}
        className='w-full rounded aspect-square bg-black'
        playsInline
        muted
        aria-label='Live camera preview'
      />

      {ready && step !== 'done' && (
        <div>
          <p className='text-lg font-semibold mb-2'>
            {step === 'blink' && 'Please BLINK twice'}
            {step === 'turn' && 'Now TURN your head left & right'}
            {step === 'smile' && 'Now SMILE naturally'}
          </p>
          <button
            onClick={handleNext}
            className='px-4 py-2 bg-blue-600 text-white rounded'
          >
            Capture & Continue
          </button>
        </div>
      )}

      {step === 'done' && (
        <div>
          <p className='text-green-600 font-bold'>✅ Liveness check complete</p>
          <div className='grid grid-cols-3 gap-2 mt-2'>
            {previewFrames.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`step-${i}`}
                className='w-full rounded border'
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
