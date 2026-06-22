import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { FormField } from '@/components/shared/FormField';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export function ResolveForm({ onSubmit, isLoading }) {
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = () => {
    if (notes.trim().length < 20) {
      setError('Catatan resolusi minimal 20 karakter.');
      return;
    }
    setError('');
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    onSubmit(
      { resolution_notes: notes },
      {
        onError: (msg) => setError(msg),
        onSuccess: () => setConfirmOpen(false),
      }
    );
  };

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <CardTitle className="text-base">Tandai Selesai</CardTitle>
        <CardDescription>
          Selesaikan insiden ini dengan catatan resolusi yang lengkap.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField label="Catatan Resolusi" required error={error}>
          <Textarea
            rows={4}
            placeholder="Jelaskan bagaimana insiden ditangani dan langkah verifikasi yang dilakukan."
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              if (error) setError('');
            }}
            maxLength={2000}
            disabled={isLoading}
          />
        </FormField>
        <Button
          variant="success"
          onClick={handleSubmit}
          disabled={isLoading || notes.trim().length < 20}
          className="w-full"
        >
          Tandai sebagai Selesai
        </Button>
      </CardContent>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Konfirmasi Penyelesaian"
        description="Setelah diselesaikan, status insiden tidak dapat diubah kembali."
        confirmLabel="Ya, Selesaikan"
        confirmVariant="success"
        isLoading={isLoading}
        onConfirm={handleConfirm}
      />
    </Card>
  );
}