import { z } from 'zod';

export const VerificationSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

  nin: z.string().length(11).optional(),
  bvn: z.string().length(11).optional(),

  address: z.string().min(5).optional(),
  bankAccount: z.string().min(10).optional(),
  bankCode: z.string().optional(),

  phone: z.string().min(7).regex(/^[0-9]{11}$/).optional(),

  dlNumber: z.string().optional(),
  passportNumber: z.string().optional(),
  plateNumber: z.string().optional(),
  votersNumber: z.string().optional(),

  selfieBase64: z.string().optional(), // for liveness check

  consents: z.object({
    terms: z.literal(true),
    dataProcessing: z.literal(true)
  })
});

export type VerificationInput = z.infer<typeof VerificationSchema>;

export type Decision = 'approve' | 'review' | 'reject';
export type Status = 'pending' | 'in_progress' | 'verified' | 'failed' | 'manual_review';

export interface VerificationResult {
  status: Status;
  decision: Decision;
  riskScore: number;
  reasons?: string[];
}
