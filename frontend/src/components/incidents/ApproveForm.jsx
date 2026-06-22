import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { FormField } from '@/components/shared/FormField';
import { MultiAssigneeSelect } from '@/components/incidents/MultiAssigneeSelect';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

export function ApproveForm({ assignees = [], onSubmit, isLoading }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = () => {
    if (selectedIds.length === 0) {
      setError('Pilih minimal 1 assignee.');
      return;
    }
    setError('');
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    onSubmit(
      { assignee_ids: selectedIds, approval_notes: notes || null },
      {
        onError: (msg) => setError(msg),
        onSuccess: () => setConfirmOpen(false),
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Setujui Insiden</CardTitle>
        <CardDescription>
          Pilih minimal 1 pelaksana untuk menangani insiden ini.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField label="Assignee" required error={error}>
          <MultiAssigneeSelect
            options={assignees}
            value={selectedIds}
            onChange={setSelectedIds}
            disabled={isLoading}
            error={error}
          />
        </FormField>

        <FormField label="Catatan Approver (opsional)">
          <Textarea
            rows={3}
            placeholder="Tambahkan catatan untuk pelaksana..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={1000}
            disabled={isLoading}
          />
        </FormField>

        <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
          Setujui & Tugaskan
        </Button>
      </CardContent>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Konfirmasi Persetujuan"
        description={`Insiden akan disetujui dan ditugaskan ke ${selectedIds.length} assignee. Lanjutkan?`}
        confirmLabel="Ya, Setujui"
        confirmVariant="success"
        isLoading={isLoading}
        onConfirm={handleConfirm}
      />
    </Card>
  );
}