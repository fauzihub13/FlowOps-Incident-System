import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { incidentService } from '@/services/api';
import { useAuthContext } from '@/context/AuthContext';
import { PageHeader } from '@/components/shared/PageHeader';
import { FormField } from '@/components/shared/FormField';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES, PRIORITIES, getErrorMessage, getValidationErrors } from '@/lib/constants';

const schema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter').max(255, 'Judul maksimal 255 karakter'),
  description: z.string().min(30, 'Deskripsi minimal 30 karakter'),
  category: z.string().min(1, 'Kategori wajib dipilih'),
  priority: z.string().min(1, 'Prioritas wajib dipilih'),
  location: z.string().max(255).optional().or(z.literal('')),
  attachment_url: z.string().url('URL tidak valid').optional().or(z.literal('')),
});

export function CreateIncidentPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      priority: '',
      location: '',
      attachment_url: '',
    },
  });

  if (user && user.role !== 'reporter') {
    return (
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-2xl font-semibold">Akses Ditolak</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Hanya role Reporter yang dapat membuat laporan insiden.
        </p>
        <Button asChild className="mt-4">
          <Link to="/dashboard">Kembali ke Dashboard</Link>
        </Button>
      </div>
    );
  }

  const onSubmit = async (values) => {
    setServerError('');
    setIsLoading(true);
    try {
      const payload = {
        ...values,
        location: values.location || null,
        attachment_url: values.attachment_url || null,
      };
      const res = await incidentService.create(payload);
      if (res.success) {
        toast.success(res.message);
        navigate(`/incidents/${res.data.id}`);
      }
    } catch (err) {
      const vErrors = getValidationErrors(err);
      if (vErrors) {
        const first = Object.values(vErrors).flat()[0];
        setServerError(first);
        toast.error(first);
      } else {
        const msg = getErrorMessage(err, 'Gagal membuat laporan.');
        setServerError(msg);
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit text-muted-foreground">
        <Link to="/incidents"><ChevronLeft className="mr-1 h-4 w-4" /> Kembali</Link>
      </Button>

      <PageHeader
        title="Laporkan Insiden Baru"
        description="Jelaskan insiden secara detail untuk mempercepat penanganan."
      />

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {serverError}
              </div>
            )}

            <FormField label="Judul Insiden" required error={errors.title?.message} htmlFor="title">
              <Input
                id="title"
                placeholder="Contoh: Server database tidak bisa diakses"
                {...register('title')}
                disabled={isLoading}
              />
            </FormField>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Kategori" required error={errors.category?.message}>
                <Select
                  value={watch('category')}
                  onValueChange={(v) => setValue('category', v, { shouldValidate: true })}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Prioritas" required error={errors.priority?.message}>
                <Select
                  value={watch('priority')}
                  onValueChange={(v) => setValue('priority', v, { shouldValidate: true })}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih prioritas" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <FormField label="Deskripsi" required error={errors.description?.message} htmlFor="description">
              <Textarea
                id="description"
                rows={6}
                placeholder="Jelaskan secara detail apa yang terjadi, dampak yang dirasakan, dan langkah yang sudah dilakukan (minimal 30 karakter)."
                {...register('description')}
                disabled={isLoading}
              />
            </FormField>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Lokasi (opsional)" error={errors.location?.message} htmlFor="location">
                <Input
                  id="location"
                  placeholder="Contoh: Lantai 3 Ruang Meeting A"
                  {...register('location')}
                  disabled={isLoading}
                />
              </FormField>

              <FormField
                label="URL Lampiran (opsional)"
                error={errors.attachment_url?.message}
                htmlFor="attachment_url"
                description="Link ke foto/video/dokumen pendukung."
              >
                <Input
                  id="attachment_url"
                  type="url"
                  placeholder="https://..."
                  {...register('attachment_url')}
                  disabled={isLoading}
                />
              </FormField>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button asChild variant="outline" disabled={isLoading}>
                <Link to="/incidents">Batal</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Mengirim...' : 'Kirim Laporan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}