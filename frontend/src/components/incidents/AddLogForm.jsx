import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { FormField } from '@/components/shared/FormField';

export function AddLogForm({ onSubmit, isLoading }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (message.trim().length < 5) {
      setError('Catatan minimal 5 karakter.');
      return;
    }
    setError('');
    onSubmit(
      { message },
      {
        onError: (msg) => setError(msg),
        onSuccess: () => setMessage(''),
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tambah Update Progress</CardTitle>
        <CardDescription>
          Catat perkembangan penanganan insiden ini.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField label="Catatan" required error={error}>
          <Textarea
            rows={3}
            placeholder="Contoh: Sudah koordinasi dengan vendor, teknisi datang jam 14.00."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (error) setError('');
            }}
            maxLength={1000}
            disabled={isLoading}
          />
        </FormField>
        <Button onClick={submit} disabled={isLoading || message.trim().length < 5} className="w-full">
          Tambah Log
        </Button>
      </CardContent>
    </Card>
  );
}