import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { FormField } from '@/components/shared/FormField';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export function DeclineForm({ onSubmit, isLoading }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = () => {
    if (reason.trim().length < 10) {
      setError('Alasan penolakan minimal 10 karakter.');
      return;
    }
    setError('');
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    onSubmit(
      { rejection_reason: reason },
      {
        onError: (msg) => setError(msg),
        onSuccess: () => setConfirmOpen(false),
      }
    );
  };

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="text-base">Tolak Insiden</CardTitle>
        <CardDescription>
          Berikan alasan penolakan yang jelas agar pelapor dapat memahami keputusan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField label="Alasan Penolakan" required error={error}>
          <Textarea
            rows={3}
            placeholder="Contoh: Duplikat dengan tiket #5 yang sudah diproses."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
            maxLength={500}
            disabled={isLoading}
          />
        </FormField>

        <Button
          variant="destructive"
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full"
        >
          Tolak Insiden
        </Button>
      </CardContent>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Konfirmasi Penolakan"
        description="Insiden akan ditandai sebagai ditolak dan tidak dapat diubah kembali."
        confirmLabel="Ya, Tolak"
        confirmVariant="destructive"
        isLoading={isLoading}
        onConfirm={handleConfirm}
      />
    </Card>
  );
}