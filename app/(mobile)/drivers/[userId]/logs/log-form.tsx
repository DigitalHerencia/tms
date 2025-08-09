'use client';

import { useState, useActionState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import { createDriverLog } from '@/lib/actions/driver/logActions';
import { Button } from '@/components/ui/button';

interface LogFormProps {
  userId: string;
}

interface ActionState {
  success: boolean;
  error?: string;
}

export default function LogForm({ userId }: LogFormProps) {
  const [receiptUrl, setReceiptUrl] = useState('');
  const [state, formAction] = useActionState<ActionState>(
    async (_prev: ActionState, formData: FormData) => {
      formData.set('driverId', userId);
      formData.set('receiptUrl', receiptUrl);
      const result = await createDriverLog(formData);
      return result as ActionState;
    },
    { success: false },
  );

  return (
    <form action={formAction} className="space-y-3">
      <textarea
        name="note"
        className="w-full rounded border p-2 text-sm"
        placeholder="Log description"
      />
      <ImageUploader onUpload={setReceiptUrl} />
      <Button type="submit" className="w-full">Save Log</Button>
      {state?.error && (
        <p className="text-red-500 text-sm">{state.error}</p>
      )}
      {state?.success && !state.error && (
        <p className="text-green-600 text-sm">Log saved successfully</p>
      )}
    </form>
  );
}
